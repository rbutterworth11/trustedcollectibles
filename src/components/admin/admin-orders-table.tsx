"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCurrency } from "@/lib/currency";

interface Order {
  id: string;
  listing_id: string;
  amount: number;
  status: string;
  created_at: string;
  listing: { title: string } | null;
  buyer: { full_name: string; email: string } | null;
  seller: { full_name: string; email: string } | null;
}

const STATUS_OPTIONS = [
  "all",
  "pending",
  "payment_held",
  "shipped",
  "delivered",
  "completed",
  "refunded",
  "disputed",
] as const;

const STATUS_LABELS: Record<string, string> = {
  all: "All",
  pending: "Pending",
  payment_held: "Payment Held",
  shipped: "Shipped",
  delivered: "Delivered",
  completed: "Completed",
  refunded: "Refunded",
  disputed: "Disputed",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-gray-800 text-gray-400",
  payment_held: "bg-yellow-900/40 text-yellow-400",
  shipped: "bg-blue-900/40 text-blue-400",
  delivered: "bg-green-900/40 text-green-400",
  completed: "bg-emerald-900/40 text-emerald-400",
  refunded: "bg-orange-900/40 text-orange-400",
  disputed: "bg-red-900/40 text-red-400",
};

export default function AdminOrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [filter, setFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const counts: Record<string, number> = { all: orders.length };
  for (const o of orders) {
    counts[o.status] = (counts[o.status] || 0) + 1;
  }

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdating(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Update failed.");
      }
      router.refresh();
    } finally {
      setUpdating(null);
    }
  }

  async function handleRefund(orderId: string) {
    if (!window.confirm("Are you sure you want to refund this order?")) return;
    await handleStatusChange(orderId, "refunded");
  }

  return (
    <div>
      {/* Filter pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === s
                ? "bg-brand-amber text-brand-dark"
                : "bg-white/[0.07] text-gray-400 hover:bg-white/10"
            }`}
          >
            {STATUS_LABELS[s]} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-white/[0.07]">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="bg-brand-card text-left text-xs font-medium uppercase text-gray-400">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.07]">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              filtered.map((order) => {
                const listing = order.listing as unknown as {
                  title: string;
                } | null;
                const buyer = order.buyer as unknown as {
                  full_name: string;
                  email: string;
                } | null;
                const seller = order.seller as unknown as {
                  full_name: string;
                  email: string;
                } | null;

                return (
                  <tr key={order.id} className="hover:bg-white/[0.03]">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-white max-w-[200px] truncate">
                      {listing?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 max-w-[150px] truncate">
                      {buyer?.full_name || buyer?.email || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 max-w-[150px] truncate">
                      {seller?.full_name || seller?.email || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {formatPrice(order.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                          STATUS_BADGE[order.status] ??
                          "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {STATUS_LABELS[order.status] ??
                          order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/listing/${order.listing_id}`}
                          className="text-brand-amber hover:underline text-xs font-medium"
                        >
                          View
                        </Link>
                        <select
                          value={order.status}
                          disabled={updating === order.id}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className="bg-brand-dark border border-white/[0.07] text-white text-xs rounded px-2 py-1 focus:border-brand-amber outline-none disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.filter((s) => s !== "all").map(
                            (s) => (
                              <option key={s} value={s}>
                                {STATUS_LABELS[s]}
                              </option>
                            )
                          )}
                        </select>
                        {order.status === "disputed" && (
                          <button
                            onClick={() => handleRefund(order.id)}
                            disabled={updating === order.id}
                            className="text-red-400 hover:text-red-300 text-xs font-medium disabled:opacity-50"
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
