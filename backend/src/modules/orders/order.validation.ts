import { z } from "zod";

export const createOrderSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().min(11).max(15),
  customerEmail: z.string().email().optional().or(z.literal("")),

  district: z.string().min(1),
  area: z.string().optional(),
  address: z.string().min(5).max(500),
  note: z.string().max(500).optional(),

  items: z
    .array(
      z.object({
        productId: z.string().regex(/^[a-f\d]{24}$/i),
        quantity: z.number().int().positive().max(20),
      })
    )
    .min(1),

  paymentMethod: z.enum(["COD", "BKASH", "NAGAD", "CARD"]).default("COD"),

  couponCode: z.string().optional(),
});

export const trackQuerySchema = z.object({
  invoice: z.string().min(5),
  phone: z.string().min(11),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING", "CONFIRMED", "PROCESSING", "SHIPMENT_CREATED", "PICKED_UP",
    "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED",
    "RETURN_REQUESTED", "RETURNED", "FAILED_DELIVERY",
  ]),
  note: z.string().optional(),
});

export const listOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.string().optional(),
  phone: z.string().optional(),
  search: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});