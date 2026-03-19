"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ProfileBanner() {
  const [show, setShow] = useState<"buyer" | "seller" | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const meta = user.user_metadata || {};
      const hasAddress = meta.address?.line1 && meta.address?.city && meta.address?.postcode;
      const hasPhone = !!meta.phone;
      const profileComplete = hasAddress && hasPhone;

      if (!profileComplete) {
        setShow("buyer");
        return;
      }

      // Check if they're a seller without full verification
      supabase.from("profiles").select("role").eq("id", user.id).single().then(({ data }) => {
        if (data?.role === "buyer" && !meta.seller_verified) {
          // They might want to sell — show seller prompt only if they have listings or have visited sell page
          // For now, don't show seller prompt proactively
        }
      });
    });
  }, []);

  if (!show) return null;

  return (
    <div className="mb-4 rounded-lg border border-brand-amber/30 bg-brand-amber/10 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <svg className="h-5 w-5 text-brand-amber shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-white">Complete your profile</p>
          <p className="text-xs text-gray-400">Add your shipping address and phone number to start buying.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/dashboard/complete-profile?mode=buyer&next=/dashboard" className="rounded-md bg-brand-amber px-3 py-1.5 text-xs font-semibold text-brand-dark hover:bg-brand-amber-hover">
          Complete
        </Link>
        <button onClick={() => setShow(null)} className="text-gray-500 hover:text-white">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
