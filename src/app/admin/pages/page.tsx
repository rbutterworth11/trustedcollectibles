import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ContentPagesEditor from "@/components/admin/content-pages-editor";

export const metadata: Metadata = { title: "Pages — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("content_pages")
    .select("*")
    .order("slug");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Content Pages</h1>
      <ContentPagesEditor pages={pages ?? []} />
    </div>
  );
}
