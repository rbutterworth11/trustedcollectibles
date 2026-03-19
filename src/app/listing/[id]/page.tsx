import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ImageGallery from "@/components/listing/image-gallery";
import ListingActions, {
  SellerCard,
} from "@/components/listing/listing-actions";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import SimilarItems from "@/components/listing/similar-items";
import SocialShare from "@/components/listing/social-share";
import ConfidenceMeter from "@/components/listing/confidence-meter";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("title, description, sport, player, category, condition, price, images")
    .eq("id", id)
    .eq("status", "listed")
    .single();

  if (!listing) {
    return { title: "Listing Not Found" };
  }

  const title = `${listing.title} — ${listing.player} ${listing.sport} ${listing.category}`;
  const description = `Buy authenticated ${listing.title} (${listing.condition} condition). ${listing.sport} memorabilia by ${listing.player}. $${(listing.price / 100).toFixed(2)}. Expert-verified with COA. Escrow-protected payment.`;
  const image = listing.images?.[0] || undefined;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/listing/${id}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/listing/${id}`,
      type: "website",
      images: image ? [{ url: image, alt: listing.title }] : [],
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description: `${listing.condition} ${listing.category} — $${(listing.price / 100).toFixed(2)}. Verified ${listing.sport} memorabilia.`,
      images: image ? [image] : [],
    },
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*, profiles!listings_seller_id_fkey(id, full_name, created_at)")
    .eq("id", id)
    .eq("status", "listed")
    .single();

  if (!listing) notFound();

  const seller = listing.profiles as unknown as {
    id: string;
    full_name: string;
    created_at: string;
  };

  // Get current user (may be null for anonymous visitors)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? null;
  const isOwnListing = userId === listing.seller_id;

  // Fetch wishlist, follow status, and seller reviews in parallel
  const [wishlistResult, followResult, reviewsResult] = await Promise.all([
    userId
      ? supabase
          .from("wishlists")
          .select("id")
          .eq("user_id", userId)
          .eq("listing_id", id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    userId
      ? supabase
          .from("followed_sellers")
          .select("id")
          .eq("follower_id", userId)
          .eq("seller_id", listing.seller_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("seller_reviews")
      .select("rating")
      .eq("seller_id", listing.seller_id),
  ]);

  const wishlistEntry = wishlistResult.data;
  const followEntry = followResult.data;
  const reviews = reviewsResult.data ?? [];
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : null;

  const coaPhotos = [
    listing.coa_front,
    listing.coa_back,
    listing.coa_hologram,
  ].filter(Boolean) as string[];

  const details = [
    { label: "Sport", value: listing.sport },
    { label: "Item Type", value: listing.category },
    { label: "Player", value: listing.player },
    { label: "Team", value: listing.team },
    { label: "Year", value: listing.year },
    { label: "Condition", value: listing.condition },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/marketplace"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-brand-amber"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left: Images + Confidence */}
        <div className="space-y-6">
          <ImageGallery images={listing.images ?? []} title={listing.title} />
          <ConfidenceMeter
            score={listing.confidence_score ?? null}
            factors={listing.confidence_factors ?? []}
            hasCoa={!!listing.coa_source}
          />
        </div>

        {/* Right: Info */}
        <div className="space-y-6">
          {/* Title & Verified */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{listing.title}</h1>
              <span className="shrink-0 rounded-full bg-brand-verified-bg px-2.5 py-0.5 text-xs font-medium text-brand-verified-text">
                Verified
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              {listing.sport} &middot; {listing.player}
            </p>
          </div>

          {/* Actions: Price, Buy/Offer, Wishlist, Share */}
          <ListingActions
            listingId={id}
            sellerId={listing.seller_id}
            sellerName={seller?.full_name ?? ""}
            price={listing.price}
            acceptOffers={listing.accept_offers}
            minimumOffer={listing.minimum_offer}
            userId={userId}
            initialWishlisted={!!wishlistEntry}
            initialWishlistId={wishlistEntry?.id ?? null}
            initialFollowing={!!followEntry}
            initialFollowId={followEntry?.id ?? null}
            isOwnListing={isOwnListing}
          />

          {/* Authentication Section */}
          <div className="space-y-3 rounded-lg border border-white/[0.07] bg-brand-card p-4">
            <h2 className="font-semibold text-white">Authentication</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">COA Source</p>
                <p className="font-medium text-white">{listing.coa_source || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500">Certificate #</p>
                <p className="font-medium text-white">
                  {listing.coa_certificate_number || "—"}
                </p>
              </div>
            </div>
            {coaPhotos.length > 0 && (
              <div>
                <p className="mb-2 text-sm text-gray-500">COA Photos</p>
                <div className="flex gap-2">
                  {coaPhotos.map((src, i) => (
                    <div
                      key={i}
                      className="relative h-20 w-20 overflow-hidden rounded-md bg-white/5"
                    >
                      <Image
                        src={src}
                        alt={`COA photo ${i + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Item Details Table */}
          <div className="rounded-lg border border-white/[0.07] bg-brand-card p-4">
            <h2 className="mb-3 font-semibold text-white">Item Details</h2>
            <dl className="space-y-2">
              {details.map(
                (d) =>
                  d.value && (
                    <div
                      key={d.label}
                      className="flex justify-between text-sm"
                    >
                      <dt className="text-gray-500">{d.label}</dt>
                      <dd className="font-medium text-white">{d.value}</dd>
                    </div>
                  )
              )}
            </dl>
          </div>

          {/* Seller Card with Follow */}
          <SellerCard
            sellerId={seller?.id}
            sellerName={seller?.full_name ?? "Unknown"}
            sellerSince={seller?.created_at}
            userId={userId}
            listingId={id}
            initialFollowing={!!followEntry}
            initialFollowId={followEntry?.id ?? null}
            isOwnListing={isOwnListing}
            reviewCount={reviewCount}
            avgRating={avgRating}
          />
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 rounded-lg border border-white/[0.07] bg-brand-card p-6">
        <h2 className="mb-3 font-semibold text-white">Description</h2>
        <p className="whitespace-pre-wrap text-sm text-gray-400">
          {listing.description}
        </p>
      </div>

      {/* Social Share & Report */}
      <div className="mt-6 flex items-center justify-between">
        <SocialShare
          url={`${SITE_URL}/listing/${id}`}
          title={listing.title}
          price={`£${(listing.price / 100).toFixed(2)}`}
        />
        <button className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-red-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Report
        </button>
      </div>

      {/* Similar Items */}
      <SimilarItems
        listingId={id}
        sport={listing.sport}
        category={listing.category}
        player={listing.player}
      />

      {/* JSON-LD Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: listing.title,
            description: listing.description,
            image: listing.images ?? [],
            url: `${SITE_URL}/listing/${id}`,
            brand: {
              "@type": "Brand",
              name: listing.player || listing.team || listing.sport,
            },
            category: `${listing.sport} > ${listing.category}`,
            itemCondition:
              listing.condition === "Mint" || listing.condition === "Near Mint"
                ? "https://schema.org/NewCondition"
                : "https://schema.org/UsedCondition",
            offers: {
              "@type": "Offer",
              url: `${SITE_URL}/listing/${id}`,
              priceCurrency: "USD",
              price: (listing.price / 100).toFixed(2),
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Person",
                name: seller?.full_name || "Seller",
              },
            },
            ...(reviewCount > 0 && avgRating
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: avgRating.toFixed(1),
                    reviewCount,
                    bestRating: 5,
                    worstRating: 1,
                  },
                }
              : {}),
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Sport",
                value: listing.sport,
              },
              {
                "@type": "PropertyValue",
                name: "Authentication",
                value: listing.coa_source || "Verified",
              },
              ...(listing.coa_certificate_number
                ? [
                    {
                      "@type": "PropertyValue",
                      name: "Certificate Number",
                      value: listing.coa_certificate_number,
                    },
                  ]
                : []),
            ],
          }),
        }}
      />
    </div>
  );
}
