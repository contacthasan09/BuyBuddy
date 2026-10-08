import mongoose, { Document, Schema } from "mongoose";

export interface IInventory extends Document {
  product: mongoose.Types.ObjectId;
  physical: number;    // real units in hand
  reserved: number;    // held for pending orders
  available: number;   // physical - reserved
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
    physical: { type: Number, required: true, default: 0, min: 0 },
    reserved: { type: Number, required: true, default: 0, min: 0 },
    available: { type: Number, required: true, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
  },
  { timestamps: true }
);

inventorySchema.pre("save", function () {
  this.available = Math.max(0, this.physical - this.reserved);
});

export const Inventory = mongoose.model<IInventory>("Inventory", inventorySchema);