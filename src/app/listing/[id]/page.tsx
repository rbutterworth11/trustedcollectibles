import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ImageGallery from "@/components/listing/image-gallery";
import ListingActions, {
  SellerCard,
} from "@/components/listing/listing-actions";

export const dynamic = "force-dynamic";

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
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black"
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
        {/* Left: Images */}
        <ImageGallery images={listing.images ?? []} title={listing.title} />

        {/* Right: Info */}
        <div className="space-y-6">
          {/* Title & Verified */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{listing.title}</h1>
              <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                Verified
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
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
          <div className="space-y-3 rounded-lg border p-4">
            <h2 className="font-semibold">Authentication</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">COA Source</p>
                <p className="font-medium">{listing.coa_source || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500">Certificate #</p>
                <p className="font-medium">
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
                      className="relative h-20 w-20 overflow-hidden rounded-md bg-gray-100"
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
          <div className="rounded-lg border p-4">
            <h2 className="mb-3 font-semibold">Item Details</h2>
            <dl className="space-y-2">
              {details.map(
                (d) =>
                  d.value && (
                    <div
                      key={d.label}
                      className="flex justify-between text-sm"
                    >
                      <dt className="text-gray-500">{d.label}</dt>
                      <dd className="font-medium">{d.value}</dd>
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
      <div className="mt-8 rounded-lg border p-6">
        <h2 className="mb-3 font-semibold">Description</h2>
        <p className="whitespace-pre-wrap text-sm text-gray-700">
          {listing.description}
        </p>
      </div>

      {/* Report link */}
      <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
        <button className="inline-flex items-center gap-1 transition-colors hover:text-red-600">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          Report
        </button>
      </div>
    </div>
  );
}
