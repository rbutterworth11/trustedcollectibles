import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ListingCard from "@/components/marketplace/listing-card";
import { SPORTS } from "@/lib/constants";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import HeroCarousel from "@/components/layout/hero-carousel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "TrustedCollectibles — Buy & Sell Authenticated Sports Memorabilia",
  description:
    "Buy signed shirts, verified autographs, and authenticated sports memorabilia from top athletes. Expert-verified collectibles with escrow payments and full buyer protection. Browse signed jerseys, trading cards, game-worn items and more.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title:
      "TrustedCollectibles — Authenticated Sports Memorabilia Marketplace",
    description:
      "Buy and sell expert-verified signed shirts, autographs, trading cards, and game-worn items. Escrow-protected payments and buyer guarantee.",
    url: SITE_URL,
    type: "website",
  },
  twitter: {
    title: "TrustedCollectibles — Authenticated Sports Memorabilia",
    description:
      "Buy signed shirts, verified autographs & rare collectibles with escrow payments.",
  },
};

// Helper to get a section by key
function getSection(sections: any[], key: string) {
  return sections.find((s) => s.key === key);
}

export default async function Home() {
  const supabase = await createClient();

  // Fetch CMS content, staff picks, and listing data in parallel
  // Use .then() fallbacks so missing tables don't crash the page
  const safe = (query: PromiseLike<{ data: any }>) =>
    Promise.resolve(query).then(r => r.data ?? []).catch(() => []);

  const [sections, staffPickRows, hotProducts, sportCounts, categoryImages] = await Promise.all([
    safe(supabase.from("site_content").select("*").order("sort_order")),
    safe(supabase.from("staff_picks").select("listing_id, sort_order, listing:listings(id, title, sport, category, player, condition, price, accept_offers, images)").order("sort_order")),
    safe(supabase.from("listings").select("id, title, sport, category, player, condition, price, accept_offers, images").eq("status", "listed").order("created_at", { ascending: false }).limit(8)),
    safe(supabase.from("listings").select("sport").eq("status", "listed")),
    safe(supabase.from("managed_categories").select("name, image_url").eq("type", "sport").eq("enabled", true).order("sort_order")),
  ]);

  const allSections = sections;

  // Parse sections
  const hero = getSection(allSections, "hero");
  const trustBar = getSection(allSections, "trust_bar");
  const newArrivals = getSection(allSections, "new_arrivals");
  const staffPicksSection = getSection(allSections, "staff_picks_section");
  const featuredCollections = getSection(allSections, "featured_collections");
  const ctaSection = getSection(allSections, "cta_section");

  // Staff pick listings (extract the nested listing data)
  const staffPickListings = (staffPickRows ?? [])
    .map((row: any) => row.listing)
    .filter(Boolean);

  // Sport counts for browse by sport
  const activeSports = new Map<string, number>();
  (sportCounts ?? []).forEach((l: any) => {
    activeSports.set(l.sport, (activeSports.get(l.sport) ?? 0) + 1);
  });

  // Trust bar icon mapping
  const trustBarIcons: Record<string, string> = {
    shield: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>`,
    lock: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>`,
    card: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>`,
    star: `<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>`,
  };
  const trustBarColors: Record<string, string> = {
    shield: "text-green-400",
    lock: "text-blue-400",
    card: "text-purple-400",
    star: "text-brand-amber",
  };

  // Build category image map from DB
  const categoryImageMap: Record<string, string> = {};
  for (const cat of categoryImages) {
    if (cat.image_url) categoryImageMap[cat.name] = cat.image_url;
  }

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

  // Defaults for hero
  const heroTitle =
    hero?.value?.title ?? "Authenticated Sports\nMemorabilia";
  const heroSubtitle =
    hero?.value?.subtitle ??
    "Buy and sell verified collectibles with confidence. Every item is authenticated by our experts and every transaction is protected with escrow payments.";
  const heroCtaText = hero?.value?.cta_text ?? "Browse Marketplace";
  const heroCtaLink = hero?.value?.cta_link ?? "/marketplace";
  const heroCtaSecondaryText =
    hero?.value?.cta_secondary_text ?? "Start Selling";
  const heroCtaSecondaryLink =
    hero?.value?.cta_secondary_link ?? "/register";
  const heroBackgroundImage = (hero?.value?.background_image as string) || "";

  // Hero carousel slides
  const heroSlidesSection = getSection(allSections, "hero_slides");
  const heroSlides = (heroSlidesSection?.value?.slides as Array<{ image: string; title: string; subtitle: string; cta_text: string; cta_link: string }>) ?? [];

  // Defaults for trust bar
  const trustBarItems = trustBar?.value?.items ?? [
    { icon: "shield", title: "Expert Verified", subtitle: "Every item authenticated" },
    { icon: "lock", title: "Escrow Payments", subtitle: "Funds held until delivery" },
    { icon: "card", title: "Secure Checkout", subtitle: "Powered by Stripe" },
    { icon: "star", title: "Buyer Protection", subtitle: "Full money-back guarantee" },
  ];

  // Defaults for new arrivals
  const newArrivalsTitle = newArrivals?.value?.title ?? "New Arrivals";
  const newArrivalsSubtitle =
    newArrivals?.value?.subtitle ??
    "The latest additions to our marketplace.";
  const newArrivalsCount = newArrivals?.value?.count ?? 8;
  const displayedHotProducts = (hotProducts ?? []).slice(0, newArrivalsCount);

  // Defaults for staff picks section
  const staffPicksTitle =
    staffPicksSection?.value?.title ?? "Staff Picks";
  const staffPicksSubtitle =
    staffPicksSection?.value?.subtitle ??
    "Premium items hand-picked by our team.";

  // Defaults for featured collections
  const featuredCollectionItems = featuredCollections?.value?.items ?? [
    {
      name: "Signed Jerseys",
      description:
        "Authenticated game-day and replica jerseys from the biggest names in sports.",
      category: "Signed+Jersey",
      gradient: "from-blue-950 to-blue-800",
    },
    {
      name: "Trading Cards",
      description:
        "Rare signed cards from rookies to legends, all verified authentic.",
      category: "Signed+Card",
      gradient: "from-purple-950 to-purple-800",
    },
    {
      name: "Game-Worn Items",
      description:
        "Own a piece of history with authenticated game-used equipment and apparel.",
      category: "Game-Worn+Item",
      gradient: "from-green-950 to-green-800",
    },
  ];

  // Color mapping for featured collection text based on gradient
  const gradientTextColors: Record<string, string> = {
    "from-blue-950 to-blue-800": "text-blue-300",
    "from-purple-950 to-purple-800": "text-purple-300",
    "from-green-950 to-green-800": "text-green-300",
    "from-red-950 to-red-800": "text-red-300",
    "from-amber-950 to-amber-800": "text-amber-300",
    "from-teal-950 to-teal-800": "text-teal-300",
  };

  // Defaults for CTA section
  const ctaTitle =
    ctaSection?.value?.title ?? "Ready to Start Collecting?";
  const ctaSubtitle =
    ctaSection?.value?.subtitle ??
    "Join thousands of collectors who trust our platform for authenticated sports memorabilia. Create an account to start buying or selling today.";
  const ctaButtonText = ctaSection?.value?.cta_text ?? "Create Account";
  const ctaButtonLink = ctaSection?.value?.cta_link ?? "/register";
  const ctaSecondaryText =
    ctaSection?.value?.cta_secondary_text ?? "Browse Marketplace";
  const ctaSecondaryLink =
    ctaSection?.value?.cta_secondary_link ?? "/marketplace";

  return (
    <main className="min-h-[calc(100vh-65px)] bg-brand-dark">
      {/* Hero Carousel (if enabled and has slides) */}
      {heroSlidesSection?.enabled && heroSlides.length > 0 && (
        <HeroCarousel slides={heroSlides} />
      )}

      {/* Hero (shown when carousel is disabled or empty) */}
      {hero?.enabled !== false && !(heroSlidesSection?.enabled && heroSlides.length > 0) && (
        <section className="relative overflow-hidden bg-brand-dark text-white">
          {heroBackgroundImage && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroBackgroundImage})` }}
              />
              <div className="absolute inset-0 bg-brand-dark/80" />
            </>
          )}
          <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-20 text-center">
            <h1
              className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-brand-amber via-yellow-300 to-brand-amber bg-clip-text text-transparent"
              dangerouslySetInnerHTML={{
                __html: heroTitle.replace(/\n/g, "<br />"),
              }}
            />
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              {heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={heroCtaLink}
                className="rounded-md bg-brand-amber px-6 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover"
              >
                {heroCtaText}
              </Link>
              <Link
                href={heroCtaSecondaryLink}
                className="rounded-md border border-white/[0.07] px-6 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
              >
                {heroCtaSecondaryText}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Trust Bar */}
      {trustBar?.enabled !== false && (
        <section className="border-b border-white/[0.07] bg-brand-card">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-4 py-6 sm:gap-8 sm:justify-between">
            {trustBarItems.map(
              (
                item: { icon: string; title: string; subtitle: string },
                i: number
              ) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span
                    className={trustBarColors[item.icon] ?? "text-gray-400"}
                    dangerouslySetInnerHTML={{
                      __html:
                        trustBarIcons[item.icon] ??
                        trustBarIcons["shield"],
                    }}
                  />
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.subtitle}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* Browse by Sport */}
      <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <h2 className="text-2xl font-bold text-white">Browse by Sport</h2>
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
                className="relative flex flex-col items-center rounded-lg border border-white/[0.07] bg-brand-card p-4 text-center transition-all hover:border-brand-amber/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 overflow-hidden"
              >
                {categoryImageMap[sport] ? (
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={categoryImageMap[sport]} alt={sport} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <span
                    className="text-2xl"
                    dangerouslySetInnerHTML={{
                      __html: sportIcons[sport] || "&#127942;",
                    }}
                  />
                )}
                <span className="mt-2 text-sm font-medium text-white">
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

      {/* New Arrivals */}
      {newArrivals?.enabled !== false && displayedHotProducts.length > 0 && (
        <section className="bg-brand-card py-8 md:py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {newArrivalsTitle}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {newArrivalsSubtitle}
                </p>
              </div>
              <Link
                href="/marketplace"
                className="rounded-md border border-white/[0.07] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
              >
                View All
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {displayedHotProducts.map((listing: any) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Staff Picks */}
      {staffPicksSection?.enabled !== false &&
        staffPickListings.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {staffPicksTitle}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {staffPicksSubtitle}
                </p>
              </div>
              <Link
                href="/marketplace"
                className="rounded-md border border-white/[0.07] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
              >
                View All
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {staffPickListings.map((listing: any) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        )}

      {/* Featured Collections */}
      {featuredCollections?.enabled !== false && (
        <section className="bg-brand-card py-8 md:py-12">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-white">
              Featured Collections
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Curated groupings for the discerning collector.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCollectionItems.map(
                (
                  item: {
                    name: string;
                    description: string;
                    category: string;
                    gradient: string;
                  },
                  i: number
                ) => (
                  <Link
                    key={i}
                    href={`/marketplace?category=${item.category}`}
                    className={`group relative overflow-hidden rounded-lg bg-gradient-to-br ${item.gradient} p-8 text-white border border-white/[0.07] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all`}
                  >
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <p
                      className={`mt-1 text-sm ${gradientTextColors[item.gradient] ?? "text-gray-300"}`}
                    >
                      {item.description}
                    </p>
                    <span className="mt-4 inline-block text-sm font-medium text-brand-amber group-hover:text-brand-amber-hover">
                      Shop Collection &rarr;
                    </span>
                  </Link>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {ctaSection?.enabled !== false && (
        <section className="mx-auto max-w-6xl px-4 py-10 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {ctaTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            {ctaSubtitle}
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href={ctaButtonLink}
              className="rounded-md bg-brand-amber px-6 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover"
            >
              {ctaButtonText}
            </Link>
            <Link
              href={ctaSecondaryLink}
              className="rounded-md border border-white/[0.07] px-6 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
            >
              {ctaSecondaryText}
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
