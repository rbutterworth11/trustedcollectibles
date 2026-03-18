import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AdminUsersTable from "@/components/admin/admin-users-table";

export const metadata: Metadata = { title: "Users — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Users</h1>
      <AdminUsersTable users={users ?? []} />
    </div>
  );
}
