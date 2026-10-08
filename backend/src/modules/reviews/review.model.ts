import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  customerPhone: string;
  customerName: string;
  customerEmail?: string;
  rating: number; // 1-5
  title?: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  orderRef?: mongoose.Types.ObjectId;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    customerPhone: { type: String, required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, lowercase: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, index: true },
    title: { type: String, trim: true, maxlength: 120 },
    comment: { type: String, required: true, trim: true, maxlength: 2000 },
    images: { type: [String], default: [] },
    isVerifiedPurchase: { type: Boolean, default: false },
    orderRef: { type: Schema.Types.ObjectId, ref: "Order" },
    isApproved: { type: Boolean, default: true },
    helpfulCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One review per phone per product
reviewSchema.index({ product: 1, customerPhone: 1 }, { unique: true });

// For listing sorted by date
reviewSchema.index({ product: 1, isApproved: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>("Review", reviewSchema);