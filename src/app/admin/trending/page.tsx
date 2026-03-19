import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import TrendingEditor from "@/components/admin/trending-editor";

export const metadata: Metadata = { title: "Trending — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminTrendingPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("trending_profiles")
    .select("*")
    .order("sort_order");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">
        Trending Players & Teams
      </h1>
      <TrendingEditor profiles={profiles ?? []} />
    </div>
  );
}
