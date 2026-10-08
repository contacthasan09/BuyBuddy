import cron from "node-cron";
import { logger } from "../utils/logger";
import { shipmentRetryJob } from "./shipmentRetry.job";
import { lowStockAlertJob } from "./lowStockAlert.job";

export function registerJobs() {
  logger.info("Registering background jobs...");

  // Every 15 minutes: retry failed shipments
  cron.schedule("*/15 * * * *", async () => {
    try {
      await shipmentRetryJob();
    } catch (err) {
      logger.error({ err }, "shipmentRetryJob failed");
    }
  });

  // Every 6 hours: low-stock alert
  cron.schedule("0 */6 * * *", async () => {
    try {
      await lowStockAlertJob();
    } catch (err) {
      logger.error({ err }, "lowStockAlertJob failed");
    }
  });

  logger.info("Background jobs registered");
}
