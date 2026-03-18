"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Order, Listing, Profile } from "@/types";

interface BuyerOrder extends Order {
  listing: Listing | null;
  seller: Profile | null;
}

interface BuyerWishlistItem {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing: Listing | null;
}

interface BuyerFollowedSeller {
  id: string;
  follower_id: string;
  seller_id: string;
  created_at: string;
  seller: Profile | null;
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

const orderStatusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-gray-800 text-gray-400" },
  payment_held: { label: "Payment Held", color: "bg-yellow-900/40 text-yellow-400" },
  shipped: { label: "Shipped", color: "bg-blue-900/40 text-blue-400" },
  delivered: { label: "Delivered", color: "bg-green-900/40 text-green-400" },
  completed: { label: "Completed", color: "bg-green-900/40 text-green-400" },
  refunded: { label: "Refunded", color: "bg-red-900/40 text-red-400" },
  disputed: { label: "Disputed", color: "bg-red-900/40 text-red-400" },
};

interface BuyerOffer {
  id: string;
  listing_id: string;
  amount: number;
  status: string;
  message: string | null;
  created_at: string;
  listing: Listing | null;
  seller: Profile | null;
}

interface BuyerDashboardProps {
  orders: BuyerOrder[];
  wishlist: BuyerWishlistItem[];
  followedSellers: BuyerFollowedSeller[];
  offers: BuyerOffer[];
}

const offerStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-900/40 text-yellow-400" },
  accepted: { label: "Accepted", color: "bg-green-900/40 text-green-400" },
  declined: { label: "Declined", color: "bg-red-900/40 text-red-400" },
  expired: { label: "Expired", color: "bg-gray-800 text-gray-400" },
  withdrawn: { label: "Withdrawn", color: "bg-gray-800 text-gray-400" },
};

export default function BuyerDashboard({
  orders,
  wishlist,
  followedSellers,
  offers,
}: BuyerDashboardProps) {
  const router = useRouter();
  const [withdrawingOffer, setWithdrawingOffer] = useState<string | null>(null);

  async function handleWithdrawOffer(offerId: string) {
    setWithdrawingOffer(offerId);
    const supabase = createClient();
    await supabase.from("offers").update({ status: "withdrawn" }).eq("id", offerId);
    router.refresh();
    setWithdrawingOffer(null);
  }

  async function handleRemoveWishlist(wishlistId: string) {
    const supabase = createClient();
    await supabase.from("wishlists").delete().eq("id", wishlistId);
    router.refresh();
  }

  async function handleUnfollow(followId: string) {
    const supabase = createClient();
    await supabase.from("followed_sellers").delete().eq("id", followId);
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
      <p className="mt-1 text-sm text-gray-400">
        Track your orders, wishlist items, and followed sellers.
      </p>

      {/* Orders Tracking */}
      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">My Orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-sm text-brand-amber hover:text-brand-amber-hover"
          >
            View all
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-white/[0.07] p-8 text-center">
            <p className="text-sm text-gray-500">No orders yet.</p>
            <Link
              href="/marketplace"
              className="mt-2 inline-block text-sm font-medium text-brand-amber hover:text-brand-amber-hover"
            >
              Browse the marketplace
            </Link>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border border-white/[0.07]">
            <table className="w-full text-sm">
              <thead className="bg-brand-card text-left text-xs font-medium uppercase text-gray-400">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Seller</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.07]">
                {orders.map((order) => {
                  const config = orderStatusLabels[order.status] ?? {
                    label: order.status,
                    color: "bg-gray-800 text-gray-400",
                  };
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.03]">
                      <td className="px-4 py-3 font-medium text-white">
                        {order.listing?.title ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {order.seller?.full_name || order.seller?.email || "—"}
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
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {order.tracking_number || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Pending Offers */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">My Offers</h2>
          <Link
            href="/dashboard/offers"
            className="text-sm text-brand-amber hover:text-brand-amber-hover"
          >
            View all
          </Link>
        </div>

        {offers.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400">No offers made.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {offers.map((offer) => {
              const config = offerStatusConfig[offer.status] ?? {
                label: offer.status,
                color: "bg-gray-800 text-gray-400",
              };
              return (
                <div
                  key={offer.id}
                  className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-brand-card p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">
                      {offer.listing?.title ?? "—"}
                    </p>
                    <p className="text-sm text-gray-400">
                      You offered{" "}
                      <span className="font-semibold text-white">
                        {formatPrice(offer.amount)}
                      </span>
                      {offer.listing?.price && (
                        <span className="text-gray-400">
                          {" "}
                          (listed at {formatPrice(offer.listing.price)})
                        </span>
                      )}
                      {" to "}
                      {offer.seller?.full_name || "Seller"}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}
                      >
                        {config.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {timeAgo(offer.created_at)}
                      </span>
                    </div>
                  </div>
                  {offer.status === "pending" && (
                    <button
                      onClick={() => handleWithdrawOffer(offer.id)}
                      disabled={withdrawingOffer === offer.id}
                      className="ml-4 rounded-md border border-white/[0.07] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 disabled:opacity-50"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Wishlist */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Wishlist</h2>
          <Link
            href="/dashboard/wishlist"
            className="text-sm text-brand-amber hover:text-brand-amber-hover"
          >
            View all
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400">
            Your wishlist is empty.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-lg border border-white/[0.07] bg-brand-card"
              >
                <Link href={`/listing/${item.listing_id}`}>
                  <div className="relative aspect-square overflow-hidden rounded-t-lg bg-white/5">
                    {item.listing?.images?.[0] ? (
                      <Image
                        src={item.listing.images[0]}
                        alt={item.listing.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium text-white">
                      {item.listing?.title ?? "—"}
                    </p>
                    <p className="text-sm font-bold text-white">
                      {item.listing?.price
                        ? formatPrice(item.listing.price)
                        : "—"}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemoveWishlist(item.id)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                  title="Remove from wishlist"
                >
                  <svg
                    className="h-4 w-4 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Followed Sellers */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Followed Sellers
          </h2>
          <Link
            href="/dashboard/following"
            className="text-sm text-brand-amber hover:text-brand-amber-hover"
          >
            View all
          </Link>
        </div>

        {followedSellers.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400">
            You&apos;re not following any sellers yet.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {followedSellers.map((follow) => (
              <div
                key={follow.id}
                className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-brand-card p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-amber text-sm font-bold text-brand-dark">
                    {(
                      follow.seller?.full_name ||
                      follow.seller?.email ||
                      "?"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {follow.seller?.full_name || "Seller"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Following since{" "}
                      {new Date(follow.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleUnfollow(follow.id)}
                  className="rounded-md border border-white/[0.07] px-3 py-1 text-xs font-medium text-gray-300 hover:bg-white/5"
                >
                  Unfollow
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
