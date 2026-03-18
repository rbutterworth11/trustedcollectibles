import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReviewForm from "@/components/dashboard/review-form";

export const metadata: Metadata = { title: "Leave a Review" };
export const dynamic = "force-dynamic";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: order } = await supabase
    .from("orders")
    .select(
      "*, listing:listings(title, images), seller:profiles!orders_seller_id_fkey(full_name)"
    )
    .eq("id", id)
    .eq("buyer_id", user.id)
    .single();

  if (!order) notFound();

  if (order.status !== "completed") {
    redirect("/dashboard/orders");
  }

  // Check if already reviewed
  const { data: existingReview } = await supabase
    .from("seller_reviews")
    .select("id")
    .eq("order_id", id)
    .maybeSingle();

  if (existingReview) {
    redirect("/dashboard/orders");
  }

  const listing = order.listing as { title: string; images: string[] } | null;
  const seller = order.seller as { full_name: string } | null;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-white">Leave a Review</h1>
      <p className="mt-1 text-sm text-gray-400">
        How was your experience with this purchase?
      </p>

      <div className="mt-6 rounded-lg border border-white/[0.07] bg-brand-card p-4">
        <p className="font-medium text-white">
          {listing?.title ?? "Item"}
        </p>
        <p className="text-sm text-gray-400">
          Sold by {seller?.full_name ?? "Seller"} &middot; £
          {(order.amount / 100).toFixed(2)}
        </p>
      </div>

      <div className="mt-6">
        <ReviewForm orderId={id} />
      </div>
    </div>
  );
}
