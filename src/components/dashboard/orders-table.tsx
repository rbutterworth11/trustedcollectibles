"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Order, Listing, Profile } from "@/types";
import { useCurrency } from "@/lib/currency";

interface OrderWithDetails extends Order {
  listing: Listing | null;
  buyer: Profile | null;
  seller: Profile | null;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-gray-800 text-gray-400" },
  payment_held: { label: "Payment Held", color: "bg-yellow-900/40 text-yellow-400" },
  shipped: { label: "Shipped", color: "bg-blue-900/40 text-blue-400" },
  delivered: { label: "Delivered", color: "bg-green-900/40 text-green-400" },
  completed: { label: "Completed", color: "bg-green-900/40 text-green-400" },
  refunded: { label: "Refunded", color: "bg-red-900/40 text-red-400" },
  disputed: { label: "Disputed", color: "bg-red-900/40 text-red-400" },
};

export default function OrdersTable({
  orders,
  viewAs,
  reviewedOrderIds = [],
}: {
  orders: OrderWithDetails[];
  viewAs: "seller" | "buyer";
  reviewedOrderIds?: string[];
}) {
  const router = useRouter();
  const { formatPrice } = useCurrency();
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
      if (res.ok) {
        // Redirect to review page
        router.push(`/dashboard/orders/${orderId}/review`);
      }
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
              ? "bg-brand-amber text-brand-dark"
              : "bg-white/[0.07] text-gray-400 hover:bg-white/10"
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
                  ? "bg-brand-amber text-brand-dark"
                  : "bg-white/[0.07] text-gray-400 hover:bg-white/10"
              }`}
            >
              {config?.label ?? status} ({count})
            </button>
          );
        })}
      </div>

      {/* Shipping deadline info for sellers */}
      {viewAs === "seller" && orders.some((o) => o.status === "payment_held") && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-yellow-200/80">
            <strong className="text-yellow-300">Shipping deadline:</strong> You must ship items within 2 working days of a sale and provide a tracking number. Late shipments may result in order cancellation.
          </p>
        </div>
      )}

      {/* 48-hour review window info for buyers */}
      {viewAs === "buyer" && orders.some((o) => o.status === "delivered") && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <p className="text-xs text-blue-200/80">
            <strong className="text-blue-300">Buyer protection:</strong> You have 48 hours after delivery to inspect your item. Confirm receipt or open a dispute from the tracking column.
          </p>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-gray-400">No orders found.</p>
      ) : (
        <div className="mt-4 overflow-x-auto overflow-hidden rounded-lg border border-white/[0.07]">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-brand-card text-left text-xs font-medium uppercase text-gray-400">
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
            <tbody className="divide-y divide-white/[0.07]">
              {filtered.map((order) => {
                const config = statusConfig[order.status] ?? {
                  label: order.status,
                  color: "bg-gray-800 text-gray-400",
                };
                const otherParty =
                  viewAs === "seller" ? order.buyer : order.seller;
                return (
                  <tr key={order.id} className="hover:bg-white/[0.03]">
                    <td className="px-4 py-3 font-medium text-white">
                      {order.listing?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {otherParty?.full_name || otherParty?.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-white">{formatPrice(order.amount)}</td>
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
                            className="w-28 rounded border border-white/[0.07] bg-brand-card px-2 py-1 text-xs text-white placeholder:text-gray-500 focus:border-brand-amber focus:ring-brand-amber"
                          />
                          <button
                            onClick={() => handleShipOrder(order.id)}
                            disabled={
                              shippingOrder === order.id ||
                              !trackingInputs[order.id]?.trim()
                            }
                            className="rounded bg-brand-amber px-2 py-1 text-xs font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50"
                          >
                            Ship
                          </button>
                        </div>
                      ) : viewAs === "buyer" &&
                        order.status === "delivered" ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
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
                      ) : viewAs === "buyer" &&
                        order.status === "completed" &&
                        !reviewedOrderIds.includes(order.id) ? (
                        <Link
                          href={`/dashboard/orders/${order.id}/review`}
                          className="text-xs font-medium text-brand-amber hover:text-brand-amber-hover"
                        >
                          Leave Review
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {order.tracking_number || "—"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
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
