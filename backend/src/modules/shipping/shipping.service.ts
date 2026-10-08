import { Order } from "../orders/order.model";
import { AppError } from "../../utils/AppError";
import { logger } from "../../utils/logger";
import { steadfastService } from "./providers/steadfast/steadfast.service";
import { updateOrderStatus } from "../orders/order.service";
import { eventBus, EVENTS } from "../../events";
import { CourierProvider } from "./shipping.interface";

// Provider registry (future: add pathao, redx)
const PROVIDERS: Record<string, CourierProvider> = {
  STEADFAST: steadfastService,
};

export function getProvider(name: string): CourierProvider {
  const provider = PROVIDERS[name.toUpperCase()];
  if (!provider) throw new AppError(`Unknown courier provider: ${name}`, 400);
  return provider;
}

export async function createShipmentForOrder(orderId: string, provider = "STEADFAST") {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found", 404);

  if (order.courier?.consignmentId) {
    throw new AppError("Shipment already created for this order", 400);
  }

  // Only orders that are confirmed (or pending → we auto-confirm first) can ship
  if (order.status === "PENDING") {
    await updateOrderStatus(order._id.toString(), "CONFIRMED", "Auto-confirmed for shipment");
    order.status = "CONFIRMED";
  }

  if (!["CONFIRMED", "PROCESSING"].includes(order.status)) {
    throw new AppError(`Cannot create shipment from status ${order.status}`, 400);
  }

  const courier = getProvider(provider);

  const itemDescription = order.items
    .map((i) => `${i.name} x${i.quantity}`)
    .join(", ")
    .slice(0, 200);

  const result = await courier.createShipment({
    invoice: order.invoice,
    recipientName: order.customerName,
    recipientPhone: order.customerPhone,
    recipientAddress: `${order.address}, ${order.area || ""}, ${order.district}`.trim(),
    codAmount: order.paymentMethod === "COD" ? order.total : 0,
    note: order.note,
    itemDescription,
    totalLot: order.items.reduce((s, i) => s + i.quantity, 0),
    deliveryType: 0,
  });

  order.courier = {
    provider: courier.name,
    consignmentId: result.consignmentId,
    trackingCode: result.trackingCode,
  };
  order.status = "SHIPMENT_CREATED";
  await order.save();

  eventBus.emit(EVENTS.SHIPMENT_CREATED, {
    order,
    consignmentId: result.consignmentId,
    trackingCode: result.trackingCode,
  });

  logger.info(
    { invoice: order.invoice, consignmentId: result.consignmentId },
    "Shipment created"
  );

  return {
    order,
    shipment: result,
  };
}

export async function refreshShipmentStatus(orderId: string) {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found", 404);
  if (!order.courier?.provider) throw new AppError("No courier on order", 400);

  const courier = getProvider(order.courier.provider);
  const status = await courier.getStatusByInvoice(order.invoice);

  await updateOrderStatus(
    order._id.toString(),
    status.status,
    `Courier: ${status.rawStatus}`,
    "courier"
  );

  return status;
}

export async function getCourierBalance(provider = "STEADFAST") {
  return getProvider(provider).getBalance();
}

export async function createReturn(orderId: string, reason?: string) {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found", 404);
  if (!order.courier?.provider) throw new AppError("No courier on order", 400);

  const courier = getProvider(order.courier.provider);
  const result = await courier.createReturnRequest({ invoice: order.invoice, reason });

  await updateOrderStatus(
    order._id.toString(),
    "RETURN_REQUESTED",
    reason || "Return requested",
    "admin"
  );

  return result;
}