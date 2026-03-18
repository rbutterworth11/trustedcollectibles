"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Listing {
  id: string;
  title: string;
  player: string;
  sport: string;
  price: number;
  status: string;
  created_at: string;
  profiles: { id: string; email: string; full_name: string } | null;
}

const STATUS_OPTIONS = [
  "all",
  "draft",
  "pending_verification",
  "verified",
  "listed",
  "sold",
  "disputed",
] as const;

const STATUS_LABELS: Record<string, string> = {
  all: "All",
  draft: "Draft",
  pending_verification: "Pending Review",
  verified: "Verified",
  listed: "Listed",
  sold: "Sold",
  disputed: "Disputed",
};

const STATUS_BADGE: Record<string, string> = {
  draft: "bg-gray-800 text-gray-400",
  pending_verification: "bg-yellow-900/40 text-yellow-400",
  verified: "bg-blue-900/40 text-blue-400",
  listed: "bg-green-900/40 text-green-400",
  sold: "bg-purple-900/40 text-purple-400",
  disputed: "bg-red-900/40 text-red-400",
};

export default function AdminListingsTable({
  listings,
}: {
  listings: Listing[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered =
    filter === "all"
      ? listings
      : listings.filter((l) => l.status === filter);

  const counts: Record<string, number> = { all: listings.length };
  for (const l of listings) {
    counts[l.status] = (counts[l.status] || 0) + 1;
  }

  async function handleDelete(listingId: string) {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this listing?"
      )
    )
      return;

    setDeleting(listingId);
    const res = await fetch("/api/admin/listings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Delete failed.");
    }

    setDeleting(null);
    router.refresh();
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
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="bg-brand-card text-left text-xs font-medium uppercase text-gray-400">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3">Sport</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Seller</th>
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
                  No listings found.
                </td>
              </tr>
            ) : (
              filtered.map((listing) => {
                const seller = listing.profiles as unknown as {
                  id: string;
                  email: string;
                  full_name: string;
                } | null;

                return (
                  <tr
                    key={listing.id}
                    className="hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3 text-white font-medium max-w-[200px] truncate">
                      {listing.title}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {listing.player}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {listing.sport}
                    </td>
                    <td className="px-4 py-3 text-white">
                      ${(listing.price / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                          STATUS_BADGE[listing.status] ||
                          "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {STATUS_LABELS[listing.status] || listing.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 max-w-[150px] truncate">
                      {seller?.full_name || seller?.email || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(listing.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/review/${listing.id}`}
                          className="text-brand-amber hover:underline text-xs font-medium"
                        >
                          Review
                        </Link>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          disabled={deleting === listing.id}
                          className="text-red-400 hover:text-red-300 text-xs font-medium disabled:opacity-50"
                        >
                          {deleting === listing.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
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
