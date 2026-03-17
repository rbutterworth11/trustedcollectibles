import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BuyerOffersTable from "@/components/dashboard/buyer-offers-table";

export default async function OffersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: offers } = await supabase
    .from("offers")
    .select("*, listing:listings(*), seller:profiles!offers_seller_id_fkey(*)")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">My Offers</h1>
      <p className="mt-1 text-sm text-gray-500">
        Track offers you&apos;ve made on listings.
      </p>
      <div className="mt-6">
        <BuyerOffersTable offers={offers ?? []} />
      </div>
    </div>
  );
}
