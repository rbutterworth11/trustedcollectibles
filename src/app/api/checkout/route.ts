import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeServer } from "@/lib/stripe/server";
import {
  PLATFORM_COMMISSION_RATE,
  STRIPE_PROCESSING_RATE,
  STRIPE_FIXED_FEE,
} from "@/lib/constants";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = await request.json();

  if (!listingId) {
    return NextResponse.json({ error: "Missing listingId" }, { status: 400 });
  }

  // Fetch the listing
  const { data: listing } = await supabase
    .from("listings")
    .select("*, profiles!listings_seller_id_fkey(id, stripe_account_id, stripe_onboarded)")
    .eq("id", listingId)
    .eq("status", "listed")
    .single();

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (listing.seller_id === user.id) {
    return NextResponse.json(
      { error: "Cannot buy your own listing" },
      { status: 400 }
    );
  }

  const seller = listing.profiles as unknown as {
    id: string;
    stripe_account_id: string | null;
    stripe_onboarded: boolean;
  };

  if (!seller?.stripe_account_id || !seller.stripe_onboarded) {
    return NextResponse.json(
      { error: "Seller has not completed payment setup" },
      { status: 400 }
    );
  }

  // Calculate fees
  const platformFee = Math.round(listing.price * PLATFORM_COMMISSION_RATE);
  const stripeFee = Math.round(
    listing.price * STRIPE_PROCESSING_RATE + STRIPE_FIXED_FEE
  );
  const totalAmount = listing.price + stripeFee;

  const stripe = getStripeServer();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Create Stripe Checkout Session with escrow-style payment
  // Payment is captured immediately but held — transfer to seller happens after delivery
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_intent_data: {
      // Funds go to the platform, then transferred to seller after delivery confirmation
      transfer_group: `order_${listingId}_${Date.now()}`,
      metadata: {
        listing_id: listingId,
        buyer_id: user.id,
        seller_id: listing.seller_id,
        platform_fee: String(platformFee),
        seller_stripe_account: seller.stripe_account_id,
      },
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: totalAmount,
          product_data: {
            name: listing.title,
            description: `${listing.sport} — ${listing.player} (${listing.condition})`,
            images: listing.images?.length ? [listing.images[0]] : [],
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/listing/${listingId}`,
    metadata: {
      listing_id: listingId,
      buyer_id: user.id,
      seller_id: listing.seller_id,
      amount: String(listing.price),
      platform_fee: String(platformFee),
    },
  });

  return NextResponse.json({ url: session.url });
}
