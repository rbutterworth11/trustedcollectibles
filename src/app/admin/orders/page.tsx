import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AdminOrdersTable from "@/components/admin/admin-orders-table";

export const metadata: Metadata = { title: "Orders — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select(
      "*, listing:listings(title), buyer:profiles!orders_buyer_id_fkey(full_name, email), seller:profiles!orders_seller_id_fkey(full_name, email)"
    )
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Orders</h1>
      <AdminOrdersTable orders={orders ?? []} />
    </div>
  );
}
