import os from "os";
import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/database";
import { logger } from "./utils/logger";
import { registerAllSubscribers } from "./events";
import { registerJobs } from "./jobs";

/* ═══════════════════════════════════════════════════════
   LAN IP RESOLVER
   ═══════════════════════════════════════════════════════
   Finds the first non-internal IPv4 address so we can log
   the LAN URL at startup — useful for testing on a phone
   or another device on the same Wi-Fi network.
*/
function getLanIp(): string | null {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

async function bootstrap() {
  await connectDB();

  // Register event subscribers BEFORE serving traffic
  registerAllSubscribers();

  // Register background jobs
  registerJobs();

  const server = app.listen(env.PORT, () => {
    const lan = getLanIp();

    logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
    if (lan) {
      logger.info(`   LAN:    http://${lan}:${env.PORT}`);
    }
    logger.info(`   Env: ${env.NODE_ENV}`);
    logger.info(`   Health: http://localhost:${env.PORT}/api/health`);
  });

  const shutdown = (signal: string) => {
    logger.info({ signal }, "Shutting down...");
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("unhandledRejection", (err) =>
    logger.error({ err }, "Unhandled rejection")
  );
  process.on("uncaughtException", (err) => {
    logger.error({ err }, "Uncaught exception");
    process.exit(1);
  });
}

bootstrap();