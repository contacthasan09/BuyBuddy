import { ORDER_STATUS_LABELS_EN } from "@/lib/constants";

const COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-blue-50 text-blue-800 border-blue-200",
  PROCESSING: "bg-blue-50 text-blue-800 border-blue-200",
  SHIPMENT_CREATED: "bg-indigo-50 text-indigo-800 border-indigo-200",
  PICKED_UP: "bg-indigo-50 text-indigo-800 border-indigo-200",
  IN_TRANSIT: "bg-indigo-50 text-indigo-800 border-indigo-200",
  OUT_FOR_DELIVERY: "bg-purple-50 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-50 text-green-800 border-green-200",
  CANCELLED: "bg-red-50 text-red-800 border-red-200",
  FAILED_DELIVERY: "bg-red-50 text-red-800 border-red-200",
  RETURN_REQUESTED: "bg-orange-50 text-orange-800 border-orange-200",
  RETURNED: "bg-gray-100 text-gray-800 border-gray-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider border ${
        COLORS[status] || "bg-gray-50 text-gray-700 border-gray-200"
      }`}
      style={{ fontFamily: "var(--font-instrument), system-ui, sans-serif" }}
    >
      {ORDER_STATUS_LABELS_EN[status] || status.replace(/_/g, " ")}
    </span>
  );
}