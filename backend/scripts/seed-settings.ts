import { connectDB } from "../src/config/database";
import { Setting } from "../src/modules/settings/setting.model";
import mongoose from "mongoose";

const DEFAULTS = {
  announcement: "🎉 Free delivery on orders above ৳2000",
  freeDeliveryThreshold: 2000,
  deliveryCharges: {
    Dhaka: 60,
    Chattogram: 100,
    _default: 120,
  },
  storeName: "BD Store",
  storePhone: "01700000000",
  storeEmail: "support@bdstore.com",
  storeAddress: "Dhaka, Bangladesh",
};

async function run() {
  await connectDB();

  for (const [key, value] of Object.entries(DEFAULTS)) {
    await Setting.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true }
    );
    console.log(`✓ Setting: ${key}`);
  }

  console.log("✅ Settings seeded");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});