import mongoose, { Document, Schema } from "mongoose";

export type InventoryTxType =
  | "PURCHASE"
  | "ORDER_RESERVE"
  | "ORDER_COMMIT"
  | "ORDER_CANCEL"
  | "RETURN_RECEIVED"
  | "MANUAL_ADJUST";

export interface IInventoryTx extends Document {
  product: mongoose.Types.ObjectId;
  type: InventoryTxType;
  quantity: number;      // signed: + in, - out
  order?: mongoose.Types.ObjectId;
  note?: string;
  createdAt: Date;
}

const txSchema = new Schema<IInventoryTx>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    type: {
      type: String,
      enum: ["PURCHASE", "ORDER_RESERVE", "ORDER_COMMIT", "ORDER_CANCEL", "RETURN_RECEIVED", "MANUAL_ADJUST"],
      required: true,
    },
    quantity: { type: Number, required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    note: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const InventoryTransaction = mongoose.model<IInventoryTx>(
  "InventoryTransaction",
  txSchema
);