import Link from "next/link";
import Image from "next/image";

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
  const mainImage = listing.images?.[0];

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group rounded-lg border bg-white overflow-hidden hover:border-gray-400 transition-colors"
    >
      <div className="relative aspect-square bg-gray-100">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium truncate text-sm">{listing.title}</h3>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {listing.sport} &middot; {listing.player}
        </p>

        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
            {listing.condition}
          </span>
          {listing.accept_offers && (
            <span className="rounded bg-green-50 px-1.5 py-0.5 text-xs text-green-700">
              Accepts Offers
            </span>
          )}
        </div>

        <p className="mt-2 font-semibold">
          ${(listing.price / 100).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
