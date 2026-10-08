import { connectDB } from "../src/config/database";
import { Admin } from "../src/modules/auth/admin.model";
import { env } from "../src/config/env";
import mongoose from "mongoose";

async function run() {
  await connectDB();

  const existing = await Admin.findOne({ email: env.ADMIN_SEED_EMAIL });
  if (existing) {
    console.log(`✓ Admin already exists: ${env.ADMIN_SEED_EMAIL}`);
  } else {
    await Admin.create({
      name: "Super Admin",
      email: env.ADMIN_SEED_EMAIL,
      password: env.ADMIN_SEED_PASSWORD,
      role: "superadmin",
    });
    console.log(`✅ Admin created: ${env.ADMIN_SEED_EMAIL}`);
    console.log(`   Password: ${env.ADMIN_SEED_PASSWORD}`);
    console.log(`   ⚠️  Change this in production!`);
  }

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});