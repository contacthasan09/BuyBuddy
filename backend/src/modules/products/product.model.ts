import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  images: string[];
  category?: mongoose.Types.ObjectId;
  costPrice: number;
  sellingPrice: number;
  discountPrice?: number;
  tags: string[];
  status: "draft" | "active" | "archived";
  isFeatured: boolean;
  specifications?: { key: string; value: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true, uppercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    images: { type: [String], default: [] },
    category: { type: Schema.Types.ObjectId, ref: "Category", index: true },
    costPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    tags: { type: [String], default: [], index: true },
    status: { type: String, enum: ["draft", "active", "archived"], default: "active", index: true },
    isFeatured: { type: Boolean, default: false },
    specifications: {
      type: [{ key: String, value: String }],
      default: [],
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text" });

export const Product = mongoose.model<IProduct>("Product", productSchema);