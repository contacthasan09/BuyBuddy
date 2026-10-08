export function formatBDT(amount: number): string {
  const n = Number(amount || 0);
  return `৳${n.toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getProductPrice(product: {
  sellingPrice: number;
  discountPrice?: number;
}): number {
  return product.discountPrice && product.discountPrice > 0
    ? product.discountPrice
    : product.sellingPrice;
}

export function getDiscountPercent(product: {
  sellingPrice: number;
  discountPrice?: number;
}): number {
  if (!product.discountPrice || product.discountPrice >= product.sellingPrice) {
    return 0;
  }
  return Math.round(
    ((product.sellingPrice - product.discountPrice) / product.sellingPrice) * 100
  );
}