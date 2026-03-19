import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AdminAuthReview from "@/components/admin/admin-auth-review";

export const metadata: Metadata = { title: "Authentication Requests — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminAuthRequestsPage() {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("auth_requests")
    .select("*, user:profiles!auth_requests_user_id_fkey(full_name, email)")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Authentication Requests</h1>
      <AdminAuthReview requests={requests ?? []} />
    </div>
  );
}
