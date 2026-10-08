import { OrderStatus } from "../../../orders/order.model";

/**
 * Map Steadfast's statuses → internal OrderStatus.
 * This is the single source of truth.
 */
const MAP: Record<string, OrderStatus> = {
  in_review: "SHIPMENT_CREATED",
  pending: "IN_TRANSIT",
  hold: "IN_TRANSIT",
  delivered: "DELIVERED",
  partial_delivered: "DELIVERED",
  cancelled: "CANCELLED",
  delivered_approval_pending: "DELIVERED",
  partial_delivered_approval_pending: "DELIVERED",
  cancelled_approval_pending: "CANCELLED",
  unknown: "IN_TRANSIT",
  unknown_approval_pending: "IN_TRANSIT",
};

export function mapSteadfastStatus(raw: string): OrderStatus {
  const normalized = raw?.toLowerCase().trim();
  return MAP[normalized] || "IN_TRANSIT";
}