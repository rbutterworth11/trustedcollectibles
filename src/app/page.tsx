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

  const [sections, staffPickRows, hotProducts, sportCounts, categoryImages, trendingProfiles] = await Promise.all([
    safe(supabase.from("site_content").select("*").order("sort_order")),
    safe(supabase.from("staff_picks").select("listing_id, sort_order, listing:listings(id, title, sport, category, player, condition, price, accept_offers, images)").order("sort_order")),
    safe(supabase.from("listings").select("id, title, sport, category, player, condition, price, accept_offers, images").eq("status", "listed").order("created_at", { ascending: false }).limit(8)),
    safe(supabase.from("listings").select("sport, player, team").eq("status", "listed")),
    safe(supabase.from("managed_categories").select("name, image_url").eq("type", "sport").eq("enabled", true).order("sort_order")),
    safe(supabase.from("trending_profiles").select("*").eq("enabled", true).order("sort_order")),
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

  // Trending profile item counts
  const trendingCounts = new Map<string, number>();
  for (const l of sportCounts) {
    if (l.player) {
      const name = l.player.toLowerCase();
      trendingCounts.set(name, (trendingCounts.get(name) ?? 0) + 1);
    }
    if (l.team) {
      const name = l.team.toLowerCase();
      trendingCounts.set(name, (trendingCounts.get(name) ?? 0) + 1);
    }
  }

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

  const sportSvgIcons: Record<string, string> = {
    "Football (Soccer)": `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#c67b2f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="22" cy="22" r="18"/><path d="M22 4v6.5m0 23V40m-15.6-9.5l5.6-3.5m20-10l5.6-3.5M6.4 13.5l5.6 3.5m20 10l5.6 3.5"/><polygon points="22,10.5 27,15.5 25.5,21.5 18.5,21.5 17,15.5" stroke="#c67b2f" fill="none"/><line x1="22" y1="10.5" x2="22" y2="4"/><line x1="27" y1="15.5" x2="33" y2="12"/><line x1="25.5" y1="21.5" x2="31" y2="26"/><line x1="18.5" y1="21.5" x2="13" y2="26"/><line x1="17" y1="15.5" x2="11" y2="12"/></svg>`,
    Boxing: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#c67b2f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 36V26c0-3 1-5 4-6l2-1V12a7 7 0 0114 0v7l2 1c3 1 4 3 4 6v10"/><rect x="14" y="10" width="6" height="12" rx="3"/><rect x="24" y="10" width="6" height="12" rx="3"/><path d="M14 26h20"/><path d="M20 12v-2a2 2 0 014 0v2"/></svg>`,
    Rugby: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#c67b2f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="22" cy="22" rx="16" ry="10" transform="rotate(-30 22 22)"/><line x1="14" y1="14" x2="30" y2="30"/><path d="M18 16l4 4m-2-6l6 6m-2-8l8 8"/></svg>`,
    Cricket: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#c67b2f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="19" y="6" width="6" height="24" rx="2"/><path d="M19 26h6v4a3 3 0 01-3 3v0a3 3 0 01-3-3v-4z"/><line x1="19" y1="12" x2="25" y2="12"/><circle cx="34" cy="34" r="3.5"/></svg>`,
    Tennis: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#c67b2f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="16" r="11"/><line x1="25.5" y1="23.5" x2="38" y2="36"/><path d="M8.5 6.5c2.5 5 2.5 14 0 19"/><path d="M27.5 6.5c-2.5 5-2.5 14 0 19"/></svg>`,
    Motorsport: `<svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#c67b2f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 32V18c0-2 1-4 3-5l6-4h14l6 4c2 1 3 3 3 5v14"/><path d="M6 22h32"/><path d="M15 9v13"/><path d="M29 9v13"/><path d="M22 9v13"/><circle cx="12" cy="32" r="3"/><circle cx="32" cy="32" r="3"/><path d="M9 18l-3 4m29-4l3 4"/></svg>`,
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

  // Check if user is logged in for the CTA link
  let isLoggedIn = false;
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    isLoggedIn = !!currentUser;
  } catch {}
  const sellingLink = isLoggedIn ? "/dashboard/listings/new" : (heroCtaSecondaryLink as string);
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

  // Trust section
  const trustSection = getSection(allSections, "trust_section");

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
                href={sellingLink}
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
      {(() => {
        const featuredSports = [
          { key: "Football (Soccer)", label: "Football" },
          { key: "Boxing", label: "Boxing" },
          { key: "Rugby", label: "Rugby" },
          { key: "Cricket", label: "Cricket" },
          { key: "Tennis", label: "Tennis" },
          { key: "Motorsport", label: "Motorsport" },
        ];
        return (
          <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">Browse by Sport</h2>
              <p className="mt-2 text-sm text-gray-400">
                Find memorabilia from your favourite sport.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {featuredSports.map((sport) => {
                const count = activeSports.get(sport.key) ?? 0;
                const hasImage = categoryImageMap[sport.key];
                return (
                  <Link
                    key={sport.key}
                    href={`/marketplace?sport=${encodeURIComponent(sport.key)}`}
                    className="group relative flex flex-col items-center rounded-xl border border-white/[0.07] bg-brand-card p-6 text-center transition-all duration-200 hover:border-brand-amber/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-amber/5"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {hasImage ? (
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-white/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={categoryImageMap[sport.key]} alt={sport.label} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <span
                        className="flex h-12 w-12 items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: sportSvgIcons[sport.key] ?? "" }}
                      />
                    )}
                    <span className="relative mt-3 text-sm font-semibold text-white tracking-wide">
                      {sport.label}
                    </span>
                    <span className="relative mt-1 text-xs text-gray-500">
                      {count > 0 ? `${count} ${count === 1 ? "item" : "items"}` : "Browse"}
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-amber hover:text-brand-amber-hover transition-colors"
              >
                View All Sports
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>
        );
      })()}

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

      {/* Trending Players & Teams */}
      {trendingProfiles.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-white">Trending Players & Teams</h2>
            <p className="mt-1 text-sm text-gray-400">The most sought-after names right now.</p>
          </div>
          <div className="mt-6 flex gap-5 overflow-x-auto px-4 pb-4 scrollbar-none md:justify-center md:flex-wrap" style={{ scrollbarWidth: "none" }}>
            {trendingProfiles.map((tp: any) => {
              const count = trendingCounts.get(tp.name.toLowerCase()) ?? 0;
              const filterParam = tp.filter_type === "team" ? "q" : "q";
              return (
                <Link
                  key={tp.id}
                  href={`/marketplace?${filterParam}=${encodeURIComponent(tp.name)}`}
                  className="flex shrink-0 flex-col items-center group"
                >
                  <div className="relative h-20 w-20 rounded-full border-2 border-white/[0.07] bg-brand-card overflow-hidden transition-all group-hover:border-brand-amber group-hover:shadow-lg group-hover:shadow-brand-amber/10">
                    {tp.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tp.image_url} alt={tp.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/[0.05] to-white/[0.02]">
                        <span className="text-xl font-bold text-gray-500">
                          {tp.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="mt-2 text-xs font-medium text-white group-hover:text-brand-amber transition-colors text-center max-w-[80px] truncate">
                    {tp.name}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {count > 0 ? `${count} ${count === 1 ? "item" : "items"}` : "Browse"}
                  </span>
                </Link>
              );
            })}
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

      {/* Trust & Trustpilot Bar */}
      {trustSection?.enabled !== false && (() => {
        const tv = trustSection?.value ?? {};
        const tpUrl = (tv.trustpilot_url as string) || "https://www.trustpilot.com";
        const tpRating = parseFloat((tv.trustpilot_rating as string) || "4.8");
        const tpReviews = (tv.trustpilot_reviews as string) || "127";
        const tpText = (tv.trustpilot_text as string) || "Rated Excellent on Trustpilot";
        const showStripe = tv.show_stripe !== false;
        const showSsl = tv.show_ssl !== false;
        const showPsa = tv.show_psa !== false;
        const showBeckett = tv.show_beckett !== false;
        const showJsa = tv.show_jsa !== false;
        const fullStars = Math.floor(tpRating);

        return (
          <section className="border-t border-white/[0.07] bg-brand-card">
            <div className="mx-auto max-w-6xl px-4 py-6">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:justify-between">
                {/* Trustpilot */}
                <a href={tpUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group shrink-0">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-7 w-7 flex items-center justify-center rounded-[3px] ${i <= fullStars ? "bg-[#00b67a]" : "bg-[#dcdce6]"}`}>
                        <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-brand-amber transition-colors">{tpText}</span>
                    <span className="text-xs text-gray-500">({tpReviews})</span>
                    <svg className="h-4 w-4 text-[#00b67a]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    <span className="text-xs font-semibold text-gray-400">Trustpilot</span>
                  </div>
                </a>

                {/* Trust badges inline */}
                <div className="flex items-center gap-5">
                  {showStripe && (
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-[#635bff]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                      </svg>
                      <span className="text-xs text-gray-400 font-medium hidden sm:inline">Stripe Verified</span>
                    </div>
                  )}
                  {showSsl && (
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-xs text-gray-400 font-medium hidden sm:inline">SSL Secure</span>
                    </div>
                  )}
                  {showPsa && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-red-400">PSA</span>
                      <span className="text-xs text-gray-400 font-medium hidden sm:inline">Partner</span>
                    </div>
                  )}
                  {showBeckett && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-blue-400">BAS</span>
                      <span className="text-xs text-gray-400 font-medium hidden sm:inline">Beckett</span>
                    </div>
                  )}
                  {showJsa && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-brand-amber">JSA</span>
                      <span className="text-xs text-gray-400 font-medium hidden sm:inline">Certified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })()}
    </main>
  );
}
