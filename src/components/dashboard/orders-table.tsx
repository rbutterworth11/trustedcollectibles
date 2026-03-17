"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Order, Listing, Profile } from "@/types";

interface OrderWithDetails extends Order {
  listing: Listing | null;
  buyer: Profile | null;
  seller: Profile | null;
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-gray-100 text-gray-800" },
  payment_held: { label: "Payment Held", color: "bg-yellow-100 text-yellow-800" },
  shipped: { label: "Shipped", color: "bg-blue-100 text-blue-800" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  refunded: { label: "Refunded", color: "bg-red-100 text-red-800" },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-800" },
};

export default function OrdersTable({
  orders,
  viewAs,
}: {
  orders: OrderWithDetails[];
  viewAs: "seller" | "buyer";
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [shippingOrder, setShippingOrder] = useState<string | null>(null);
  const [confirmingOrder, setConfirmingOrder] = useState<string | null>(null);

  const filtered =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  async function handleShipOrder(orderId: string) {
    const tracking = trackingInputs[orderId]?.trim();
    if (!tracking) return;
    setShippingOrder(orderId);
    try {
      const res = await fetch("/api/orders/ship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, trackingNumber: tracking }),
      });
      if (res.ok) router.refresh();
    } finally {
      setShippingOrder(null);
    }
  }

  async function handleConfirmDelivery(orderId: string) {
    setConfirmingOrder(orderId);
    try {
      const res = await fetch("/api/orders/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) router.refresh();
    } finally {
      setConfirmingOrder(null);
    }
  }

  const statusCounts = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            filter === "all"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All ({orders.length})
        </button>
        {Object.entries(statusCounts).map(([status, count]) => {
          const config = statusConfig[status];
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                filter === status
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {config?.label ?? status} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-gray-400">No orders found.</p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">
                  {viewAs === "seller" ? "Buyer" : "Seller"}
                </th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tracking</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((order) => {
                const config = statusConfig[order.status] ?? {
                  label: order.status,
                  color: "bg-gray-100 text-gray-800",
                };
                const otherParty =
                  viewAs === "seller" ? order.buyer : order.seller;
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {order.listing?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {otherParty?.full_name || otherParty?.email || "—"}
                    </td>
                    <td className="px-4 py-3">{formatPrice(order.amount)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}
                      >
                        {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {viewAs === "seller" &&
                      order.status === "payment_held" ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Tracking #"
                            value={trackingInputs[order.id] ?? ""}
                            onChange={(e) =>
                              setTrackingInputs((prev) => ({
                                ...prev,
                                [order.id]: e.target.value,
                              }))
                            }
                            className="w-28 rounded border px-2 py-1 text-xs"
                          />
                          <button
                            onClick={() => handleShipOrder(order.id)}
                            disabled={
                              shippingOrder === order.id ||
                              !trackingInputs[order.id]?.trim()
                            }
                            className="rounded bg-black px-2 py-1 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                          >
                            Ship
                          </button>
                        </div>
                      ) : viewAs === "buyer" &&
                        order.status === "delivered" ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {order.tracking_number || "—"}
                          </span>
                          <button
                            onClick={() => handleConfirmDelivery(order.id)}
                            disabled={confirmingOrder === order.id}
                            className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            {confirmingOrder === order.id
                              ? "..."
                              : "Confirm Receipt"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {order.tracking_number || "—"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
