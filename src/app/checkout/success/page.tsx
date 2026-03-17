import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
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
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Payment Successful!
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Your payment has been received and is being held securely in escrow.
          The seller will be notified to ship your item.
        </p>

        {order && (
          <div className="mt-6 rounded-lg border bg-gray-50 p-4 text-left text-sm">
            <p className="font-medium text-gray-900">
              {(order.listing as { title: string } | null)?.title ?? "Item"}
            </p>
            <p className="mt-1 text-gray-500">
              Amount: ${(order.amount / 100).toFixed(2)}
            </p>
            <p className="text-gray-500">
              Status: Payment held in escrow
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/dashboard/orders"
            className="rounded-md bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            View My Orders
          </Link>
          <Link
            href="/marketplace"
            className="rounded-md border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
