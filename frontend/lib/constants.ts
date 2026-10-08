export const BD_DISTRICTS = [
  // ── Dhaka Division ──
  "Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur",
  "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari",
  "Shariatpur", "Tangail",

  // ── Chattogram Division ──
  "Chattogram", "Bandarban", "Brahmanbaria", "Chandpur", "Cumilla",
  "Cox's Bazar", "Feni", "Khagrachhari", "Lakshmipur", "Noakhali",
  "Rangamati",

  // ── Rajshahi Division ──
  "Rajshahi", "Bogura", "Chapainawabganj", "Joypurhat", "Naogaon",
  "Natore", "Pabna", "Sirajganj",

  // ── Khulna Division ──
  "Khulna", "Bagerhat", "Chuadanga", "Jashore", "Jhenaidah", "Kushtia",
  "Magura", "Meherpur", "Narail", "Satkhira",

  // ── Barishal Division ──
  "Barishal", "Barguna", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur",

  // ── Sylhet Division ──
  "Sylhet", "Habiganj", "Moulvibazar", "Sunamganj",

  // ── Rangpur Division ──
  "Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat",
  "Nilphamari", "Panchagarh", "Thakurgaon",

  // ── Mymensingh Division ──
  "Mymensingh", "Jamalpur", "Netrokona", "Sherpur",
] as const;

export const DEFAULT_DELIVERY_CHARGES: Record<string, number> = {
  Dhaka: 60,
  Gazipur: 80,
  Narayanganj: 80,
  Chattogram: 100,
  Sylhet: 120,
  Khulna: 120,
  Rajshahi: 120,
  Barishal: 130,
  Rangpur: 130,
  Mymensingh: 100,
  _default: 130,
};

export const ORDER_STATUS_LABELS_BN: Record<string, string> = {
  PENDING: "অপেক্ষমাণ",
  CONFIRMED: "নিশ্চিত হয়েছে",
  PROCESSING: "প্রস্তুত হচ্ছে",
  SHIPMENT_CREATED: "পাঠানো হয়েছে",
  PICKED_UP: "পিকআপ হয়েছে",
  IN_TRANSIT: "পথে আছে",
  OUT_FOR_DELIVERY: "ডেলিভারির জন্য বের হয়েছে",
  DELIVERED: "ডেলিভারি সম্পন্ন",
  CANCELLED: "বাতিল",
  RETURN_REQUESTED: "ফেরত অনুরোধ",
  RETURNED: "ফেরত হয়েছে",
  FAILED_DELIVERY: "ডেলিভারি ব্যর্থ",
};

export const ORDER_STATUS_LABELS_EN: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPMENT_CREATED: "Shipped",
  PICKED_UP: "Picked Up",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURN_REQUESTED: "Return Requested",
  RETURNED: "Returned",
  FAILED_DELIVERY: "Failed Delivery",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPMENT_CREATED: "bg-indigo-100 text-indigo-800",
  PICKED_UP: "bg-indigo-100 text-indigo-800",
  IN_TRANSIT: "bg-indigo-100 text-indigo-800",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  RETURN_REQUESTED: "bg-orange-100 text-orange-800",
  RETURNED: "bg-gray-100 text-gray-800",
  FAILED_DELIVERY: "bg-red-100 text-red-800",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: "Cash on Delivery",
  BKASH: "bKash",
  NAGAD: "Nagad",
  CARD: "Card",
};

export const STORAGE_KEYS = {
  CART: "bd-cart",
  CHECKOUT: "bd-checkout",
  ADMIN_TOKEN: "bd-admin-token",
} as const;

export const TRUST_BADGES = [
  { icon: "truck", title: "Fast Delivery", subtitle: "2-4 days across BD" },
  { icon: "cash", title: "Cash on Delivery", subtitle: "Pay when you receive" },
  { icon: "shield", title: "Quality Checked", subtitle: "Verified products" },
  { icon: "return", title: "7-Day Returns", subtitle: "Easy returns" },
] as const;