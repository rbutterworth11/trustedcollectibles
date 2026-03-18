import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ListingCard from "@/components/marketplace/listing-card";
import SearchFilters from "@/components/marketplace/search-filters";
import SaveSearchButton from "@/components/marketplace/save-search-button";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sport?: string; category?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const parts: string[] = [];
  if (params.q) parts.push(`"${params.q}"`);
  if (params.sport) parts.push(params.sport);
  if (params.category) parts.push(params.category);

  const suffix = parts.length
    ? ` — ${parts.join(", ")}`
    : "";

  return {
    title: `Browse Marketplace${suffix}`,
    description: `Shop authenticated sports memorabilia${suffix}. Verified autographs, signed jerseys, trading cards, and game-worn items with escrow-protected payments.`,
    alternates: { canonical: `${SITE_URL}/marketplace` },
    openGraph: {
      title: `Marketplace${suffix} | TrustedCollectibles`,
      description: `Browse verified sports memorabilia${suffix}. Expert-authenticated collectibles with buyer protection.`,
      url: `${SITE_URL}/marketplace`,
    },
    robots: params.q ? { index: false, follow: true } : undefined,
  };
}

const PAGE_SIZE = 24;

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    sport?: string;
    category?: string;
    condition?: string;
    min_price?: string;
    max_price?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select("*", { count: "exact" })
    .eq("status", "listed");

  if (params.q) {
    const q = `%${params.q}%`;
    query = query.or(`title.ilike.${q},player.ilike.${q},team.ilike.${q}`);
  }
  if (params.sport) query = query.eq("sport", params.sport);
  if (params.category) query = query.eq("category", params.category);
  if (params.condition) query = query.eq("condition", params.condition);
  if (params.min_price) {
    const minCents = Math.round(parseFloat(params.min_price) * 100);
    if (!isNaN(minCents)) query = query.gte("price", minCents);
  }
  if (params.max_price) {
    const maxCents = Math.round(parseFloat(params.max_price) * 100);
    if (!isNaN(maxCents)) query = query.lte("price", maxCents);
  }

  // Sort
  if (params.sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (params.sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(offset, offset + PAGE_SIZE - 1);

  const { data: listings, count } = await query;

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Marketplace</h1>
          <p className="text-sm text-gray-400 mt-1">
            Browse verified sports memorabilia
          </p>
        </div>

        <Suspense fallback={null}>
          <SearchFilters />
        </Suspense>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {count ?? 0} result{count !== 1 ? "s" : ""}
            </p>
            <Suspense fallback={null}>
              <SaveSearchButton />
            </Suspense>
          </div>

          {!listings?.length ? (
            <div className="rounded-lg border border-white/[0.07] bg-brand-card p-12 text-center text-gray-400">
              No listings found. Try adjusting your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              {page > 1 ? (
                <Link
                  href={`/marketplace?${buildPageParams(params, page - 1)}`}
                  className="rounded-md border border-white/[0.07] px-4 py-2 min-h-[44px] text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-md border border-white/[0.07] px-4 py-2 min-h-[44px] text-sm text-gray-500 cursor-not-allowed">
                  Previous
                </span>
              )}

              <span className="text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={`/marketplace?${buildPageParams(params, page + 1)}`}
                  className="rounded-md border border-white/[0.07] px-4 py-2 min-h-[44px] text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-md border border-white/[0.07] px-4 py-2 min-h-[44px] text-sm text-gray-500 cursor-not-allowed">
                  Next
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function buildPageParams(
  params: Record<string, string | undefined>,
  page: number
): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "page") sp.set(key, value);
  }
  if (page > 1) sp.set("page", String(page));
  return sp.toString();
}
