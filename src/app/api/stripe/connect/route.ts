import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripeServer } from "@/lib/stripe/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripeServer();

  const account = await stripe.accounts.create({
    type: "express",
    metadata: { supabase_user_id: user.id },
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/dashboard/settings`,
    return_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/dashboard/settings?stripe=success`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
