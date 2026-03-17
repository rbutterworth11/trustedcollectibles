"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { WishlistItem } from "@/types";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function WishlistGrid({ items }: { items: WishlistItem[] }) {
  const router = useRouter();

  async function handleRemove(id: string) {
    const supabase = createClient();
    await supabase.from("wishlists").delete().eq("id", id);
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-sm text-gray-400">Your wishlist is empty.</p>
        <Link
          href="/marketplace"
          className="mt-2 inline-block text-sm font-medium text-black hover:underline"
        >
          Browse the marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative rounded-lg border bg-white"
        >
          <Link href={`/listing/${item.listing_id}`}>
            <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
              {item.listing?.images?.[0] ? (
                <Image
                  src={item.listing.images[0]}
                  alt={item.listing.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-300">
                  No image
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-medium text-gray-900">
                {item.listing?.title ?? "—"}
              </p>
              <p className="text-xs text-gray-500">
                {item.listing?.player}
                {item.listing?.sport ? ` — ${item.listing.sport}` : ""}
              </p>
              <p className="mt-1 text-sm font-bold text-gray-900">
                {item.listing?.price ? formatPrice(item.listing.price) : "—"}
              </p>
              {item.listing?.status === "sold" && (
                <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                  Sold
                </span>
              )}
            </div>
          </Link>
          <button
            onClick={() => handleRemove(item.id)}
            className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
            title="Remove from wishlist"
          >
            <svg
              className="h-4 w-4 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
