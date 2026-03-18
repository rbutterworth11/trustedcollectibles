import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FollowingList from "@/components/dashboard/following-list";

export const metadata: Metadata = { title: "Following" };

export default async function FollowingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: followed } = await supabase
    .from("followed_sellers")
    .select("*, seller:profiles!followed_sellers_seller_id_fkey(*)")
    .eq("follower_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Following</h1>
      <p className="mt-1 text-sm text-gray-400">
        Sellers you follow. Get notified when they list new items.
      </p>
      <div className="mt-6">
        <FollowingList sellers={followed ?? []} />
      </div>
    </div>
  );
}
