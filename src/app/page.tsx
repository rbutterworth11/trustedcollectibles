import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ListingCard from "@/components/marketplace/listing-card";
import { SPORTS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  // Fetch newest listings (hot products)
  const { data: hotProducts } = await supabase
    .from("listings")
    .select("id, title, sport, category, player, condition, price, accept_offers, images")
    .eq("status", "listed")
    .order("created_at", { ascending: false })
    .limit(8);

  // Fetch highest-priced listings (staff picks / premium)
  const { data: staffPicks } = await supabase
    .from("listings")
    .select("id, title, sport, category, player, condition, price, accept_offers, images")
    .eq("status", "listed")
    .order("price", { ascending: false })
    .limit(4);

  // Get sports that have listings
  const { data: sportCounts } = await supabase
    .from("listings")
    .select("sport")
    .eq("status", "listed");

  const activeSports = new Map<string, number>();
  (sportCounts ?? []).forEach((l) => {
    activeSports.set(l.sport, (activeSports.get(l.sport) ?? 0) + 1);
  });

  const sportIcons: Record<string, string> = {
    Baseball: "&#9918;",
    Basketball: "&#127936;",
    "Football (American)": "&#127944;",
    "Football (Soccer)": "&#9917;",
    Hockey: "&#127954;",
    Golf: "&#9971;",
    Tennis: "&#127934;",
    Boxing: "&#129354;",
    "MMA/UFC": "&#129354;",
  };

  return (
    <main className="min-h-[calc(100vh-65px)] bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Authenticated Sports
            <br />
            Memorabilia
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            Buy and sell verified collectibles with confidence. Every item is
            authenticated by our experts and every transaction is protected with
            escrow payments.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/marketplace"
              className="rounded-md bg-white px-6 py-3 text-sm font-medium text-black hover:bg-gray-100"
            >
              Browse Marketplace
            </Link>
            <Link
              href="/register"
              className="rounded-md border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b bg-gray-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 px-4 py-6 sm:justify-between">
          <div className="flex items-center gap-3 text-sm">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">Expert Verified</p>
              <p className="text-xs text-gray-500">Every item authenticated</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">Escrow Payments</p>
              <p className="text-xs text-gray-500">Funds held until delivery</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">Secure Checkout</p>
              <p className="text-xs text-gray-500">Powered by Stripe</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">Buyer Protection</p>
              <p className="text-xs text-gray-500">Full money-back guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Sport */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900">Browse by Sport</h2>
        <p className="mt-1 text-sm text-gray-500">
          Find memorabilia from your favorite sport.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {SPORTS.filter((s) => s !== "Other").map((sport) => {
            const count = activeSports.get(sport) ?? 0;
            return (
              <Link
                key={sport}
                href={`/marketplace?sport=${encodeURIComponent(sport)}`}
                className="flex flex-col items-center rounded-lg border p-4 text-center transition-colors hover:border-black hover:bg-gray-50"
              >
                <span
                  className="text-2xl"
                  dangerouslySetInnerHTML={{
                    __html: sportIcons[sport] || "&#127942;",
                  }}
                />
                <span className="mt-2 text-sm font-medium text-gray-900">
                  {sport.replace(" (American)", "").replace(" (Soccer)", "")}
                </span>
                {count > 0 && (
                  <span className="mt-0.5 text-xs text-gray-400">
                    {count} {count === 1 ? "item" : "items"}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Hot Products */}
      {(hotProducts?.length ?? 0) > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  New Arrivals
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  The latest additions to our marketplace.
                </p>
              </div>
              <Link
                href="/marketplace"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white"
              >
                View All
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {hotProducts!.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Staff Picks */}
      {(staffPicks?.length ?? 0) > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Staff Picks
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Premium items hand-picked by our team.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View All
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {staffPicks!.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Collections */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Collections
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Curated groupings for the discerning collector.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/marketplace?category=Signed+Jersey"
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-900 to-blue-700 p-8 text-white"
            >
              <h3 className="text-xl font-bold">Signed Jerseys</h3>
              <p className="mt-1 text-sm text-blue-200">
                Authenticated game-day and replica jerseys from the biggest
                names in sports.
              </p>
              <span className="mt-4 inline-block text-sm font-medium underline decoration-blue-300 group-hover:decoration-white">
                Shop Collection
              </span>
            </Link>
            <Link
              href="/marketplace?category=Signed+Card"
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-900 to-purple-700 p-8 text-white"
            >
              <h3 className="text-xl font-bold">Trading Cards</h3>
              <p className="mt-1 text-sm text-purple-200">
                Rare signed cards from rookies to legends, all verified
                authentic.
              </p>
              <span className="mt-4 inline-block text-sm font-medium underline decoration-purple-300 group-hover:decoration-white">
                Shop Collection
              </span>
            </Link>
            <Link
              href="/marketplace?category=Game-Worn+Item"
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-green-900 to-green-700 p-8 text-white"
            >
              <h3 className="text-xl font-bold">Game-Worn Items</h3>
              <p className="mt-1 text-sm text-green-200">
                Own a piece of history with authenticated game-used equipment
                and apparel.
              </p>
              <span className="mt-4 inline-block text-sm font-medium underline decoration-green-300 group-hover:decoration-white">
                Shop Collection
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Ready to Start Collecting?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-500">
          Join thousands of collectors who trust our platform for authenticated
          sports memorabilia. Create an account to start buying or selling today.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/register"
            className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create Account
          </Link>
          <Link
            href="/marketplace"
            className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Browse Marketplace
          </Link>
        </div>
      </section>
    </main>
  );
}
