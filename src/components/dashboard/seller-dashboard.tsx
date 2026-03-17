"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Order, Listing, Profile } from "@/types";

interface SellerOrder extends Order {
  listing: Listing | null;
  buyer: Profile | null;
}

interface SellerOffer {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: string;
  message: string | null;
  created_at: string;
  listing: Listing | null;
  buyer: Profile | null;
}

interface SellerReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: Profile | null;
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function timeAgo(date: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const orderStatusConfig: Record<
  string,
  { label: string; color: string; action?: string }
> = {
  payment_held: {
    label: "Ship Now",
    color: "bg-orange-100 text-orange-800",
    action: "ship",
  },
  shipped: {
    label: "In Transit",
    color: "bg-blue-100 text-blue-800",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
};

interface SellerDashboardProps {
  stats: {
    activeListings: number;
    pendingReview: number;
    totalSales: number;
    balance: number;
  };
  orders: SellerOrder[];
  offers: SellerOffer[];
  reviews: SellerReviewItem[];
}

function StatCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i <= rating ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export default function SellerDashboard({
  stats,
  orders,
  offers,
  reviews,
}: SellerDashboardProps) {
  const router = useRouter();
  const [processingOffer, setProcessingOffer] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [shippingOrder, setShippingOrder] = useState<string | null>(null);

  async function handleOfferAction(offerId: string, action: "accepted" | "declined") {
    setProcessingOffer(offerId);
    try {
      const res = await fetch("/api/offers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId, status: action }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setProcessingOffer(null);
    }
  }

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
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setShippingOrder(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Overview of your store performance and pending actions.
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Listings"
          value={String(stats.activeListings)}
        />
        <StatCard
          label="Pending Review"
          value={String(stats.pendingReview)}
          subtitle="Awaiting admin verification"
        />
        <StatCard
          label="Total Sales"
          value={formatPrice(stats.totalSales)}
        />
        <StatCard
          label="Your Balance"
          value={formatPrice(stats.balance)}
          subtitle="After platform fees"
        />
      </div>

      {/* Orders Needing Action */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Orders
          </h2>
          <Link
            href="/dashboard/orders"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            View all
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400">No active orders.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Buyer</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => {
                  const config = orderStatusConfig[order.status] ?? {
                    label: order.status,
                    color: "bg-gray-100 text-gray-800",
                  };
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        {order.listing?.title ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {order.buyer?.full_name || order.buyer?.email || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {formatPrice(order.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {order.status === "payment_held" ? (
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
                              className="w-32 rounded border px-2 py-1 text-xs"
                            />
                            <button
                              onClick={() => handleShipOrder(order.id)}
                              disabled={
                                shippingOrder === order.id ||
                                !trackingInputs[order.id]?.trim()
                              }
                              className="rounded bg-black px-3 py-1 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                            >
                              {shippingOrder === order.id
                                ? "..."
                                : "Ship"}
                            </button>
                          </div>
                        ) : order.tracking_number ? (
                          <span className="text-xs text-gray-500">
                            {order.tracking_number}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Offers Received */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Offers Received
        </h2>

        {offers.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400">No pending offers.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">
                    {offer.listing?.title ?? "—"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {offer.buyer?.full_name || offer.buyer?.email || "Buyer"}{" "}
                    offered{" "}
                    <span className="font-semibold text-gray-900">
                      {formatPrice(offer.amount)}
                    </span>
                    {offer.listing?.price && (
                      <span className="text-gray-400">
                        {" "}
                        (listed at {formatPrice(offer.listing.price)})
                      </span>
                    )}
                  </p>
                  {offer.message && (
                    <p className="mt-1 text-xs text-gray-400 italic">
                      &ldquo;{offer.message}&rdquo;
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {timeAgo(offer.created_at)}
                  </p>
                </div>
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => handleOfferAction(offer.id, "accepted")}
                    disabled={processingOffer === offer.id}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleOfferAction(offer.id, "declined")}
                    disabled={processingOffer === offer.id}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Reviews */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400">No reviews yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Stars rating={review.rating} />
                    <span className="text-sm font-medium text-gray-900">
                      {review.reviewer?.full_name ||
                        review.reviewer?.email ||
                        "Anonymous"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {timeAgo(review.created_at)}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm text-gray-600">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
