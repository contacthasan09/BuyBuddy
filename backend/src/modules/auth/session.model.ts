import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  admin: mongoose.Types.ObjectId;
  tokenHash: string;
  ip?: string;
  userAgent?: string;
  device?: string;
  revokedAt?: Date;
  revokedBy?: mongoose.Types.ObjectId;
  revokedReason?: string;
  lastUsedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    ip: String,
    userAgent: String,
    device: String,
    revokedAt: Date,
    revokedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    revokedReason: String,
    lastUsedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }, // ← no `index: true`
  },
  { timestamps: true }
);

// TTL — auto-delete 30 days after expiry (2592000 seconds)
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 2592000 });

export const Session = mongoose.model<ISession>("Session", sessionSchema);