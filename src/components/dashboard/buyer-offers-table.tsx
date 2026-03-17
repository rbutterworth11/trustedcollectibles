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
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  accepted: { label: "Accepted", color: "bg-green-100 text-green-800" },
  declined: { label: "Declined", color: "bg-red-100 text-red-800" },
  expired: { label: "Expired", color: "bg-gray-100 text-gray-800" },
  withdrawn: { label: "Withdrawn", color: "bg-gray-100 text-gray-800" },
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
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
        <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-gray-400">No offers found.</p>
          <Link
            href="/marketplace"
            className="mt-2 inline-block text-sm font-medium text-black hover:underline"
          >
            Browse the marketplace
          </Link>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
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
            <tbody className="divide-y">
              {filtered.map((offer) => {
                const config = statusConfig[offer.status] ?? {
                  label: offer.status,
                  color: "bg-gray-100 text-gray-800",
                };
                return (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/listing/${offer.listing_id}`}
                        className="font-medium text-black hover:underline"
                      >
                        {offer.listing?.title ?? "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {offer.seller?.full_name || offer.seller?.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {offer.listing?.price
                        ? formatPrice(offer.listing.price)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatPrice(offer.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}
                      >
                        {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(offer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {offer.status === "pending" && (
                        <button
                          onClick={() => handleWithdraw(offer.id)}
                          disabled={withdrawing === offer.id}
                          className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
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
