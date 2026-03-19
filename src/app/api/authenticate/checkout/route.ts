import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeServer } from "@/lib/stripe/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in to continue" }, { status: 401 });

  const { tier, sport, itemType, details, itemPhotos, coaPhotos } = await request.json();

  if (!sport || !itemType || !itemPhotos?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const validTier = tier === "premium" ? "premium" : "standard";
  const amount = validTier === "premium" ? 2999 : 1499;
  const label = validTier === "premium" ? "Detailed Authentication Report" : "Standard Authentication Check";

  // Create the auth request record
  const { data: authReq, error: insertError } = await supabase.from("auth_requests").insert({
    user_id: user.id,
    tier: validTier,
    sport,
    item_type: itemType,
    details: details?.trim() || null,
    item_photos: itemPhotos,
    coa_photos: coaPhotos || [],
    amount,
    status: "pending_payment",
  }).select("id").single();

  if (insertError || !authReq) {
    return NextResponse.json({ error: insertError?.message || "Failed to create request" }, { status: 500 });
  }

  // Create Stripe Checkout Session
  const stripe = getStripeServer();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{
      price_data: {
        currency: "gbp",
        unit_amount: amount,
        product_data: { name: label, description: `TrustedCollectibles ${label}` },
      },
      quantity: 1,
    }],
    success_url: `${baseUrl}/authenticate/success?request_id=${authReq.id}`,
    cancel_url: `${baseUrl}/authenticate`,
    metadata: { auth_request_id: authReq.id, user_id: user.id },
  });

  // Save stripe session id
  await supabase.from("auth_requests").update({ stripe_session_id: session.id }).eq("id", authReq.id);

  return NextResponse.json({ url: session.url });
}
