import { EventEmitter } from "events";
import { logger } from "../utils/logger";

class Bus extends EventEmitter {
  emit(event: string | symbol, ...args: any[]): boolean {
    logger.debug({ event }, "Event emitted");
    return super.emit(event, ...args);
  }
}

export const eventBus = new Bus();
export { EVENTS } from "./types";

// At bottom of file, after eventBus export:
export function registerAllSubscribers() {
  const { registerOrderSubscribers } = require("./subscribers/order.subscriber");
  const { registerInventorySubscribers } = require("./subscribers/inventory.subscriber");
  registerOrderSubscribers();
  registerInventorySubscribers();
}