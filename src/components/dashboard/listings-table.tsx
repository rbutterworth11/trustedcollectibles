"use client";

import Link from "next/link";
import { useState } from "react";
import type { Listing } from "@/types";
import { useCurrency } from "@/lib/currency";

const statusConfig: Record<
  string,
  { label: string; color: string }
> = {
  draft: { label: "Draft", color: "bg-gray-800 text-gray-400" },
  pending_verification: {
    label: "Pending Review",
    color: "bg-yellow-900/40 text-yellow-400",
  },
  verified: { label: "Verified", color: "bg-blue-900/40 text-blue-400" },
  listed: { label: "Active", color: "bg-green-900/40 text-green-400" },
  sold: { label: "Sold", color: "bg-purple-900/40 text-purple-400" },
  disputed: { label: "Disputed", color: "bg-red-900/40 text-red-400" },
};

export default function ListingsTable({
  listings,
}: {
  listings: Listing[];
}) {
  const { formatPrice } = useCurrency();
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? listings
      : listings.filter((l) => l.status === filter);

  const statusCounts = listings.reduce(
    (acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

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
          All ({listings.length})
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
          <p className="text-sm text-gray-500">No listings found.</p>
          <Link
            href="/dashboard/listings/new"
            className="mt-2 inline-block text-sm font-medium text-brand-amber hover:text-brand-amber-hover"
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto overflow-hidden rounded-lg border border-white/[0.07]">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-brand-card text-left text-xs font-medium uppercase text-gray-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Sport</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07]">
              {filtered.map((listing) => {
                const config = statusConfig[listing.status] ?? {
                  label: listing.status,
                  color: "bg-gray-800 text-gray-400",
                };
                return (
                  <tr key={listing.id} className="hover:bg-white/[0.03]">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-white">
                          {listing.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {listing.player}
                          {listing.team ? ` — ${listing.team}` : ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {listing.sport}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      {formatPrice(listing.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}
                      >
                        {config.label}
                      </span>
                      {listing.flagged && (
                        <span className="ml-1 inline-block rounded-full bg-orange-900/40 px-2 py-0.5 text-xs font-medium text-orange-400">
                          Flagged
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(listing.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {listing.status === "listed" ? (
                        <Link
                          href={`/listing/${listing.id}`}
                          className="text-xs font-medium text-brand-amber hover:text-brand-amber-hover"
                        >
                          View
                        </Link>
                      ) : listing.rejection_reason ? (
                        <span
                          className="text-xs text-red-400 cursor-help"
                          title={listing.rejection_reason}
                        >
                          See reason
                        </span>
                      ) : null}
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
