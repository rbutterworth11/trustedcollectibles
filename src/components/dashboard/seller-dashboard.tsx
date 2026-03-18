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
    color: "bg-orange-900/40 text-orange-400",
    action: "ship",
  },
  shipped: {
    label: "In Transit",
    color: "bg-blue-900/40 text-blue-400",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-900/40 text-green-400",
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
    <div className="rounded-lg border border-white/[0.07] bg-brand-card p-5">
      <p className="text-sm font-medium text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
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
          className={`h-4 w-4 ${i <= rating ? "text-yellow-400" : "text-gray-600"}`}
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
      <h1 className="text-2xl font-bold text-white">Seller Dashboard</h1>
      <p className="mt-1 text-sm text-gray-400">
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
          <h2 className="text-lg font-semibold text-white">
            Orders
          </h2>
          <Link
            href="/dashboard/orders"
            className="text-sm text-brand-amber hover:text-brand-amber-hover"
          >
            View all
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400">No active orders.</p>
        ) : (
          <div className="mt-4 overflow-x-auto overflow-hidden rounded-lg border border-white/[0.07]">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-brand-card text-left text-xs font-medium uppercase text-gray-400">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Buyer</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.07]">
                {orders.map((order) => {
                  const config = orderStatusConfig[order.status] ?? {
                    label: order.status,
                    color: "bg-gray-800 text-gray-400",
                  };
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.03]">
                      <td className="px-4 py-3 font-medium text-white">
                        {order.listing?.title ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {order.buyer?.full_name || order.buyer?.email || "—"}
                      </td>
                      <td className="px-4 py-3 text-white">
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
                              className="w-32 rounded border border-white/[0.07] bg-brand-card px-2 py-1 text-xs text-white placeholder:text-gray-500 focus:border-brand-amber focus:ring-brand-amber"
                            />
                            <button
                              onClick={() => handleShipOrder(order.id)}
                              disabled={
                                shippingOrder === order.id ||
                                !trackingInputs[order.id]?.trim()
                              }
                              className="rounded bg-brand-amber px-3 py-1 text-xs font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50"
                            >
                              {shippingOrder === order.id
                                ? "..."
                                : "Ship"}
                            </button>
                          </div>
                        ) : order.tracking_number ? (
                          <span className="text-xs text-gray-400">
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
        <h2 className="text-lg font-semibold text-white">
          Offers Received
        </h2>

        {offers.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400">No pending offers.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-brand-card p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">
                    {offer.listing?.title ?? "—"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {offer.buyer?.full_name || offer.buyer?.email || "Buyer"}{" "}
                    offered{" "}
                    <span className="font-semibold text-white">
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
                    className="rounded-md border border-white/[0.07] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 disabled:opacity-50"
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
        <h2 className="text-lg font-semibold text-white">
          Recent Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400">No reviews yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-white/[0.07] bg-brand-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Stars rating={review.rating} />
                    <span className="text-sm font-medium text-white">
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
                  <p className="mt-2 text-sm text-gray-400">
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
