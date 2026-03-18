import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select("*, profiles!listings_seller_id_fkey(id, email, full_name, created_at)")
    .order("created_at", { ascending: true });

  if (filter === "flagged") {
    query = query.eq("flagged", true);
  } else {
    query = query.eq("status", "pending_verification");
  }

  const { data: listings } = await query;

  const title = filter === "flagged" ? "Flagged Listings" : "Review Queue";
  const emptyMessage =
    filter === "flagged"
      ? "No flagged listings."
      : "No listings pending review.";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <span className="text-sm text-gray-400">
          {listings?.length ?? 0} listing{listings?.length !== 1 ? "s" : ""}
        </span>
      </div>

      {!listings?.length ? (
        <div className="rounded-lg border border-white/[0.07] bg-brand-card p-12 text-center text-gray-400">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => {
            const seller = listing.profiles as unknown as {
              id: string;
              email: string;
              full_name: string;
              created_at: string;
            };
            const mainImage = listing.images?.[0];

            return (
              <Link
                key={listing.id}
                href={`/admin/review/${listing.id}`}
                className="flex items-center gap-4 rounded-lg border border-white/[0.07] bg-brand-card p-4 hover:border-brand-amber/30 transition-colors"
              >
                {mainImage ? (
                  <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden bg-white/5">
                    <Image
                      src={mainImage}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-white/5 text-xs text-gray-400">
                    No img
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium text-white truncate">{listing.title}</h2>
                    {listing.flagged && (
                      <span className="shrink-0 rounded bg-red-900/40 px-1.5 py-0.5 text-xs font-medium text-red-400">
                        Flagged
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {listing.sport} &middot; {listing.category} &middot;{" "}
                    {listing.player}
                  </p>
                  <p className="text-xs text-gray-400">
                    Seller: {seller?.full_name || seller?.email || "Unknown"} &middot;{" "}
                    COA: {listing.coa_source || "None"} #{listing.coa_certificate_number || "—"}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-semibold text-white">
                    £${(listing.price / 100).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(listing.created_at).toLocaleDateString()}
                  </p>
                </div>

                <svg
                  className="h-5 w-5 shrink-0 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
