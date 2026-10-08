import mongoose from "mongoose";
import { Order, OrderStatus } from "./order.model";
import { OrderStatusHistory } from "./order_status_history.model";
import { Product } from "../products/product.model";
import { Inventory } from "../inventory/inventory.model";
import { AppError } from "../../utils/AppError";
import { generateInvoice } from "../../utils/invoice";
import { normalizeBDPhone, isValidBDPhone } from "../../utils/phone";
import { eventBus, EVENTS } from "../../events";
import { upsertCustomerFromOrder } from "../customers/customer.service";
import { getSetting } from "../settings/setting.service";

const DEFAULT_DELIVERY_CHARGES: Record<string, number> = {
  Dhaka: 60,
  Chattogram: 100,
  _default: 120,
};

async function calculateDeliveryCharge(district: string, subtotal: number) {
  const charges =
    (await getSetting("deliveryCharges")) || DEFAULT_DELIVERY_CHARGES;
  const freeThreshold = (await getSetting("freeDeliveryThreshold")) || 0;

  if (freeThreshold > 0 && subtotal >= freeThreshold) return 0;
  return charges[district] ?? charges._default;
}

export async function createOrder(input: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  district: string;
  area?: string;
  address: string;
  note?: string;
  items: { productId: string; quantity: number }[];
  paymentMethod: "COD" | "BKASH" | "NAGAD" | "CARD";
  couponCode?: string;
}) {
  // 1. Validate phone
  if (!isValidBDPhone(input.customerPhone)) {
    throw new AppError("Invalid Bangladeshi phone number", 400);
  }
  const phone = normalizeBDPhone(input.customerPhone);

  // 2. Fetch products + validate
  const productIds = input.items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds }, status: "active" });
  if (products.length !== productIds.length) {
    throw new AppError("One or more products not available", 400);
  }
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  // 3. Check stock + build order items
  const inventories = await Inventory.find({ product: { $in: productIds } });
  const invMap = new Map(inventories.map((i) => [String(i.product), i]));

  const orderItems = [];
  let subtotal = 0;

  for (const line of input.items) {
    const product = productMap.get(line.productId);
    const inv = invMap.get(line.productId);
    if (!product || !inv) throw new AppError("Product not found", 404);
    if (inv.available < line.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    const unitPrice = product.discountPrice && product.discountPrice > 0
      ? product.discountPrice
      : product.sellingPrice;

    const lineTotal = unitPrice * line.quantity;
    subtotal += lineTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      sku: product.sku,
      image: product.images[0],
      unitPrice,
      costPrice: product.costPrice,
      quantity: line.quantity,
      subtotal: lineTotal,
    });
  }

  // 4. Delivery charge
  const deliveryCharge = await calculateDeliveryCharge(input.district, subtotal);

  // 5. Discount (coupon) — stub for now
  const discount = 0;

  const total = subtotal + deliveryCharge - discount;

  // 6. Create order
  const invoice = await generateInvoice();

  const order = await Order.create({
    invoice,
    customerPhone: phone,
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail || undefined,
    district: input.district,
    area: input.area,
    address: input.address.trim(),
    note: input.note,
    items: orderItems,
    subtotal,
    deliveryCharge,
    discount,
    total,
    paymentMethod: input.paymentMethod,
    paymentStatus: "PENDING",
    status: "PENDING",
    couponCode: input.couponCode,
  });

  // 7. Upsert customer CRM record
  await upsertCustomerFromOrder({
    phone,
    name: input.customerName,
    email: input.customerEmail,
    address: {
      district: input.district,
      area: input.area,
      fullAddress: input.address,
      isDefault: true,
    },
    orderTotal: total,
  });

  // 8. Emit event → reserves stock, writes history
  eventBus.emit(EVENTS.ORDER_CREATED, order);

  return order;
}

export async function recordStatusHistory(
  orderId: mongoose.Types.ObjectId,
  status: OrderStatus,
  note?: string,
  changedBy: "system" | "admin" | "courier" | "customer" = "system"
) {
  return OrderStatusHistory.create({ order: orderId, status, note, changedBy });
}

export async function trackOrder(invoice: string, phone: string) {
  const normalized = normalizeBDPhone(phone);
  const order = await Order.findOne({ invoice, customerPhone: normalized }).lean();
  if (!order) throw new AppError("Order not found", 404);

  const history = await OrderStatusHistory.find({ order: order._id })
    .sort({ createdAt: 1 })
    .lean();

  return { order, history };
}

export async function getOrderById(id: string) {
  const order = await Order.findById(id).populate("items.product", "name slug images");
  if (!order) throw new AppError("Order not found", 404);
  const history = await OrderStatusHistory.find({ order: order._id }).sort({ createdAt: 1 });
  return { order, history };
}

export async function listOrders(opts: {
  page: number;
  limit: number;
  status?: string;
  phone?: string;
  search?: string;
  from?: string;
  to?: string;
}) {
  const filter: Record<string, unknown> = {};
  if (opts.status) filter.status = opts.status;
  if (opts.phone) filter.customerPhone = normalizeBDPhone(opts.phone);
  if (opts.search) {
    filter.$or = [
      { invoice: { $regex: opts.search, $options: "i" } },
      { customerName: { $regex: opts.search, $options: "i" } },
      { customerPhone: { $regex: opts.search, $options: "i" } },
    ];
  }
  if (opts.from || opts.to) {
    const range: Record<string, Date> = {};
    if (opts.from) range.$gte = new Date(opts.from);
    if (opts.to) range.$lte = new Date(opts.to);
    filter.createdAt = range;
  }

  const skip = (opts.page - 1) * opts.limit;
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(opts.limit).lean(),
    Order.countDocuments(filter),
  ]);

  return {
    items,
    pagination: { page: opts.page, limit: opts.limit, total, pages: Math.ceil(total / opts.limit) },
  };
}

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "SHIPMENT_CREATED", "CANCELLED"],
  PROCESSING: ["SHIPMENT_CREATED", "CANCELLED"],
  SHIPMENT_CREATED: ["PICKED_UP", "IN_TRANSIT", "CANCELLED"],
  PICKED_UP: ["IN_TRANSIT", "CANCELLED"],
  IN_TRANSIT: ["OUT_FOR_DELIVERY", "FAILED_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "FAILED_DELIVERY"],
  DELIVERED: ["RETURN_REQUESTED"],
  FAILED_DELIVERY: ["OUT_FOR_DELIVERY", "RETURNED", "CANCELLED"],
  CANCELLED: [],
  RETURN_REQUESTED: ["RETURNED", "CANCELLED"],
  RETURNED: [],
};

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  note?: string,
  changedBy: "system" | "admin" | "courier" | "customer" = "admin"
) {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found", 404);

  if (order.status === newStatus) return order;

  const allowed = VALID_TRANSITIONS[order.status as OrderStatus] || [];
  if (!allowed.includes(newStatus)) {
    throw new AppError(
      `Cannot transition from ${order.status} to ${newStatus}`,
      400,
      { allowed }
    );
  }

  order.status = newStatus;
  if (newStatus === "DELIVERED" && order.paymentMethod === "COD") {
    order.paymentStatus = "PAID";
  }
  await order.save();

  await recordStatusHistory(order._id, newStatus, note, changedBy);

  eventBus.emit(EVENTS.ORDER_STATUS_CHANGED, { order, status: newStatus, note });

  if (newStatus === "CONFIRMED") eventBus.emit(EVENTS.ORDER_CONFIRMED, order);
  if (newStatus === "CANCELLED") eventBus.emit(EVENTS.ORDER_CANCELLED, order);
  if (newStatus === "DELIVERED") eventBus.emit(EVENTS.ORDER_DELIVERED, order);

  return order;
}