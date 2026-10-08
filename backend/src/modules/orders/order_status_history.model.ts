import mongoose, { Document, Schema } from "mongoose";
import { OrderStatus } from "./order.model";

export interface IOrderStatusHistory extends Document {
  order: mongoose.Types.ObjectId;
  status: OrderStatus;
  note?: string;
  changedBy?: "system" | "admin" | "courier" | "customer";
  createdAt: Date;
}

const schema = new Schema<IOrderStatusHistory>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    status: { type: String, required: true },
    note: String,
    changedBy: { type: String, enum: ["system", "admin", "courier", "customer"], default: "system" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const OrderStatusHistory = mongoose.model<IOrderStatusHistory>(
  "OrderStatusHistory",
  schema
);