"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ProfileBanner() {
  const [incomplete, setIncomplete] = useState<string[]>([]);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const meta = user.user_metadata || {};
      const missing: string[] = [];

      if (!meta.email_verified_manually) missing.push("email verification");
      if (!meta.phone) missing.push("phone number");

      const hasAddress = meta.address?.line1 && meta.address?.city && meta.address?.postcode;
      if (!hasAddress) {
        // Fallback: check profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("shipping_address")
          .eq("id", user.id)
          .single();
        const addr = profile?.shipping_address as Record<string, string> | null;
        if (!addr?.line1 || !addr?.city || !addr?.postcode) {
          missing.push("shipping address");
        }
      }

      if (missing.length > 0) setIncomplete(missing);
    }
    check();
  }, []);

  if (incomplete.length === 0) return null;

  return (
    <div className="mb-4 rounded-lg border border-brand-amber/30 bg-brand-amber/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <svg className="h-5 w-5 text-brand-amber shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-white">Complete your profile to start buying and selling</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Missing: {incomplete.join(", ")}. Complete these to unlock purchases and listings.
          </p>
        </div>
      </div>
      <Link
        href="/dashboard/complete-profile?mode=buyer&next=/dashboard"
        className="shrink-0 rounded-md bg-brand-amber px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-amber-hover"
      >
        Complete Profile
      </Link>
    </div>
  );
}
