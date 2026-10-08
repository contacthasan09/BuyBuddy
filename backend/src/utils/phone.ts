/**
 * Normalize BD phone number to 11-digit format: 01XXXXXXXXX
 * Accepts: +8801..., 8801..., 01..., with spaces/dashes
 */
export function normalizeBDPhone(input: string): string {
  if (!input) return "";
  const cleaned = input.replace(/[^\d]/g, "");

  if (cleaned.startsWith("880") && cleaned.length === 13) return "0" + cleaned.slice(3);
  if (cleaned.startsWith("88") && cleaned.length === 12) return "0" + cleaned.slice(2);
  if (cleaned.startsWith("01") && cleaned.length === 11) return cleaned;

  return cleaned; // fallback — validation layer will catch
}

export function isValidBDPhone(input: string): boolean {
  const p = normalizeBDPhone(input);
  return /^01[3-9]\d{8}$/.test(p);
}