import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SavedSearchesList from "@/components/dashboard/saved-searches-list";

export const metadata: Metadata = { title: "Saved Searches" };
export const dynamic = "force-dynamic";

export default async function SavedSearchesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: searches } = await supabase.from("saved_searches").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Saved Searches</h1>
      <p className="mt-1 text-sm text-gray-400">Get notified when new items match your searches.</p>
      <div className="mt-6">
        <SavedSearchesList searches={searches ?? []} />
      </div>
    </div>
  );
}
