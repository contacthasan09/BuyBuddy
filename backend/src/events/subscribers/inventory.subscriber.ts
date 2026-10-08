import { eventBus, EVENTS } from "../index";
import { logger } from "../../utils/logger";

export function registerInventorySubscribers() {
  eventBus.on(EVENTS.INVENTORY_LOW, (payload: { productId: string; available: number }) => {
    logger.warn(payload, "⚠️  Low stock alert");
    // TODO: notify admin via SMS/email in Phase 4
  });
}