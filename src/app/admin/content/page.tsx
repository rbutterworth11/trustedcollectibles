import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ContentEditor from "@/components/admin/content-editor";

export const metadata: Metadata = { title: "Content Management — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const supabase = await createClient();

  const [{ data: content }, { data: staffPicks }, { data: listings }] =
    await Promise.all([
      supabase.from("site_content").select("*").order("sort_order"),
      supabase
        .from("staff_picks")
        .select(
          "*, listing:listings(id, title, player, sport, price, images)"
        )
        .order("sort_order"),
      supabase
        .from("listings")
        .select("id, title, player, sport, price, images")
        .eq("status", "listed")
        .order("title"),
    ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Homepage Content</h1>
      <ContentEditor
        sections={content ?? []}
        staffPicks={staffPicks ?? []}
        allListings={listings ?? []}
      />
    </div>
  );
}
