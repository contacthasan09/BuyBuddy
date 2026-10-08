import { Order } from "../modules/orders/order.model";

/**
 * Generates invoice: ORD-YYYYMMDD-XXXX (4-digit counter per day)
 */
export async function generateInvoice(): Promise<string> {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const prefix = `ORD-${yyyy}${mm}${dd}-`;

  const last = await Order.findOne({
    invoice: { $regex: `^${prefix}` },
  })
    .sort({ invoice: -1 })
    .select("invoice")
    .lean();

  let counter = 1;

  if (last?.invoice) {
    const parts = (last.invoice as string).split("-");
    const lastPart = parts.at(-1);

    if (lastPart) {
      const lastNum = parseInt(lastPart, 10);

      if (!isNaN(lastNum)) {
        counter = lastNum + 1;
      }
    }
  }

  return `${prefix}${String(counter).padStart(4, "0")}`;
}