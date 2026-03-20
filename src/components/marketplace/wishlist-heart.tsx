"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface WishlistHeartProps {
  listingId: string;
  className?: string;
}

export default function WishlistHeart({ listingId, className = "" }: WishlistHeartProps) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      supabase.from("wishlists").select("id").eq("user_id", user.id).eq("listing_id", listingId).maybeSingle().then(({ data }) => {
        if (data) { setWishlisted(true); setWishlistId(data.id); }
      });
    });
  }, [listingId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) { router.push(`/login?next=/marketplace`); return; }
    setLoading(true);
    const supabase = createClient();

    if (wishlisted && wishlistId) {
      await supabase.from("wishlists").delete().eq("id", wishlistId);
      setWishlisted(false);
      setWishlistId(null);
    } else {
      const { data } = await supabase.from("wishlists").insert({ user_id: userId, listing_id: listingId }).select("id").single();
      if (data) { setWishlisted(true); setWishlistId(data.id); }
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all ${
        wishlisted
          ? "bg-red-500/90 text-white shadow-lg"
          : "bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-black/70 hover:text-white"
      } ${wishlisted ? "opacity-100" : ""} ${className}`}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg className="h-4 w-4" fill={wishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}
