import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ListingsTable from "@/components/dashboard/listings-table";

export const metadata: Metadata = { title: "My Listings" };

export default async function MyListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Listings</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage your marketplace listings.
          </p>
        </div>
        <Link
          href="/dashboard/listings/new"
          className="rounded-md bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover"
        >
          + New Listing
        </Link>
      </div>
      <div className="mt-6">
        <ListingsTable listings={listings ?? []} />
      </div>
    </div>
  );
}
