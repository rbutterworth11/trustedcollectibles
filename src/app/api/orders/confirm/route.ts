import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeServer } from "@/lib/stripe/server";
import { sendDeliveryConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await request.json();

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  // Verify the user is the buyer
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("buyer_id", user.id)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (order.status !== "delivered") {
    return NextResponse.json(
      { error: "Order must be in delivered status to confirm" },
      { status: 400 }
    );
  }

  // Transfer funds to seller (release escrow)
  if (order.stripe_payment_intent_id) {
    try {
      const { data: seller } = await supabase
        .from("profiles")
        .select("stripe_account_id")
        .eq("id", order.seller_id)
        .single();

      if (seller?.stripe_account_id) {
        const stripe = getStripeServer();
        const sellerPayout = order.amount - order.platform_fee;

        await stripe.transfers.create({
          amount: sellerPayout,
          currency: "usd",
          destination: seller.stripe_account_id,
          transfer_group: `order_${order.listing_id}`,
          metadata: { order_id: order.id },
        });
      }
    } catch (err) {
      console.error("Transfer failed:", err);
      // Continue to mark as completed even if transfer fails (can retry)
    }
  }

  // Mark order as completed
  const { error } = await supabase
    .from("orders")
    .update({ status: "completed" })
    .eq("id", orderId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send delivery confirmation emails to both parties
  const [{ data: buyerProfile }, { data: sellerProfile }, { data: listingData }] = await Promise.all([
    supabase.from("profiles").select("email, full_name").eq("id", user.id).single(),
    supabase.from("profiles").select("email, full_name").eq("id", order.seller_id).single(),
    supabase.from("listings").select("title").eq("id", order.listing_id).single(),
  ]);
  if (buyerProfile && sellerProfile && listingData) {
    sendDeliveryConfirmation(
      buyerProfile.email, sellerProfile.email,
      buyerProfile.full_name, sellerProfile.full_name,
      listingData.title, order.amount, order.platform_fee
    );
  }

  return NextResponse.json({ success: true });
}
