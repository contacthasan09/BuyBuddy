import mongoose, { Document, Schema } from "mongoose";

export interface IWebhookLog extends Document {
  provider: string;
  payload: unknown;
  processed: boolean;
  error?: string;
  createdAt: Date;
}

const webhookLogSchema = new Schema<IWebhookLog>(
  {
    provider: { type: String, required: true, index: true },
    payload: { type: Schema.Types.Mixed, required: true },
    processed: { type: Boolean, default: false },
    error: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const WebhookLog = mongoose.model<IWebhookLog>(
  "WebhookLog",
  webhookLogSchema
);