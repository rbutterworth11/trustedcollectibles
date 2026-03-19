import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthRequestsList from "@/components/dashboard/auth-requests-list";

export const metadata: Metadata = { title: "Authentication Requests" };
export const dynamic = "force-dynamic";

export default async function AuthenticationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: requests } = await supabase.from("auth_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Authentication Requests</h1>
      <p className="mt-1 text-sm text-gray-400">Track the status of your authentication submissions.</p>
      <div className="mt-6">
        <AuthRequestsList requests={requests ?? []} />
      </div>
    </div>
  );
}
