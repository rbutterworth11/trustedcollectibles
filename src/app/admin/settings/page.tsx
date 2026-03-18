import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SiteSettingsEditor from "@/components/admin/site-settings-editor";

export const metadata: Metadata = { title: "Settings — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("site_settings")
    .select("key, value");

  const settings: Record<string, string> = {};
  for (const row of rows ?? []) {
    settings[row.key] = row.value;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Site Settings</h1>
      <SiteSettingsEditor initialSettings={settings} />
    </div>
  );
}
