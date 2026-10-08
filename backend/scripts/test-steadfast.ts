import { env } from "../src/config/env";
import { steadfastService } from "../src/modules/shipping/providers/steadfast/steadfast.service";

async function run() {
  console.log("🔍 Testing Steadfast API credentials...\n");

  if (!env.STEADFAST_API_KEY || !env.STEADFAST_SECRET_KEY) {
    console.error("❌ STEADFAST_API_KEY or STEADFAST_SECRET_KEY missing in .env");
    process.exit(1);
  }

  console.log(`   Base URL: ${env.STEADFAST_BASE_URL}`);
  console.log(`   API Key:  ${env.STEADFAST_API_KEY.slice(0, 6)}...`);
  console.log(`   Secret:   ${env.STEADFAST_SECRET_KEY.slice(0, 6)}...\n`);

  try {
    const balance = await steadfastService.getBalance();
    console.log(`✅ Auth OK. Current balance: ৳${balance}`);
    console.log("   You can now create shipments.\n");
  } catch (err: any) {
    console.error("❌ Steadfast test failed:");
    console.error("   Status:", err?.response?.status);
    console.error("   Data:", JSON.stringify(err?.response?.data, null, 2));
    console.error("   Message:", err?.message);
    process.exit(1);
  }
}

run();