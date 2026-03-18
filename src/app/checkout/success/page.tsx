import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Payment Successful",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !session_id) redirect("/");

  // Find the order created by the webhook
  // The webhook creates the order when payment_intent.succeeded fires.
  // If the order hasn't been created yet, show a pending state.
  // We check by looking for a recent order from this buyer.
  const { data: order } = await supabase
    .from("orders")
    .select("*, listing:listings(title)")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4 bg-brand-dark">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-900/40">
          <svg
            className="h-8 w-8 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">
          Payment Successful!
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Your payment has been received and is being held securely in escrow.
          The seller will be notified to ship your item.
        </p>

        {order && (
          <div className="mt-6 rounded-lg border border-white/[0.07] bg-brand-card p-4 text-left text-sm">
            <p className="font-medium text-white">
              {(order.listing as { title: string } | null)?.title ?? "Item"}
            </p>
            <p className="mt-1 text-gray-400">
              Amount: ${(order.amount / 100).toFixed(2)}
            </p>
            <p className="text-gray-400">
              Status: Payment held in escrow
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/dashboard/orders"
            className="rounded-md bg-brand-amber px-6 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover"
          >
            View My Orders
          </Link>
          <Link
            href="/marketplace"
            className="rounded-md border border-white/[0.07] px-6 py-2 text-sm font-medium text-gray-300 hover:bg-white/5"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
