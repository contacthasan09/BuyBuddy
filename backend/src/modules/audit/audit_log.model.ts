import mongoose, { Document, Schema } from "mongoose";

export interface IAuditLog extends Document {
  admin?: mongoose.Types.ObjectId;
  adminEmail?: string;
  action: string;              // e.g., "order.status.update"
  resource: string;            // e.g., "order"
  resourceId?: string;         // e.g., order _id
  before?: unknown;            // snapshot before change
  after?: unknown;             // snapshot after
  ip?: string;
  userAgent?: string;
  method?: string;
  path?: string;
  status: "success" | "failure";
  error?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    admin: { type: Schema.Types.ObjectId, ref: "Admin", index: true },
    adminEmail: { type: String, index: true },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true, index: true },
    resourceId: { type: String, index: true },
    before: Schema.Types.Mixed,
    after: Schema.Types.Mixed,
    ip: String,
    userAgent: String,
    method: String,
    path: String,
    status: {
      type: String,
      enum: ["success", "failure"],
      default: "success",
      index: true,
    },
    error: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Auto-delete after 1 year
auditLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 365 * 24 * 60 * 60 }
);

// Compound indexes for common queries
auditLogSchema.index({ admin: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1, createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", auditLogSchema);