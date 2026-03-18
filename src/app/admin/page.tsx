import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatPriceGBP } from "@/lib/currency";

export const metadata: Metadata = { title: "Dashboard — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const supabase = await createClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Fetch all data in parallel
  const [
    revenueResult,
    ordersThisMonthResult,
    newUsersResult,
    activeListingsResult,
    popularSportsResult,
    topSellersResult,
    recentOrdersResult,
    reviewQueueResult,
  ] = await Promise.all([
    // Total Revenue (completed/delivered/shipped orders)
    supabase
      .from("orders")
      .select("amount")
      .in("status", ["completed", "delivered", "shipped"]),

    // Orders this month
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfMonth),

    // New users this month
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfMonth),

    // Active listings
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "listed"),

    // Popular sports (top 5 by listing count)
    supabase.from("listings").select("sport").eq("status", "listed"),

    // Top sellers by completed orders
    supabase
      .from("orders")
      .select("seller_id, seller:profiles!orders_seller_id_fkey(full_name, email)")
      .in("status", ["completed", "delivered", "shipped"]),

    // Recent orders (last 10)
    supabase
      .from("orders")
      .select(
        "id, amount, status, created_at, listing:listings(title), buyer:profiles!orders_buyer_id_fkey(full_name)"
      )
      .order("created_at", { ascending: false })
      .limit(10),

    // Review queue (pending_verification or flagged)
    (() => {
      let query = supabase
        .from("listings")
        .select("*, profiles!listings_seller_id_fkey(id, email, full_name, created_at)")
        .order("created_at", { ascending: true });

      if (filter === "flagged") {
        query = query.eq("flagged", true);
      } else {
        query = query.eq("status", "pending_verification");
      }
      return query;
    })(),
  ]);

  // Calculate stats
  const totalRevenue = (revenueResult.data ?? []).reduce(
    (sum, o) => sum + (o.amount ?? 0),
    0
  );
  const ordersThisMonth = ordersThisMonthResult.count ?? 0;
  const newUsersThisMonth = newUsersResult.count ?? 0;
  const activeListings = activeListingsResult.count ?? 0;

  // Aggregate popular sports
  const sportCounts: Record<string, number> = {};
  for (const row of popularSportsResult.data ?? []) {
    if (row.sport) {
      sportCounts[row.sport] = (sportCounts[row.sport] || 0) + 1;
    }
  }
  const topSports = Object.entries(sportCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxSportCount = topSports[0]?.[1] ?? 1;

  // Aggregate top sellers
  const sellerCounts: Record<string, { name: string; count: number }> = {};
  for (const row of topSellersResult.data ?? []) {
    const seller = row.seller as unknown as {
      full_name: string;
      email: string;
    } | null;
    const id = row.seller_id;
    if (!id) continue;
    if (!sellerCounts[id]) {
      sellerCounts[id] = {
        name: seller?.full_name || seller?.email || "Unknown",
        count: 0,
      };
    }
    sellerCounts[id].count++;
  }
  const topSellers = Object.values(sellerCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentOrders = recentOrdersResult.data ?? [];
  const listings = reviewQueueResult.data ?? [];
  const reviewTitle =
    filter === "flagged" ? "Flagged Listings" : "Review Queue";
  const emptyMessage =
    filter === "flagged"
      ? "No flagged listings."
      : "No listings pending review.";

  const STATUS_BADGE: Record<string, string> = {
    pending: "bg-gray-800 text-gray-400",
    payment_held: "bg-yellow-900/40 text-yellow-400",
    shipped: "bg-blue-900/40 text-blue-400",
    delivered: "bg-green-900/40 text-green-400",
    completed: "bg-emerald-900/40 text-emerald-400",
    refunded: "bg-orange-900/40 text-orange-400",
    disputed: "bg-red-900/40 text-red-400",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-brand-card border border-white/[0.07] rounded-lg p-5">
          <p className="text-gray-400 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-white mt-1">
            {formatPriceGBP(totalRevenue)}
          </p>
          <p className="text-xs text-green-400 mt-1">
            Completed + Shipped + Delivered
          </p>
        </div>
        <div className="bg-brand-card border border-white/[0.07] rounded-lg p-5">
          <p className="text-gray-400 text-sm">Orders This Month</p>
          <p className="text-2xl font-bold text-white mt-1">
            {ordersThisMonth}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Since {new Date(startOfMonth).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
          </p>
        </div>
        <div className="bg-brand-card border border-white/[0.07] rounded-lg p-5">
          <p className="text-gray-400 text-sm">New Users This Month</p>
          <p className="text-2xl font-bold text-white mt-1">
            {newUsersThisMonth}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Since {new Date(startOfMonth).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
          </p>
        </div>
        <div className="bg-brand-card border border-white/[0.07] rounded-lg p-5">
          <p className="text-gray-400 text-sm">Active Listings</p>
          <p className="text-2xl font-bold text-white mt-1">
            {activeListings}
          </p>
          <p className="text-xs text-gray-500 mt-1">Currently listed</p>
        </div>
      </div>

      {/* Popular Categories + Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Categories */}
        <div className="bg-brand-card border border-white/[0.07] rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-4">
            Popular Categories
          </h2>
          {topSports.length === 0 ? (
            <p className="text-gray-400 text-sm">No listings yet.</p>
          ) : (
            <div className="space-y-3">
              {topSports.map(([sport, count]) => (
                <div key={sport}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">{sport}</span>
                    <span className="text-xs text-gray-400">
                      {count} listing{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.07] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-amber"
                      style={{
                        width: `${(count / maxSportCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Sellers */}
        <div className="bg-brand-card border border-white/[0.07] rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white mb-4">
            Top Sellers
          </h2>
          {topSellers.length === 0 ? (
            <p className="text-gray-400 text-sm">No completed orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-medium uppercase text-gray-400">
                    <th className="pb-2">#</th>
                    <th className="pb-2">Seller</th>
                    <th className="pb-2 text-right">Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.07]">
                  {topSellers.map((seller, i) => (
                    <tr key={i}>
                      <td className="py-2 text-gray-400">{i + 1}</td>
                      <td className="py-2 text-white">{seller.name}</td>
                      <td className="py-2 text-right text-gray-400">
                        {seller.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-brand-card border border-white/[0.07] rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white mb-4">
          Recent Activity
        </h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-sm">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium uppercase text-gray-400">
                  <th className="pb-2 pr-4">Order</th>
                  <th className="pb-2 pr-4">Item</th>
                  <th className="pb-2 pr-4">Buyer</th>
                  <th className="pb-2 pr-4">Amount</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.07]">
                {recentOrders.map((order) => {
                  const listing = order.listing as unknown as {
                    title: string;
                  } | null;
                  const buyer = order.buyer as unknown as {
                    full_name: string;
                  } | null;
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.03]">
                      <td className="py-2 pr-4 text-gray-400 font-mono text-xs">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="py-2 pr-4 text-white max-w-[200px] truncate">
                        {listing?.title ?? "—"}
                      </td>
                      <td className="py-2 pr-4 text-gray-400">
                        {buyer?.full_name ?? "Unknown"}
                      </td>
                      <td className="py-2 pr-4 text-white">
                        {formatPriceGBP(order.amount)}
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                            STATUS_BADGE[order.status] ??
                            "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-2 text-gray-400 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Queue */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">{reviewTitle}</h2>
          <span className="text-sm text-gray-400">
            {listings.length} listing{listings.length !== 1 ? "s" : ""}
          </span>
        </div>

        {!listings.length ? (
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
                      <h3 className="font-medium text-white truncate">
                        {listing.title}
                      </h3>
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
                      Seller:{" "}
                      {seller?.full_name || seller?.email || "Unknown"}{" "}
                      &middot; COA: {listing.coa_source || "None"} #
                      {listing.coa_certificate_number || "—"}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-white">
                      {formatPriceGBP(listing.price)}
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
    </div>
  );
}
