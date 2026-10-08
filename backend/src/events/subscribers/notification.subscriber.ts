import { eventBus, EVENTS } from "../index";
import { logger } from "../../utils/logger";

/**
 * Sends SMS notifications to customers on key order events.
 *
 * For the pilot, this logs to the console. Wire it to a real provider
 * (BulkSMSBD / Alpha SMS / Twilio) by replacing `sendSMS` below.
 */

async function sendSMS(phone: string, message: string) {
  // ── Real provider integration goes here ───────────────
  // Example (pseudo):
  //   await axios.post("https://bulksmsbd.net/api/smsapi", {
  //     api_key: process.env.SMS_API_KEY,
  //     type: "text",
  //     number: phone,
  //     senderid: process.env.SMS_SENDER_ID,
  //     message,
  //   });
  //
  // For now: log to console. Replace when you have SMS credits.
  logger.info(
    { to: phone, message: message.slice(0, 80) },
    "📱 [SMS] Notification (stub)"
  );
}

function formatMessage(template: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce(
    (msg, [key, val]) => msg.replace(new RegExp(`{${key}}`, "g"), val),
    template
  );
}

export function registerNotificationSubscribers() {
  /* ═══════════════════════════════════════════════════════
     ORDER_CREATED — send confirmation SMS
     ═══════════════════════════════════════════════════════ */
  eventBus.on(EVENTS.ORDER_CREATED, async (order) => {
    try {
      const message = formatMessage(
        "BD Store: Order {invoice} received. Total ৳{total}. " +
          "We'll call you shortly to confirm. Track: bdstore.com/track",
        {
          invoice: order.invoice,
          total: String(order.total),
        }
      );
      await sendSMS(order.customerPhone, message);
    } catch (err) {
      logger.error({ err }, "ORDER_CREATED notification failed");
    }
  });

  /* ═══════════════════════════════════════════════════════
     ORDER_CONFIRMED — SMS with confirmation
     ═══════════════════════════════════════════════════════ */
  eventBus.on(EVENTS.ORDER_CONFIRMED, async (order) => {
    try {
      const message = formatMessage(
        "BD Store: Your order {invoice} is confirmed. " +
          "Expected delivery in 2-4 days. Track: bdstore.com/track",
        { invoice: order.invoice }
      );
      await sendSMS(order.customerPhone, message);
    } catch (err) {
      logger.error({ err }, "ORDER_CONFIRMED notification failed");
    }
  });

  /* ═══════════════════════════════════════════════════════
     SHIPMENT_CREATED — SMS with tracking code
     ═══════════════════════════════════════════════════════ */
  eventBus.on(EVENTS.SHIPMENT_CREATED, async (payload) => {
    try {
      const { order, trackingCode } = payload;
      const message = formatMessage(
        "BD Store: Order {invoice} has been shipped. " +
          "Tracking code: {code}. Track: bdstore.com/track",
        { invoice: order.invoice, code: trackingCode }
      );
      await sendSMS(order.customerPhone, message);
    } catch (err) {
      logger.error({ err }, "SHIPMENT_CREATED notification failed");
    }
  });

  /* ═══════════════════════════════════════════════════════
     ORDER_STATUS_CHANGED — status-specific SMS
     ═══════════════════════════════════════════════════════ */
  eventBus.on(EVENTS.ORDER_STATUS_CHANGED, async (payload) => {
    try {
      const { order, status } = payload;

      const messages: Record<string, string> = {
        OUT_FOR_DELIVERY:
          "BD Store: Your order {invoice} is out for delivery today. " +
          "Please keep ৳{total} ready for COD.",
        DELIVERED:
          "BD Store: Order {invoice} delivered. Thank you for shopping " +
          "with us! Leave a review at bdstore.com/track",
        FAILED_DELIVERY:
          "BD Store: We couldn't deliver order {invoice}. " +
          "We'll call you to reschedule.",
        CANCELLED:
          "BD Store: Order {invoice} has been cancelled. " +
          "Contact us if this is a mistake.",
      };

      const template = messages[status];
      if (!template) return;

      const message = formatMessage(template, {
        invoice: order.invoice,
        total: String(order.total),
      });
      await sendSMS(order.customerPhone, message);
    } catch (err) {
      logger.error({ err }, "ORDER_STATUS_CHANGED notification failed");
    }
  });
}