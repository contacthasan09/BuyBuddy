import { Setting } from "./setting.model";
import { AppError } from "../../utils/AppError";

export async function getSetting(key: string) {
  const s = await Setting.findOne({ key });
  return s?.value ?? null;
}

export async function getAllSettings() {
  const items = await Setting.find().lean();
  return items.reduce<Record<string, any>>((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});
}

export async function getPublicSettings() {
  const publicKeys = [
    "announcement",
    "storeName",
    "storePhone",
    "storeEmail",
    "storeAddress",
    "deliveryCharges",
    "freeDeliveryThreshold",
  ];
  const items = await Setting.find({ key: { $in: publicKeys } }).lean();
  return items.reduce<Record<string, any>>((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});
}

export async function upsertSetting(key: string, value: any, description?: string) {
  return Setting.findOneAndUpdate(
    { key },
    { key, value, description },
    { new: true, upsert: true }
  );
}

export async function bulkUpsert(settings: Record<string, any>) {
  const ops = Object.entries(settings).map(([key, value]) => ({
    updateOne: {
      filter: { key },
      update: { key, value },
      upsert: true,
    },
  }));
  await Setting.bulkWrite(ops);
  return getAllSettings();
}