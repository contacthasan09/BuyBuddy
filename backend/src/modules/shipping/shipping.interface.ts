import { OrderStatus } from "../orders/order.model";

export interface CourierShipmentInput {
  invoice: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  codAmount: number;
  note?: string;
  itemDescription?: string;
  totalLot?: number;
  deliveryType?: 0 | 1; // 0 = home, 1 = hub pickup
}

export interface CourierShipmentResult {
  consignmentId: string;
  trackingCode: string;
  status: OrderStatus;        // ← changed from string
  raw?: unknown;
}

export interface CourierStatusResult {
  status: OrderStatus;        // ← changed from string
  rawStatus: string;          // original courier status (unmapped)
  message?: string;
}

export interface CourierProvider {
  readonly name: string;
  createShipment(input: CourierShipmentInput): Promise<CourierShipmentResult>;
  getStatusByInvoice(invoice: string): Promise<CourierStatusResult>;
  getStatusByTrackingCode(code: string): Promise<CourierStatusResult>;
  getStatusByConsignmentId(id: string): Promise<CourierStatusResult>;
  getBalance(): Promise<number>;
  createReturnRequest(params: { invoice: string; reason?: string }): Promise<any>;
}