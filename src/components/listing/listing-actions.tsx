"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ListingActionsProps {
  listingId: string;
  sellerId: string;
  sellerName: string;
  price: number;
  acceptOffers: boolean;
  minimumOffer: number | null;
  userId: string | null;
  initialWishlisted: boolean;
  initialWishlistId: string | null;
  initialFollowing: boolean;
  initialFollowId: string | null;
  isOwnListing: boolean;
}

export default function ListingActions({
  listingId,
  sellerId,
  sellerName,
  price,
  acceptOffers,
  minimumOffer,
  userId,
  initialWishlisted,
  initialWishlistId,
  initialFollowing,
  initialFollowId,
  isOwnListing,
}: ListingActionsProps) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [wishlistId, setWishlistId] = useState(initialWishlistId);
  const [following, setFollowing] = useState(initialFollowing);
  const [followId, setFollowId] = useState(initialFollowId);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerSubmitting, setOfferSubmitting] = useState(false);
  const [offerSent, setOfferSent] = useState(false);

  async function toggleWishlist() {
    if (!userId) {
      router.push(`/login?next=/listing/${listingId}`);
      return;
    }
    setWishlistLoading(true);
    const supabase = createClient();

    if (wishlisted && wishlistId) {
      await supabase.from("wishlists").delete().eq("id", wishlistId);
      setWishlisted(false);
      setWishlistId(null);
    } else {
      const { data } = await supabase
        .from("wishlists")
        .insert({ user_id: userId, listing_id: listingId })
        .select("id")
        .single();
      if (data) {
        setWishlisted(true);
        setWishlistId(data.id);
      }
    }
    setWishlistLoading(false);
  }

  async function toggleFollow() {
    if (!userId) {
      router.push(`/login?next=/listing/${listingId}`);
      return;
    }
    setFollowLoading(true);
    const supabase = createClient();

    if (following && followId) {
      await supabase.from("followed_sellers").delete().eq("id", followId);
      setFollowing(false);
      setFollowId(null);
    } else {
      const { data } = await supabase
        .from("followed_sellers")
        .insert({ follower_id: userId, seller_id: sellerId })
        .select("id")
        .single();
      if (data) {
        setFollowing(true);
        setFollowId(data.id);
      }
    }
    setFollowLoading(false);
  }

  async function submitOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) {
      router.push(`/login?next=/listing/${listingId}`);
      return;
    }

    const amountCents = Math.round(parseFloat(offerAmount) * 100);
    if (isNaN(amountCents) || amountCents <= 0) return;
    if (minimumOffer && amountCents < minimumOffer) return;

    setOfferSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("offers").insert({
      listing_id: listingId,
      buyer_id: userId,
      seller_id: sellerId,
      amount: amountCents,
      message: offerMessage.trim() || null,
    });

    if (!error) {
      setOfferSent(true);
      setShowOfferForm(false);
      setOfferAmount("");
      setOfferMessage("");
    }
    setOfferSubmitting(false);
  }

  return (
    <div className="space-y-4">
      {/* Price */}
      <div>
        <p className="text-3xl font-bold">
          ${(price / 100).toFixed(2)}
        </p>
        {acceptOffers && (
          <p className="mt-1 text-sm text-green-600">
            Accepting offers
            {minimumOffer
              ? ` (minimum $${(minimumOffer / 100).toFixed(2)})`
              : ""}
          </p>
        )}
      </div>

      {/* Buy / Offer Buttons */}
      {!isOwnListing && (
        <div className="flex gap-3">
          <button className="flex-1 rounded-md bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800">
            Buy Now
          </button>
          {acceptOffers && !offerSent && (
            <button
              onClick={() => setShowOfferForm(!showOfferForm)}
              className="flex-1 rounded-md border border-black px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50"
            >
              Make Offer
            </button>
          )}
          {offerSent && (
            <div className="flex flex-1 items-center justify-center rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              Offer Sent
            </div>
          )}
        </div>
      )}

      {/* Offer Form */}
      {showOfferForm && !isOwnListing && (
        <form
          onSubmit={submitOffer}
          className="rounded-lg border bg-gray-50 p-4 space-y-3"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Offer
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min={minimumOffer ? (minimumOffer / 100).toFixed(2) : "0.01"}
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder={(price / 100).toFixed(2)}
                className="w-full rounded-md border px-3 py-2 pl-7 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>
            {minimumOffer && (
              <p className="mt-1 text-xs text-gray-400">
                Minimum: ${(minimumOffer / 100).toFixed(2)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message (optional)
            </label>
            <textarea
              value={offerMessage}
              onChange={(e) => setOfferMessage(e.target.value)}
              rows={2}
              placeholder="Add a note to the seller..."
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={offerSubmitting}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {offerSubmitting ? "Sending..." : "Send Offer"}
            </button>
            <button
              type="button"
              onClick={() => setShowOfferForm(false)}
              className="rounded-md border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Escrow Info */}
      {!isOwnListing && (
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
          <p className="font-medium">Secure Escrow Payment</p>
          <p className="mt-1 text-blue-600">
            Your payment is held securely until you receive and verify the
            item. Full buyer protection included.
          </p>
        </div>
      )}

      {/* Wishlist + Share row */}
      {!isOwnListing && (
        <div className="flex gap-2">
          <button
            onClick={toggleWishlist}
            disabled={wishlistLoading}
            className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              wishlisted
                ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <svg
              className="h-4 w-4"
              fill={wishlisted ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {wishlisted ? "Saved" : "Save to Wishlist"}
          </button>
          <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
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
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </button>
        </div>
      )}

      {isOwnListing && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          This is your listing.
        </div>
      )}
    </div>
  );
}

export function SellerCard({
  sellerId,
  sellerName,
  sellerSince,
  userId,
  listingId,
  initialFollowing,
  initialFollowId,
  isOwnListing,
  reviewCount,
  avgRating,
}: {
  sellerId: string;
  sellerName: string;
  sellerSince: string;
  userId: string | null;
  listingId: string;
  initialFollowing: boolean;
  initialFollowId: string | null;
  isOwnListing: boolean;
  reviewCount: number;
  avgRating: number | null;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [followId, setFollowId] = useState(initialFollowId);
  const [loading, setLoading] = useState(false);

  async function toggleFollow() {
    if (!userId) {
      router.push(`/login?next=/listing/${listingId}`);
      return;
    }
    setLoading(true);
    const supabase = createClient();

    if (following && followId) {
      await supabase.from("followed_sellers").delete().eq("id", followId);
      setFollowing(false);
      setFollowId(null);
    } else {
      const { data } = await supabase
        .from("followed_sellers")
        .insert({ follower_id: userId, seller_id: sellerId })
        .select("id")
        .single();
      if (data) {
        setFollowing(true);
        setFollowId(data.id);
      }
    }
    setLoading(false);
  }

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-3 font-semibold">Seller</h2>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
          {(sellerName?.[0] ?? "?").toUpperCase()}
        </span>
        <div className="flex-1">
          <p className="font-medium">{sellerName || "Unknown"}</p>
          <p className="text-xs text-gray-500">
            Member since{" "}
            {new Date(sellerSince).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          {reviewCount > 0 && (
            <div className="mt-1 flex items-center gap-1">
              <span className="inline-flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className={`h-3 w-3 ${
                      avgRating && i <= Math.round(avgRating)
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </span>
              <span className="text-xs text-gray-500">
                {avgRating?.toFixed(1)} ({reviewCount}{" "}
                {reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>
      </div>
      {!isOwnListing && (
        <button
          onClick={toggleFollow}
          disabled={loading}
          className={`mt-3 w-full rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
            following
              ? "border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
              : "border-black bg-white text-black hover:bg-gray-50"
          }`}
        >
          {loading ? "..." : following ? "Following" : "Follow Seller"}
        </button>
      )}
    </div>
  );
}
