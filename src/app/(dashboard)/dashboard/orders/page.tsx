import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrdersTable from "@/components/dashboard/orders-table";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isSeller = profile?.role === "seller" || profile?.role === "admin";

  const [{ data: orders }, { data: reviewedOrders }] = await Promise.all([
    supabase
      .from("orders")
      .select(
        "*, listing:listings(*), buyer:profiles!orders_buyer_id_fkey(*), seller:profiles!orders_seller_id_fkey(*)"
      )
      .eq(isSeller ? "seller_id" : "buyer_id", user.id)
      .order("created_at", { ascending: false }),
    !isSeller
      ? supabase
          .from("seller_reviews")
          .select("order_id")
          .eq("reviewer_id", user.id)
      : Promise.resolve({ data: [] as { order_id: string }[] }),
  ]);

  const reviewedOrderIds = new Set(
    (reviewedOrders ?? []).map((r) => r.order_id)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        {isSeller ? "Orders" : "My Orders"}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {isSeller
          ? "Manage orders from your buyers."
          : "Track your purchases."}
      </p>
      <div className="mt-6">
        <OrdersTable
          orders={orders ?? []}
          viewAs={isSeller ? "seller" : "buyer"}
          reviewedOrderIds={Array.from(reviewedOrderIds)}
        />
      </div>
    </div>
  );
}
