import { Order } from "../modules/orders/order.model";
import { createShipmentForOrder } from "../modules/shipping/shipping.service";
import { logger } from "../utils/logger";

export async function shipmentRetryJob() {
  const eligibleOrders = await Order.find({
    status: { $in: ["CONFIRMED", "PROCESSING"] },
    $or: [
      { "courier.consignmentId": { $exists: false } },
      { "courier.consignmentId": null },
      { "courier.consignmentId": "" },
    ],
  })
    .limit(20)
    .sort({ createdAt: -1 });

  if (eligibleOrders.length === 0) {
    return;
  }

  logger.info(
    { count: eligibleOrders.length },
    "Shipment retry job starting"
  );

  let success = 0;
  let failed = 0;

  for (const order of eligibleOrders) {
    try {
      await createShipmentForOrder(order._id.toString());
      success++;
      logger.info({ invoice: order.invoice }, "Retry shipment created");
    } catch (err: any) {
      failed++;
      logger.warn(
        { invoice: order.invoice, error: err?.message },
        "Retry shipment failed"
      );
    }
  }

  logger.info({ success, failed }, "Shipment retry job complete");
}
