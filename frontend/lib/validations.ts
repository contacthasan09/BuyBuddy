export function normalizeBDPhone(input: string): string {
  if (!input) return "";
  const cleaned = input.replace(/\D/g, "");
  if (cleaned.startsWith("880") && cleaned.length === 13) return "0" + cleaned.slice(3);
  if (cleaned.startsWith("88") && cleaned.length === 12) return "0" + cleaned.slice(2);
  if (cleaned.startsWith("01") && cleaned.length === 11) return cleaned;
  return cleaned;
}

export function isValidBDPhone(input: string): boolean {
  const p = normalizeBDPhone(input);
  return /^01[3-9]\d{8}$/.test(p);
}

export interface CheckoutForm {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  district: string;
  area?: string;
  address: string;
  note?: string;
}

export function validateCheckout(data: CheckoutForm): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.customerName?.trim() || data.customerName.trim().length < 2) {
    errors.customerName = "নাম লিখুন (কমপক্ষে ২ অক্ষর)";
  }

  if (!data.customerPhone?.trim()) {
    errors.customerPhone = "মোবাইল নম্বর দিন";
  } else if (!isValidBDPhone(data.customerPhone)) {
    errors.customerPhone = "সঠিক নম্বর দিন (যেমন: 01712345678)";
  }

  if (!data.district?.trim()) {
    errors.district = "জেলা নির্বাচন করুন";
  }

  if (!data.address?.trim() || data.address.trim().length < 5) {
    errors.address = "সম্পূর্ণ ঠিকানা লিখুন";
  }

  return errors;
}