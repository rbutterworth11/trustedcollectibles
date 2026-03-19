"use client";

import { createClient } from "@/lib/supabase/client";

export async function checkBuyerProfile(): Promise<{ complete: boolean; redirectUrl: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { complete: false, redirectUrl: "/login" };
  }

  const meta = user.user_metadata || {};
  const hasAddress = meta.address?.line1 && meta.address?.city && meta.address?.postcode;
  const hasPhone = !!meta.phone;

  if (!hasAddress || !hasPhone) {
    return { complete: false, redirectUrl: "/dashboard/complete-profile?mode=buyer" };
  }

  return { complete: true, redirectUrl: "" };
}

export async function checkSellerProfile(): Promise<{ complete: boolean; redirectUrl: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { complete: false, redirectUrl: "/login" };
  }

  const meta = user.user_metadata || {};
  const hasAddress = meta.address?.line1 && meta.address?.city && meta.address?.postcode;
  const hasPhone = !!meta.phone;
  const hasDob = !!meta.date_of_birth;
  const isVerified = !!meta.seller_verified;

  if (!hasAddress || !hasPhone || !hasDob || !isVerified) {
    return { complete: false, redirectUrl: "/dashboard/complete-profile?mode=seller" };
  }

  return { complete: true, redirectUrl: "" };
}
