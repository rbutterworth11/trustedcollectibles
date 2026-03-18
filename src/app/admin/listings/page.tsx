import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AdminListingsTable from "@/components/admin/admin-listings-table";

export const metadata: Metadata = { title: "All Listings — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from("listings")
    .select("*, profiles!listings_seller_id_fkey(id, email, full_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">All Listings</h1>
      <AdminListingsTable listings={listings ?? []} />
    </div>
  );
}
