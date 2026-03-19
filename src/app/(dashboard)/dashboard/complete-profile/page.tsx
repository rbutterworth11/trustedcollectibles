"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inputCls = "mt-1 block w-full rounded-md border border-white/[0.07] bg-brand-dark px-3 py-2 text-base text-white placeholder:text-gray-500 focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber";

export default function CompleteProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") || "/dashboard";
  const mode = searchParams.get("mode"); // "buyer" or "seller"

  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("United Kingdom");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill from existing profile data
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata) {
        const m = user.user_metadata;
        if (m.phone) setPhone(m.phone);
        if (m.date_of_birth) setDob(m.date_of_birth);
        if (m.address) {
          if (m.address.line1) setLine1(m.address.line1);
          if (m.address.line2) setLine2(m.address.line2);
          if (m.address.city) setCity(m.address.city);
          if (m.address.postcode) setPostcode(m.address.postcode);
          if (m.address.country) setCountry(m.address.country);
        }
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!phone.trim()) { setError("Phone number is required."); return; }
    if (!line1.trim()) { setError("Address line 1 is required."); return; }
    if (!city.trim()) { setError("City is required."); return; }
    if (!postcode.trim()) { setError("Postcode is required."); return; }

    if (mode === "seller") {
      if (!dob) { setError("Date of birth is required for sellers."); return; }
    }

    setSaving(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        phone: phone.trim(),
        date_of_birth: dob || undefined,
        address: { line1: line1.trim(), line2: line2.trim(), city: city.trim(), postcode: postcode.trim(), country },
        profile_completed: true,
        seller_verified: mode === "seller" ? true : undefined,
      },
    });

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    // Also update the profiles table shipping_address
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({
        shipping_address: { line1: line1.trim(), line2: line2.trim(), city: city.trim(), postcode: postcode.trim(), country },
      }).eq("id", user.id);

      // If seller mode, update role to seller
      if (mode === "seller") {
        await supabase.from("profiles").update({ role: "seller" }).eq("id", user.id);
      }
    }

    router.push(redirectTo);
    router.refresh();
  }

  const isSeller = mode === "seller";

  return (
    <div className="mx-auto max-w-lg py-8">
      <h1 className="text-2xl font-bold text-white">
        {isSeller ? "Verify Your Identity to Start Selling" : "Complete Your Profile"}
      </h1>
      <p className="mt-2 text-sm text-gray-400">
        {isSeller
          ? "We need your details to verify your identity and protect the platform."
          : "We need your shipping address and phone number before you can make a purchase."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && <div className="rounded-md bg-red-900/20 border border-red-500/20 p-3 text-sm text-red-400">{error}</div>}

        <div className="rounded-lg border border-white/[0.07] bg-brand-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">Contact</h2>
          <div>
            <label className="block text-sm font-medium text-gray-300">Phone Number *</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+44 7123 456789" autoComplete="tel" />
          </div>
          {isSeller && (
            <div>
              <label className="block text-sm font-medium text-gray-300">Date of Birth *</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputCls} />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-white/[0.07] bg-brand-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">Shipping Address</h2>
          <div>
            <label className="block text-sm font-medium text-gray-300">Address Line 1 *</label>
            <input type="text" value={line1} onChange={(e) => setLine1(e.target.value)} className={inputCls} placeholder="123 High Street" autoComplete="address-line1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Address Line 2</label>
            <input type="text" value={line2} onChange={(e) => setLine2(e.target.value)} className={inputCls} placeholder="Flat 4" autoComplete="address-line2" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300">City *</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} placeholder="London" autoComplete="address-level2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Postcode *</label>
              <input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} className={inputCls} placeholder="SW1A 1AA" autoComplete="postal-code" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls}>
              <option>United Kingdom</option><option>Ireland</option><option>United States</option>
              <option>Canada</option><option>Australia</option><option>Germany</option>
              <option>France</option><option>Spain</option><option>Italy</option><option>Netherlands</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full rounded-md bg-brand-amber px-4 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50">
          {saving ? "Saving..." : isSeller ? "Verify & Start Selling" : "Save & Continue"}
        </button>
      </form>
    </div>
  );
}
