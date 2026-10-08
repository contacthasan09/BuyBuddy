import { Customer, ICustomerAddress } from "./customer.model";
import { normalizeBDPhone } from "../../utils/phone";

/**
 * Upsert customer record based on phone.
 * Called from order creation — snapshot name/address but keep CRM fresh.
 */
export async function upsertCustomerFromOrder(data: {
  phone: string;
  name: string;
  email?: string;
  address: ICustomerAddress;
  orderTotal: number;
}) {
  const phone = normalizeBDPhone(data.phone);

  let customer = await Customer.findOne({ phone });

  if (!customer) {
    customer = await Customer.create({
      phone,
      name: data.name,
      email: data.email,
      addresses: [data.address],
      totalOrders: 1,
      totalSpent: data.orderTotal,
      firstOrderAt: new Date(),
      lastOrderAt: new Date(),
    });
    return customer;
  }

  customer.name = data.name;
  if (data.email) customer.email = data.email;
  customer.totalOrders += 1;
  customer.totalSpent += data.orderTotal;
  customer.lastOrderAt = new Date();

  // Update default address if same district changes
  const existingIdx = customer.addresses.findIndex(
    (a) => a.fullAddress === data.address.fullAddress
  );
  if (existingIdx === -1) {
    if (!customer.addresses.some((a) => a.isDefault)) {
      data.address.isDefault = true;
    }
    customer.addresses.push(data.address);
  }

  await customer.save();
  return customer;
}

export async function lookupByPhone(phone: string) {
  const normalized = normalizeBDPhone(phone);
  const customer = await Customer.findOne({ phone: normalized }).lean();
  if (!customer) return null;

  const defaultAddress = customer.addresses.find((a) => a.isDefault) || customer.addresses[0];
  return {
    name: customer.name,
    email: customer.email,
    address: defaultAddress,
  };
}

export const listCustomers = (limit = 100) =>
  Customer.find().sort({ lastOrderAt: -1 }).limit(limit).lean();

export async function getCustomerById(id: string) {
  return Customer.findById(id).lean();
}

export async function updateCustomer(id: string, data: Partial<{
  name: string;
  email: string;
  tags: string[];
  notes: string;
}>) {
  return Customer.findByIdAndUpdate(id, data, { new: true });
}