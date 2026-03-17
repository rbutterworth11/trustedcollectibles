"use client";

import Link from "next/link";
import { useState } from "react";
import type { Listing } from "@/types";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

const statusConfig: Record<
  string,
  { label: string; color: string }
> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800" },
  pending_verification: {
    label: "Pending Review",
    color: "bg-yellow-100 text-yellow-800",
  },
  verified: { label: "Verified", color: "bg-blue-100 text-blue-800" },
  listed: { label: "Active", color: "bg-green-100 text-green-800" },
  sold: { label: "Sold", color: "bg-purple-100 text-purple-800" },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-800" },
};

export default function ListingsTable({
  listings,
}: {
  listings: Listing[];
}) {
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
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
          <p className="text-sm text-gray-400">No listings found.</p>
          <Link
            href="/dashboard/listings/new"
            className="mt-2 inline-block text-sm font-medium text-black hover:underline"
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Sport</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((listing) => {
                const config = statusConfig[listing.status] ?? {
                  label: listing.status,
                  color: "bg-gray-100 text-gray-800",
                };
                return (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {listing.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {listing.player}
                          {listing.team ? ` — ${listing.team}` : ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {listing.sport}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatPrice(listing.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}
                      >
                        {config.label}
                      </span>
                      {listing.flagged && (
                        <span className="ml-1 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
                          Flagged
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(listing.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {listing.status === "listed" ? (
                        <Link
                          href={`/listing/${listing.id}`}
                          className="text-xs font-medium text-black hover:underline"
                        >
                          View
                        </Link>
                      ) : listing.rejection_reason ? (
                        <span
                          className="text-xs text-red-600 cursor-help"
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
