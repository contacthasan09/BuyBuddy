import { Inventory } from "../modules/inventory/inventory.model";
import { logger } from "../utils/logger";

export async function lowStockAlertJob() {
  const lowStock = await Inventory.find({
    $expr: { $lte: ["$available", "$lowStockThreshold"] },
  })
    .populate("product", "name sku")
    .lean();

  if (lowStock.length === 0) {
    logger.info("No low-stock items");
    return;
  }

  logger.warn(
    {
      count: lowStock.length,
      items: lowStock.map((i) => ({
        product: (i.product as any)?.name || "Unknown",
        available: i.available,
        threshold: i.lowStockThreshold,
      })),
    },
    "Low stock alert"
  );
}
