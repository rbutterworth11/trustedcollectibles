import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WishlistGrid from "@/components/dashboard/wishlist-grid";

export const metadata: Metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: items } = await supabase
    .from("wishlists")
    .select("*, listing:listings(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Wishlist</h1>
      <p className="mt-1 text-sm text-gray-400">
        Items you&apos;ve saved for later.
      </p>
      <div className="mt-6">
        <WishlistGrid items={items ?? []} />
      </div>
    </div>
  );
}
