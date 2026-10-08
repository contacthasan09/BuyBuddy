import mongoose from "mongoose";
import { Inventory } from "./inventory.model";
import { InventoryTransaction } from "./inventory_transactions.model";
import { eventBus, EVENTS } from "../../events";
import { AppError } from "../../utils/AppError";
import { logger } from "../../utils/logger";

interface OrderItem {
  product: mongoose.Types.ObjectId | string;
  quantity: number;
}

/**
 * Reserve stock for a new order (physical stays same, reserved += qty)
 */
export async function reserveStock(items: OrderItem[], orderId?: mongoose.Types.ObjectId) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      for (const item of items) {
        const inv = await Inventory.findOne({ product: item.product }).session(session);
        if (!inv) throw new AppError(`Inventory missing for product ${item.product}`, 500);

        if (inv.available < item.quantity) {
          throw new AppError(`Insufficient stock for product ${item.product}`, 400);
        }

        inv.reserved += item.quantity;
        inv.available = inv.physical - inv.reserved;
        await inv.save({ session });

        await InventoryTransaction.create(
          [
            {
              product: item.product,
              type: "ORDER_RESERVE",
              quantity: -item.quantity,
              order: orderId,
              note: "Reserved for order",
            },
          ],
          { session }
        );

        if (inv.available <= inv.lowStockThreshold) {
          eventBus.emit(EVENTS.INVENTORY_LOW, {
            productId: inv.product.toString(),
            available: inv.available,
          });
        }
      }
    });
  } finally {
    await session.endSession();
  }
}

/**
 * Commit reserved stock (order confirmed/shipped — physical -= qty, reserved -= qty)
 */
export async function commitStock(items: OrderItem[], orderId?: mongoose.Types.ObjectId) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      for (const item of items) {
        const inv = await Inventory.findOne({ product: item.product }).session(session);
        if (!inv) continue;

        inv.physical = Math.max(0, inv.physical - item.quantity);
        inv.reserved = Math.max(0, inv.reserved - item.quantity);
        inv.available = Math.max(0, inv.physical - inv.reserved);
        await inv.save({ session });

        await InventoryTransaction.create(
          [
            {
              product: item.product,
              type: "ORDER_COMMIT",
              quantity: -item.quantity,
              order: orderId,
              note: "Order confirmed — stock committed",
            },
          ],
          { session }
        );
      }
    });
  } finally {
    await session.endSession();
  }
}

/**
 * Release reserved stock (order cancelled — reserved -= qty, no physical change)
 */
export async function releaseStock(items: OrderItem[], orderId?: mongoose.Types.ObjectId) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      for (const item of items) {
        const inv = await Inventory.findOne({ product: item.product }).session(session);
        if (!inv) continue;

        inv.reserved = Math.max(0, inv.reserved - item.quantity);
        inv.available = Math.max(0, inv.physical - inv.reserved);
        await inv.save({ session });

        await InventoryTransaction.create(
          [
            {
              product: item.product,
              type: "ORDER_CANCEL",
              quantity: item.quantity,
              order: orderId,
              note: "Order cancelled — stock released",
            },
          ],
          { session }
        );
      }
    });
  } finally {
    await session.endSession();
  }
}

/**
 * Admin manually adds stock
 */
export async function addStock(productId: string, quantity: number, note?: string) {
  if (quantity <= 0) throw new AppError("Quantity must be positive", 400);
  const inv = await Inventory.findOne({ product: productId });
  if (!inv) throw new AppError("Inventory not found", 404);

  inv.physical += quantity;
  inv.available = inv.physical - inv.reserved;
  await inv.save();

  await InventoryTransaction.create({
    product: productId,
    type: "PURCHASE",
    quantity,
    note: note || "Manual stock add",
  });

  logger.info({ productId, quantity }, "Stock added");
  return inv;
}

export async function getInventoryByProduct(productId: string) {
  const inv = await Inventory.findOne({ product: productId }).lean();
  if (!inv) throw new AppError("Inventory not found", 404);
  return inv;
}

export async function listInventory() {
  return Inventory.find().populate("product", "name sku sellingPrice").lean();
}

export async function listTransactions(productId?: string, limit = 100) {
  const filter: Record<string, unknown> = {};
  if (productId) filter.product = productId;
  return InventoryTransaction.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("product", "name sku")
    .lean();
}