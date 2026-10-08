import mongoose, { Document, Schema } from "mongoose";

export interface ISetting extends Document {
  key: string;
  value: any;
  description?: string;
  updatedAt: Date;
}

const settingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Setting = mongoose.model<ISetting>("Setting", settingSchema);