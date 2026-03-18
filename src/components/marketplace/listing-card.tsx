"use client";

import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "@/lib/currency";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    sport: string;
    category: string;
    player: string;
    condition: string;
    price: number;
    accept_offers: boolean;
    images: string[] | null;
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { formatPrice } = useCurrency();
  const mainImage = listing.images?.[0];

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group rounded-lg border border-white/[0.07] bg-brand-card overflow-hidden hover:border-brand-amber/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 transition-all"
    >
      <div className="relative aspect-square bg-white/5">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No image
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium truncate text-sm text-white">{listing.title}</h3>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          {listing.sport} &middot; {listing.player}
        </p>

        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className="rounded bg-white/[0.07] px-1.5 py-0.5 text-xs text-gray-300">
            {listing.condition}
          </span>
          {listing.accept_offers && (
            <span className="rounded bg-brand-offer-bg px-1.5 py-0.5 text-xs text-brand-offer-text">
              Accepts Offers
            </span>
          )}
        </div>

        <p className="mt-2 font-bold text-brand-amber">
          {formatPrice(listing.price)}
        </p>
      </div>
    </Link>
  );
}
