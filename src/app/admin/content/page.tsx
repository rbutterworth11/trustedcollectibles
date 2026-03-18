import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ContentEditor from "@/components/admin/content-editor";

export const metadata: Metadata = { title: "Content Management — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const supabase = await createClient();

  // Fetch data with graceful fallbacks for missing tables
  const safe = (query: PromiseLike<{ data: any }>) =>
    Promise.resolve(query).then(r => r.data ?? []).catch(() => []);

  const [contentResult, staffPicksResult, listingsResult] = await Promise.all([
    safe(supabase.from("site_content").select("*").order("sort_order")),
    safe(supabase.from("staff_picks").select("*, listing:listings(id, title, player, sport, price, images)").order("sort_order")),
    safe(supabase.from("listings").select("id, title, player, sport, price, images").eq("status", "listed").order("title")),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Homepage Content</h1>
      <ContentEditor
        sections={contentResult}
        staffPicks={staffPicksResult}
        allListings={listingsResult}
      />
    </div>
  );
}
