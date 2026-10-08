import mongoose, { Document, Schema } from "mongoose";

export interface ICustomerAddress {
  label?: string;
  district: string;
  area?: string;
  fullAddress: string;
  isDefault?: boolean;
}

export interface ICustomer extends Document {
  phone: string;
  name: string;
  email?: string;
  addresses: ICustomerAddress[];
  totalOrders: number;
  totalSpent: number;
  firstOrderAt?: Date;
  lastOrderAt?: Date;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<ICustomerAddress>(
  {
    label: String,
    district: { type: String, required: true },
    area: String,
    fullAddress: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const customerSchema = new Schema<ICustomer>(
  {
    phone: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    addresses: { type: [addressSchema], default: [] },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    firstOrderAt: Date,
    lastOrderAt: Date,
    tags: { type: [String], default: [] },
    notes: String,
  },
  { timestamps: true }
);

export const Customer = mongoose.model<ICustomer>("Customer", customerSchema);