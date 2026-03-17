import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripeServer } from "@/lib/stripe/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// Use service role client for webhook (no user session)
function getServiceSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    const stripe = getStripeServer();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const supabase = getServiceSupabase();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const metadata = session.metadata;

        if (!metadata?.listing_id || !metadata?.buyer_id || !metadata?.seller_id) {
          break;
        }

        const amount = parseInt(metadata.amount, 10);
        const platformFee = parseInt(metadata.platform_fee, 10);

        // Create the order with payment_held status (escrow)
        await supabase.from("orders").insert({
          listing_id: metadata.listing_id,
          buyer_id: metadata.buyer_id,
          seller_id: metadata.seller_id,
          amount,
          platform_fee: platformFee,
          stripe_payment_intent_id: session.payment_intent as string,
          status: "payment_held",
        });

        // Mark listing as sold
        await supabase
          .from("listings")
          .update({ status: "sold" })
          .eq("id", metadata.listing_id);

        // Decline any pending offers on this listing
        await supabase
          .from("offers")
          .update({ status: "declined" })
          .eq("listing_id", metadata.listing_id)
          .eq("status", "pending");

        break;
      }

      case "account.updated": {
        const account = event.data.object;
        const userId = account.metadata?.supabase_user_id;

        if (userId && account.charges_enabled) {
          await supabase
            .from("profiles")
            .update({
              stripe_account_id: account.id,
              stripe_onboarded: true,
            })
            .eq("id", userId);
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }
}
