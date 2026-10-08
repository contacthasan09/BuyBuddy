import speakeasy from "speakeasy";
import QRCode from "qrcode";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Admin } from "./admin.model";
import { AppError } from "../../utils/AppError";
import { env } from "../../config/env";

/**
 * Generate a new TOTP secret + QR code for the admin.
 * The secret is not saved until the admin verifies it.
 */
export async function setupTwoFactor(adminId: string) {
  const admin = await Admin.findById(adminId);
  if (!admin) throw new AppError("Admin not found", 404);

  const secret = speakeasy.generateSecret({
    name: `${env.STORE_NAME} (${admin.email})`,
    issuer: env.STORE_NAME,
    length: 32,
  });

  const otpauthUrl = secret.otpauth_url || "";
  const qrDataUrl = await QRCode.toDataURL(otpauthUrl);

  return {
    secret: secret.base32,
    qrCode: qrDataUrl,
    otpauthUrl,
  };
}

/**
 * Verify a TOTP code against a secret.
 */
export function verifyTotp(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1, // allow ±30 seconds clock drift
  });
}

/**
 * Enable 2FA after verifying the setup code.
 * Generates 10 backup codes and hashes them for storage.
 */
export async function enableTwoFactor(adminId: string, secret: string, token: string) {
  if (!verifyTotp(secret, token)) {
    throw new AppError("Invalid verification code", 400);
  }

  // Generate 10 backup codes
  const plainCodes: string[] = [];
  const hashedCodes: { codeHash: string }[] = [];

  for (let i = 0; i < 10; i++) {
    const code = crypto.randomBytes(5).toString("hex").toUpperCase(); // 10-char hex
    plainCodes.push(code);
    hashedCodes.push({ codeHash: await bcrypt.hash(code, 10) });
  }

  await Admin.findByIdAndUpdate(adminId, {
    twoFactorEnabled: true,
    twoFactorSecret: secret,
    backupCodes: hashedCodes,
  });

  return { backupCodes: plainCodes };
}

/**
 * Disable 2FA (requires password + current TOTP code).
 */
export async function disableTwoFactor(
  adminId: string,
  password: string,
  token: string
) {
  const admin = await Admin.findById(adminId).select(
    "+password +twoFactorSecret"
  );
  if (!admin) throw new AppError("Admin not found", 404);
  if (!admin.twoFactorEnabled) {
    throw new AppError("2FA is not enabled", 400);
  }

  const match = await admin.comparePassword(password);
  if (!match) throw new AppError("Invalid password", 401);

  if (!admin.twoFactorSecret || !verifyTotp(admin.twoFactorSecret, token)) {
    throw new AppError("Invalid 2FA code", 401);
  }

  await Admin.findByIdAndUpdate(adminId, {
    twoFactorEnabled: false,
    twoFactorSecret: undefined,
    backupCodes: [],
  });
}

/**
 * Verify a 2FA token (TOTP or backup code) during login.
 */
export async function verifyLogin2FA(adminId: string, token: string) {
  const admin = await Admin.findById(adminId).select(
    "+twoFactorSecret +backupCodes"
  );
  if (!admin) throw new AppError("Admin not found", 404);
  if (!admin.twoFactorEnabled) return true;

  const tokenUpper = token.trim().toUpperCase();

  // Try TOTP first
  if (
    admin.twoFactorSecret &&
    verifyTotp(admin.twoFactorSecret, tokenUpper)
  ) {
    return true;
  }

  // Try backup code
  for (const bc of admin.backupCodes || []) {
    if (bc.usedAt) continue; // already used
    const match = await bcrypt.compare(tokenUpper, bc.codeHash);
    if (match) {
      bc.usedAt = new Date();
      await admin.save();
      return true;
    }
  }

  throw new AppError("Invalid 2FA code", 401);
}

/**
 * Check if admin has 2FA enabled.
 */
export async function hasTwoFactor(adminId: string): Promise<boolean> {
  const admin = await Admin.findById(adminId).select("twoFactorEnabled");
  return !!admin?.twoFactorEnabled;
}