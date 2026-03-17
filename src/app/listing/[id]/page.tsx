import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ImageGallery from "@/components/listing/image-gallery";

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

  const coaPhotos = [listing.coa_front, listing.coa_back, listing.coa_hologram].filter(
    Boolean
  ) as string[];

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
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-6"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
            <p className="text-sm text-gray-500 mt-1">
              {listing.sport} &middot; {listing.player}
            </p>
          </div>

          {/* Price */}
          <div>
            <p className="text-3xl font-bold">${(listing.price / 100).toFixed(2)}</p>
            {listing.accept_offers && (
              <p className="text-sm text-green-600 mt-1">
                Accepting offers
                {listing.minimum_offer
                  ? ` (minimum $${(listing.minimum_offer / 100).toFixed(2)})`
                  : ""}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 rounded-md bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
              Buy Now
            </button>
            {listing.accept_offers && (
              <button className="flex-1 rounded-md border border-black px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors">
                Make Offer
              </button>
            )}
          </div>

          {/* Escrow Info */}
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
            <p className="font-medium">Secure Escrow Payment</p>
            <p className="mt-1 text-blue-600">
              Your payment is held securely until you receive and verify the item. Full buyer protection included.
            </p>
          </div>

          {/* Authentication Section */}
          <div className="rounded-lg border p-4 space-y-3">
            <h2 className="font-semibold">Authentication</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">COA Source</p>
                <p className="font-medium">{listing.coa_source || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500">Certificate #</p>
                <p className="font-medium">{listing.coa_certificate_number || "—"}</p>
              </div>
            </div>
            {coaPhotos.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">COA Photos</p>
                <div className="flex gap-2">
                  {coaPhotos.map((src, i) => (
                    <div key={i} className="relative h-20 w-20 overflow-hidden rounded-md bg-gray-100">
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
            <h2 className="font-semibold mb-3">Item Details</h2>
            <dl className="space-y-2">
              {details.map(
                (d) =>
                  d.value && (
                    <div key={d.label} className="flex justify-between text-sm">
                      <dt className="text-gray-500">{d.label}</dt>
                      <dd className="font-medium">{d.value}</dd>
                    </div>
                  )
              )}
            </dl>
          </div>

          {/* Seller Card */}
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-2">Seller</h2>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                {(seller?.full_name?.[0] ?? "?").toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{seller?.full_name || "Unknown"}</p>
                <p className="text-xs text-gray-500">
                  Member since {new Date(seller?.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 rounded-lg border p-6">
        <h2 className="font-semibold mb-3">Description</h2>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{listing.description}</p>
      </div>

      {/* Footer Links */}
      <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
        <button className="hover:text-black transition-colors inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
        <button className="hover:text-red-600 transition-colors inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Report
        </button>
      </div>
    </div>
  );
}
