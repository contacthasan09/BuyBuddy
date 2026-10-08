import mongoose, { Document, Schema } from "mongoose";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPMENT_CREATED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED"
  | "FAILED_DELIVERY";

export type PaymentMethod = "COD" | "BKASH" | "NAGAD" | "CARD";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIAL_REFUNDED";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  image?: string;
  unitPrice: number;
  costPrice: number;
  quantity: number;
  subtotal: number;
}

export interface IOrder extends Document {
  invoice: string;
  customerPhone: string;
  customerName: string;
  customerEmail?: string;

  district: string;
  area?: string;
  address: string;
  note?: string;

  items: IOrderItem[];

  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  status: OrderStatus;

  courier?: {
    provider: string;
    consignmentId?: string;
    trackingCode?: string;
  };

  couponCode?: string;

  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    image: String,
    unitPrice: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    invoice: { type: String, required: true, unique: true, index: true },
    customerPhone: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: String,

    district: { type: String, required: true },
    area: String,
    address: { type: String, required: true },
    note: String,

    items: { type: [orderItemSchema], required: true },

    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["COD", "BKASH", "NAGAD", "CARD"],
      default: "COD",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIAL_REFUNDED"],
      default: "PENDING",
    },

    status: {
      type: String,
      enum: [
        "PENDING", "CONFIRMED", "PROCESSING", "SHIPMENT_CREATED", "PICKED_UP",
        "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED",
        "RETURN_REQUESTED", "RETURNED", "FAILED_DELIVERY",
      ],
      default: "PENDING",
      index: true,
    },

    courier: {
      provider: String,
      consignmentId: String,
      trackingCode: String,
    },

    couponCode: String,
  },
  { timestamps: true }
);

orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ customerPhone: 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>("Order", orderSchema);