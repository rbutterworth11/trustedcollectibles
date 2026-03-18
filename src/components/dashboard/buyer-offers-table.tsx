"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Listing, Profile } from "@/types";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

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

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-900/40 text-yellow-400" },
  accepted: { label: "Accepted", color: "bg-green-900/40 text-green-400" },
  declined: { label: "Declined", color: "bg-red-900/40 text-red-400" },
  expired: { label: "Expired", color: "bg-gray-800 text-gray-400" },
  withdrawn: { label: "Withdrawn", color: "bg-gray-800 text-gray-400" },
};

export default function BuyerOffersTable({ offers }: { offers: BuyerOffer[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [withdrawing, setWithdrawing] = useState<string | null>(null);

  const filtered =
    filter === "all" ? offers : offers.filter((o) => o.status === filter);

  const statusCounts = offers.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  async function handleWithdraw(offerId: string) {
    setWithdrawing(offerId);
    const supabase = createClient();
    await supabase.from("offers").update({ status: "withdrawn" }).eq("id", offerId);
    router.refresh();
    setWithdrawing(null);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            filter === "all"
              ? "bg-brand-amber text-brand-dark"
              : "bg-white/[0.07] text-gray-400 hover:bg-white/10"
          }`}
        >
          All ({offers.length})
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

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-white/[0.07] p-8 text-center">
          <p className="text-sm text-gray-500">No offers found.</p>
          <Link
            href="/marketplace"
            className="mt-2 inline-block text-sm font-medium text-brand-amber hover:text-brand-amber-hover"
          >
            Browse the marketplace
          </Link>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto overflow-hidden rounded-lg border border-white/[0.07]">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-brand-card text-left text-xs font-medium uppercase text-gray-400">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Listed Price</th>
                <th className="px-4 py-3">Your Offer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {filtered.map((offer) => {
                const config = statusConfig[offer.status] ?? {
                  label: offer.status,
                  color: "bg-gray-800 text-gray-400",
                };
                return (
                  <tr key={offer.id} className="hover:bg-white/[0.03]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/listing/${offer.listing_id}`}
                        className="font-medium text-brand-amber hover:text-brand-amber-hover"
                      >
                        {offer.listing?.title ?? "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {offer.seller?.full_name || offer.seller?.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {offer.listing?.price
                        ? formatPrice(offer.listing.price)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      {formatPrice(offer.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}
                      >
                        {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(offer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {offer.status === "pending" && (
                        <button
                          onClick={() => handleWithdraw(offer.id)}
                          disabled={withdrawing === offer.id}
                          className="text-xs font-medium text-red-400 hover:underline disabled:opacity-50"
                        >
                          Withdraw
                        </button>
                      )}
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
