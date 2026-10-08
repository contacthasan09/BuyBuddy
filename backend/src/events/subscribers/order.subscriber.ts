import { eventBus, EVENTS } from "../index";
import { logger } from "../../utils/logger";
import {
  reserveStock,
  commitStock,
  releaseStock,
} from "../../modules/inventory/inventory.service";
import { recordStatusHistory } from "../../modules/orders/order.service";
import { createShipmentForOrder } from "../../modules/shipping/shipping.service";

/**
 * Auto-shipment flag — set to false to disable auto-creation of
 * Steadfast shipments when an order is confirmed.
 */
const AUTO_CREATE_SHIPMENT = true;

export function registerOrderSubscribers() {
  /* ═══════════════════════════════════════════════════════
     ORDER_CREATED
     ═══════════════════════════════════════════════════════ */
  eventBus.on(EVENTS.ORDER_CREATED, async (order) => {
    try {
      await reserveStock(order.items, order._id);
      await recordStatusHistory(
        order._id,
        "PENDING",
        "Order created",
        "system"
      );
      logger.info({ invoice: order.invoice }, "ORDER_CREATED handled");
    } catch (err) {
      logger.error(
        { err, invoice: order.invoice },
        "ORDER_CREATED handler failed"
      );
    }
  });

  /* ═══════════════════════════════════════════════════════
     ORDER_CONFIRMED — Commit inventory + auto-create shipment
     ═══════════════════════════════════════════════════════ */
  eventBus.on(EVENTS.ORDER_CONFIRMED, async (order) => {
    try {
      await commitStock(order.items, order._id);
      logger.info({ invoice: order.invoice }, "ORDER_CONFIRMED handled");

      // ── Auto-create shipment ───────────────────────────
      if (AUTO_CREATE_SHIPMENT && !order.courier?.consignmentId) {
        try {
          const result = await createShipmentForOrder(order._id.toString());
          logger.info(
            {
              invoice: order.invoice,
              consignmentId: (result as any)?.shipment?.consignmentId,
              trackingCode: (result as any)?.shipment?.trackingCode,
            },
            "Auto-shipment created"
          );
        } catch (shipErr: any) {
          logger.error(
            {
              err: shipErr?.message,
              invoice: order.invoice,
            },
            "Auto-shipment failed — admin can retry manually"
          );
        }
      }
    } catch (err) {
      logger.error({ err }, "ORDER_CONFIRMED handler failed");
    }
  });

  /* ═══════════════════════════════════════════════════════
     ORDER_CANCELLED
     ═══════════════════════════════════════════════════════ */
  eventBus.on(EVENTS.ORDER_CANCELLED, async (order) => {
    try {
      await releaseStock(order.items, order._id);
      logger.info({ invoice: order.invoice }, "ORDER_CANCELLED handled");
    } catch (err) {
      logger.error({ err }, "ORDER_CANCELLED handler failed");
    }
  });

  /* ═══════════════════════════════════════════════════════
     ORDER_DELIVERED
     ═══════════════════════════════════════════════════════ */
  eventBus.on(EVENTS.ORDER_DELIVERED, async (order) => {
    try {
      await recordStatusHistory(
        order._id,
        "DELIVERED",
        "Delivered by courier",
        "system"
      );
      logger.info({ invoice: order.invoice }, "ORDER_DELIVERED handled");
    } catch (err) {
      logger.error({ err }, "ORDER_DELIVERED handler failed");
    }
  });

  /* ═══════════════════════════════════════════════════════
     ORDER_STATUS_CHANGED
     ═══════════════════════════════════════════════════════ */
  eventBus.on(EVENTS.ORDER_STATUS_CHANGED, async (payload) => {
    try {
      const { order, status, note } = payload;
      logger.debug(
        { invoice: order.invoice, status, note },
        "Order status changed"
      );
    } catch (err) {
      logger.error({ err }, "ORDER_STATUS_CHANGED handler failed");
    }
  });
}