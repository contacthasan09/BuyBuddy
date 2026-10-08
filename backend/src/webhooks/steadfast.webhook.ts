import { Router, Request, Response } from "express";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { Order } from "../modules/orders/order.model";
import { OrderStatusHistory } from "../modules/orders/order_status_history.model";
import { mapSteadfastStatus } from "../modules/shipping/providers/steadfast/steadfast.mapper";
import { eventBus, EVENTS } from "../events";
import { WebhookLog } from "./webhook_log.model";

const router = Router();

router.post("/steadfast", async (req: Request, res: Response) => {
  const auth = req.headers.authorization || "";
  const expected = `Bearer ${env.STEADFAST_WEBHOOK_TOKEN}`;

  // Save raw payload first (audit trail)
  const log = await WebhookLog.create({
    provider: "STEADFAST",
    payload: req.body,
  });

  if (auth !== expected) {
    await WebhookLog.updateOne({ _id: log._id }, { error: "Unauthorized" });
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const body = req.body || {};
  const { notification_type, invoice, status, tracking_message } = body;

  logger.info({ notification_type, invoice, status }, "Steadfast webhook received");

  try {
    if (!invoice) {
      throw new Error("Missing invoice in webhook payload");
    }

    const order = await Order.findOne({ invoice });
    if (!order) {
      throw new Error(`Order not found for invoice ${invoice}`);
    }

    if (notification_type === "delivery_status") {
      const newStatus = mapSteadfastStatus(status);

      if (order.status !== newStatus) {
        // Courier is source of truth — bypass the local transition map
        order.status = newStatus;
        if (newStatus === "DELIVERED" && order.paymentMethod === "COD") {
          order.paymentStatus = "PAID";
        }
        await order.save();

        await OrderStatusHistory.create({
          order: order._id,
          status: newStatus,
          note: tracking_message || `Courier status: ${status}`,
          changedBy: "courier",
        });

        eventBus.emit(EVENTS.ORDER_STATUS_CHANGED, {
          order,
          status: newStatus,
          note: tracking_message,
          source: "webhook",
        });

        if (newStatus === "DELIVERED") {
          eventBus.emit(EVENTS.ORDER_DELIVERED, order);
        }
      }
    } else if (notification_type === "tracking_update") {
      await OrderStatusHistory.create({
        order: order._id,
        status: order.status,
        note: tracking_message || "Tracking update",
        changedBy: "courier",
      });
    }

    await WebhookLog.updateOne({ _id: log._id }, { processed: true });

    return res.status(200).json({
      status: "success",
      message: "Webhook received successfully.",
    });
  } catch (err: any) {
    logger.error({ err: err.message, invoice }, "Webhook processing failed");
    await WebhookLog.updateOne({ _id: log._id }, { error: err.message });

    // Always return 200 to prevent Steadfast retry storms — payload is logged
    return res.status(200).json({ status: "error", message: err.message });
  }
});

export default router;