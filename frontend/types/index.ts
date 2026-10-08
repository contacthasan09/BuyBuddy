/* ═══════════════════════════════════════════════════════
   BD STORE — SHARED TYPES
   ═══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════
   CATEGORY
   ═══════════════════════════════════════════════════════ */
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/* ═══════════════════════════════════════════════════════
   STOCK
   ═══════════════════════════════════════════════════════ */
export interface StockInfo {
  physical: number;
  reserved: number;
  available: number;
}

/* ═══════════════════════════════════════════════════════
   RATING
   ═══════════════════════════════════════════════════════ */
export interface RatingInfo {
  average: number;
  total: number;
}

/* ═══════════════════════════════════════════════════════
   PRODUCT
   ═══════════════════════════════════════════════════════ */
export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  images: string[];
  category?: Category | string;
  costPrice: number;
  sellingPrice: number;
  discountPrice?: number;
  tags: string[];
  status: "draft" | "active" | "archived";
  isFeatured: boolean;
  specifications?: ProductSpecification[];
  stock: StockInfo;
  rating: RatingInfo;
  createdAt: string;
  updatedAt: string;
}

/* ═══════════════════════════════════════════════════════
   CART
   ═══════════════════════════════════════════════════════ */
export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  stockAvailable: number;
}

/* ═══════════════════════════════════════════════════════
   ORDER
   ═══════════════════════════════════════════════════════ */
export interface OrderItem {
  product: string;
  name: string;
  sku: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPMENT_CREATED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED"
  | "FAILED_DELIVERY";

export type PaymentMethod = "COD" | "BKASH" | "NAGAD" | "CARD";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIAL_REFUNDED";

export interface Order {
  _id: string;
  invoice: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  district: string;
  area?: string;
  address: string;
  note?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  courier?: {
    provider: string;
    consignmentId?: string;
    trackingCode?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistory {
  _id: string;
  order: string;
  status: OrderStatus;
  note?: string;
  changedBy: "system" | "admin" | "courier" | "customer";
  createdAt: string;
}

/* ═══════════════════════════════════════════════════════
   CUSTOMER
   ═══════════════════════════════════════════════════════ */
export interface CustomerAddress {
  label?: string;
  district: string;
  area?: string;
  fullAddress: string;
  isDefault?: boolean;
}

export interface Customer {
  _id: string;
  phone: string;
  name: string;
  email?: string;
  addresses: CustomerAddress[];
  totalOrders: number;
  totalSpent: number;
  firstOrderAt?: string;
  lastOrderAt?: string;
  tags: string[];
  notes?: string;
}

/* ═══════════════════════════════════════════════════════
   REVIEWS
   ═══════════════════════════════════════════════════════ */
export interface Review {
  _id: string;
  product: string;
  customerPhone: string;
  customerName: string;
  customerEmail?: string;
  rating: number; // 1-5
  title?: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface ReviewSummary {
  average: number;
  total: number;
  distribution: ReviewDistribution;
}

export interface ReviewListResult {
  items: Review[];
  pagination: Pagination;
  summary: ReviewSummary;
}

/* ═══════════════════════════════════════════════════════
   SHIPMENT
   ═══════════════════════════════════════════════════════ */
export interface Shipment {
  _id: string;
  order: string;
  provider: string;
  consignmentId?: string;
  trackingCode?: string;
  status: string;
  lastMessage?: string;
  events: {
    message: string;
    at: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

/* ═══════════════════════════════════════════════════════
   PAGINATION
   ═══════════════════════════════════════════════════════ */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: Pagination;
}

/* ═══════════════════════════════════════════════════════
   API ENVELOPE
   ═══════════════════════════════════════════════════════ */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* ═══════════════════════════════════════════════════════
   SETTINGS
   ═══════════════════════════════════════════════════════ */
export interface StoreSettings {
  announcement?: string;
  freeDeliveryThreshold?: number;
  deliveryCharges?: Record<string, number>;
  storeName?: string;
  storePhone?: string;
  storeEmail?: string;
  storeAddress?: string;
}

/* ═══════════════════════════════════════════════════════
   ADMIN
   ═══════════════════════════════════════════════════════ */
export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
  twoFactorEnabled?: boolean;
  isActive?: boolean;
  lastLoginAt?: string;
}

export interface AdminSession {
  _id: string;
  ip?: string;
  userAgent?: string;
  lastUsedAt: string;
  expiresAt: string;
  createdAt: string;
}

export interface AuditLogEntry {
  _id: string;
  admin?: string;
  adminEmail?: string;
  action: string;
  resource: string;
  resourceId?: string;
  status: "success" | "failure";
  ip?: string;
  userAgent?: string;
  method?: string;
  path?: string;
  before?: unknown;
  after?: unknown;
  error?: string;
  createdAt: string;
}

/* ═══════════════════════════════════════════════════════
   INVENTORY
   ═══════════════════════════════════════════════════════ */
export interface InventoryItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    sku: string;
    sellingPrice: number;
  };
  physical: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
}

export interface InventoryTransaction {
  _id: string;
  product: string;
  type:
    | "PURCHASE"
    | "ORDER_RESERVE"
    | "ORDER_COMMIT"
    | "ORDER_CANCEL"
    | "RETURN_RECEIVED"
    | "MANUAL_ADJUST";
  quantity: number;
  order?: string;
  note?: string;
  createdAt: string;
}

/* ═══════════════════════════════════════════════════════
   AUTH (ADMIN)
   ═══════════════════════════════════════════════════════ */
export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface TwoFactorRequiredResponse {
  requires2FA: true;
  tempToken: string;
  email: string;
}

export type LoginResult = LoginResponse | TwoFactorRequiredResponse;

/* ═══════════════════════════════════════════════════════
   PAYMENT
   ═══════════════════════════════════════════════════════ */
export interface Payment {
  _id: string;
  order: string;
  method: PaymentMethod;
  provider: string;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

/* ═══════════════════════════════════════════════════════
   COUPON
   ═══════════════════════════════════════════════════════ */
export interface Coupon {
  _id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ═══════════════════════════════════════════════════════
   ANALYTICS
   ═══════════════════════════════════════════════════════ */
export interface AnalyticsOverview {
  todayOrders: number;
  todayRevenue: number;
  todayProfit: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  lowStockCount: number;
  totalCustomers: number;
}

export interface DailySales {
  date: string;
  count: number;
  revenue: number;
  profit: number;
}