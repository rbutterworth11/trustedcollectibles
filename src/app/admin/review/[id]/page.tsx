import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminReviewActions from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select(
      "*, profiles!listings_seller_id_fkey(id, email, full_name, role, created_at)"
    )
    .eq("id", id)
    .single();

  if (!listing) notFound();

  const { data: reviews } = await supabase
    .from("listing_reviews")
    .select("*, profiles!listing_reviews_reviewer_id_fkey(full_name)")
    .eq("listing_id", id)
    .order("created_at", { ascending: false });

  const seller = listing.profiles as unknown as {
    id: string;
    email: string;
    full_name: string;
    role: string;
    created_at: string;
  };

  const allImages = [
    listing.images?.[0] && { url: listing.images[0], label: "Main Photo" },
    listing.signature_photo && {
      url: listing.signature_photo,
      label: "Signature Close-Up",
    },
    ...(listing.images?.slice(1) || []).map((url: string, i: number) => ({
      url,
      label: `Additional ${i + 1}`,
    })),
  ].filter(Boolean) as { url: string; label: string }[];

  const coaImages = [
    listing.coa_front && { url: listing.coa_front, label: "COA Front" },
    listing.coa_back && { url: listing.coa_back, label: "COA Back" },
    listing.coa_hologram && {
      url: listing.coa_hologram,
      label: "Hologram Sticker",
    },
  ].filter(Boolean) as { url: string; label: string }[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            {listing.flagged && (
              <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                Flagged
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Status:{" "}
            <span className="font-medium">{listing.status.replace(/_/g, " ")}</span>
            {" "}&middot; Submitted{" "}
            {new Date(listing.created_at).toLocaleDateString()}
          </p>
        </div>
        <p className="text-2xl font-bold">
          ${(listing.price / 100).toFixed(2)}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content — 2 columns */}
        <div className="col-span-2 space-y-6">
          {/* Item Photos */}
          <section className="rounded-lg border bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Item Photos
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {allImages.map((img) => (
                <div key={img.url} className="space-y-1">
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative aspect-square rounded-md overflow-hidden bg-gray-100 hover:ring-2 hover:ring-black transition-shadow"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.label}
                      className="object-cover w-full h-full"
                    />
                  </a>
                  <p className="text-xs text-gray-500 text-center">{img.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* COA Photos */}
          <section className="rounded-lg border bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Certificate of Authenticity
            </h2>
            {coaImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {coaImages.map((img) => (
                  <div key={img.url} className="space-y-1">
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative aspect-square rounded-md overflow-hidden bg-gray-100 hover:ring-2 hover:ring-black transition-shadow"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.label}
                        className="object-cover w-full h-full"
                      />
                    </a>
                    <p className="text-xs text-gray-500 text-center">{img.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-red-600 mb-4">No COA images uploaded.</p>
            )}
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-gray-500">Source</dt>
                <dd className="font-medium">{listing.coa_source || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Certificate #</dt>
                <dd className="font-medium">
                  {listing.coa_certificate_number || "—"}
                </dd>
              </div>
            </dl>
          </section>

          {/* Item Details */}
          <section className="rounded-lg border bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Item Details
            </h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Sport</dt>
                <dd className="font-medium">{listing.sport}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Item Type</dt>
                <dd className="font-medium">{listing.category}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Player</dt>
                <dd className="font-medium">{listing.player}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Team</dt>
                <dd className="font-medium">{listing.team || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Year</dt>
                <dd className="font-medium">{listing.year || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Condition</dt>
                <dd className="font-medium">{listing.condition}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-gray-500">Description</dt>
                <dd className="mt-1 whitespace-pre-wrap">{listing.description}</dd>
              </div>
            </dl>
          </section>

          {/* Review History */}
          {reviews && reviews.length > 0 && (
            <section className="rounded-lg border bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                Review History
              </h2>
              <div className="space-y-3">
                {reviews.map((review) => {
                  const reviewer = review.profiles as unknown as {
                    full_name: string;
                  };
                  return (
                    <div
                      key={review.id}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span
                        className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${
                          review.action === "approved"
                            ? "bg-green-100 text-green-700"
                            : review.action === "rejected"
                              ? "bg-red-100 text-red-700"
                              : review.action === "flagged"
                                ? "bg-orange-100 text-orange-700"
                                : review.action === "unflagged"
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {review.action.replace(/_/g, " ")}
                      </span>
                      <div>
                        <p>
                          <span className="font-medium">
                            {reviewer?.full_name || "Admin"}
                          </span>
                          <span className="text-gray-400 ml-2">
                            {new Date(review.created_at).toLocaleString()}
                          </span>
                        </p>
                        {review.reason && (
                          <p className="text-gray-600 mt-0.5">{review.reason}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar — 1 column */}
        <div className="space-y-6">
          {/* Seller Info */}
          <section className="rounded-lg border bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Seller Info
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd className="font-medium">{seller?.full_name || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="font-medium break-all">{seller?.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Member since</dt>
                <dd className="font-medium">
                  {seller?.created_at
                    ? new Date(seller.created_at).toLocaleDateString()
                    : "—"}
                </dd>
              </div>
            </dl>
          </section>

          {/* Pricing */}
          <section className="rounded-lg border bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Pricing
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Asking Price</dt>
                <dd className="text-lg font-bold">
                  ${(listing.price / 100).toFixed(2)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Accepts Offers</dt>
                <dd className="font-medium">
                  {listing.accept_offers ? "Yes" : "No"}
                  {listing.accept_offers && listing.minimum_offer && (
                    <span className="text-gray-500">
                      {" "}
                      (min ${(listing.minimum_offer / 100).toFixed(2)})
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </section>

          {/* Admin Actions */}
          <AdminReviewActions
            listingId={listing.id}
            currentStatus={listing.status}
            isFlagged={listing.flagged}
            flagReason={listing.flag_reason}
          />
        </div>
      </div>
    </div>
  );
}
