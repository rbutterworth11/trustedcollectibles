import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripeServer } from "@/lib/stripe/server";

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

    switch (event.type) {
      case "payment_intent.succeeded":
        // TODO: Update order status, notify seller
        break;
      case "account.updated":
        // TODO: Update seller's Stripe onboarding status
        break;
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
