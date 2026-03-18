import { createClient } from "@/lib/supabase/server";
import ListingCard from "@/components/marketplace/listing-card";

interface SimilarItemsProps {
  listingId: string;
  sport: string;
  category: string;
  player: string;
}

export default async function SimilarItems({ listingId, sport, category, player }: SimilarItemsProps) {
  const supabase = await createClient();

  // Try to find items by same player first, then same sport+category
  const { data: similar } = await supabase
    .from("listings")
    .select("id, title, sport, category, player, condition, price, accept_offers, images")
    .eq("status", "listed")
    .neq("id", listingId)
    .or(`player.ilike.%${player}%,and(sport.eq.${sport},category.eq.${category})`)
    .limit(4);

  if (!similar?.length) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-white mb-4">Similar Items</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {similar.map((listing: any) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
