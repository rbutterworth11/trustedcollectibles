"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCurrency } from "@/lib/currency";

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
  const { formatPrice, symbol } = useCurrency();
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
  const [buyLoading, setBuyLoading] = useState(false);
  const [offerSent, setOfferSent] = useState(false);

  async function handleBuyNow() {
    if (!userId) {
      router.push(`/login?next=/listing/${listingId}`);
      return;
    }
    setBuyLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
        setBuyLoading(false);
      }
    } catch {
      setBuyLoading(false);
    }
  }

  async function handleMessageSeller() {
    if (!userId) {
      router.push(`/login?next=/listing/${listingId}`);
      return;
    }
    const supabase = createClient();

    // Check if conversation already exists
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("listing_id", listingId)
      .eq("buyer_id", userId)
      .maybeSingle();

    if (existing) {
      router.push(`/dashboard/messages/${existing.id}`);
      return;
    }

    // Create new conversation
    const { data: conv } = await supabase
      .from("conversations")
      .insert({
        listing_id: listingId,
        buyer_id: userId,
        seller_id: sellerId,
      })
      .select("id")
      .single();

    if (conv) {
      router.push(`/dashboard/messages/${conv.id}`);
    }
  }

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

      // Notify seller about new offer
      await supabase.from("notifications").insert({
        user_id: sellerId,
        type: "offer_received",
        title: "New Offer Received",
        body: `You received an offer of ${formatPrice(amountCents)} on your listing.`,
        link: "/dashboard",
      });
    }
    setOfferSubmitting(false);
  }

  return (
    <div className="space-y-4">
      {/* Price */}
      <div>
        <p className="text-3xl font-bold text-brand-amber">
          {formatPrice(price)}
        </p>
        {acceptOffers && (
          <p className="mt-1 text-sm text-brand-offer-text">
            Accepting offers
            {minimumOffer
              ? ` (minimum ${formatPrice(minimumOffer)})`
              : ""}
          </p>
        )}
      </div>

      {/* Buy / Offer Buttons */}
      {!isOwnListing && (
        <div className="flex gap-3">
          <button
            onClick={handleBuyNow}
            disabled={buyLoading}
            className="flex-1 rounded-md bg-brand-amber px-4 py-3 min-h-[44px] text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-amber-hover disabled:opacity-50"
          >
            {buyLoading ? "Processing..." : "Buy Now"}
          </button>
          {acceptOffers && !offerSent && (
            <button
              onClick={() => setShowOfferForm(!showOfferForm)}
              className="flex-1 rounded-md border border-white/[0.07] px-4 py-3 min-h-[44px] text-sm font-medium text-gray-300 transition-colors hover:bg-white/5"
            >
              Make Offer
            </button>
          )}
          {offerSent && (
            <div className="flex flex-1 items-center justify-center rounded-md border border-green-500/20 bg-green-900/20 px-4 py-3 text-sm font-medium text-green-400">
              Offer Sent
            </div>
          )}
        </div>
      )}

      {/* Offer Form */}
      {showOfferForm && !isOwnListing && (
        <form
          onSubmit={submitOffer}
          className="rounded-lg border border-white/[0.07] bg-brand-card p-4 space-y-3"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Your Offer
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {symbol}
              </span>
              <input
                type="number"
                step="0.01"
                min={minimumOffer ? (minimumOffer / 100).toFixed(2) : "0.01"}
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder={(price / 100).toFixed(2)}
                className="w-full rounded-md border border-white/[0.07] bg-brand-card px-3 py-2 pl-7 text-sm text-white placeholder:text-gray-500 focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber"
                required
              />
            </div>
            {minimumOffer && (
              <p className="mt-1 text-xs text-gray-400">
                Minimum: {formatPrice(minimumOffer)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Message (optional)
            </label>
            <textarea
              value={offerMessage}
              onChange={(e) => setOfferMessage(e.target.value)}
              rows={2}
              placeholder="Add a note to the seller..."
              className="mt-1 w-full rounded-md border border-white/[0.07] bg-brand-card px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={offerSubmitting}
              className="rounded-md bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50"
            >
              {offerSubmitting ? "Sending..." : "Send Offer"}
            </button>
            <button
              type="button"
              onClick={() => setShowOfferForm(false)}
              className="rounded-md border border-white/[0.07] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Escrow Info */}
      {!isOwnListing && (
        <div className="rounded-lg border border-blue-500/20 bg-blue-900/20 p-4 text-sm text-blue-300">
          <p className="font-medium">Secure Escrow Payment</p>
          <p className="mt-1 text-blue-400">
            Your payment is held securely until you receive and verify the
            item. Full buyer protection included.
          </p>
        </div>
      )}

      {/* Wishlist + Share row */}
      {!isOwnListing && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={toggleWishlist}
            disabled={wishlistLoading}
            className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              wishlisted
                ? "border-brand-amber/30 bg-brand-amber/10 text-brand-amber hover:bg-brand-amber/20"
                : "border-white/[0.07] text-gray-300 hover:bg-white/5"
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
          <button className="flex items-center gap-2 rounded-md border border-white/[0.07] px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5">
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
          <button
            onClick={handleMessageSeller}
            className="flex items-center gap-2 rounded-md border border-white/[0.07] px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5"
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Message
          </button>
        </div>
      )}

      {isOwnListing && (
        <div className="rounded-lg border border-brand-amber/20 bg-brand-amber/10 p-4 text-sm text-brand-amber">
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
  const { formatPrice } = useCurrency();
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
    <div className="rounded-lg border border-white/[0.07] bg-brand-card p-4">
      <h2 className="mb-3 font-semibold text-white">Seller</h2>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-amber text-sm font-bold text-brand-dark">
          {(sellerName?.[0] ?? "?").toUpperCase()}
        </span>
        <div className="flex-1">
          <p className="font-medium text-white">{sellerName || "Unknown"}</p>
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
                        ? "text-brand-amber"
                        : "text-gray-600"
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
              ? "border-white/[0.07] bg-white/5 text-gray-300 hover:bg-white/10"
              : "border-brand-amber bg-brand-amber text-brand-dark font-semibold hover:bg-brand-amber-hover"
          }`}
        >
          {loading ? "..." : following ? "Following" : "Follow Seller"}
        </button>
      )}
    </div>
  );
}
