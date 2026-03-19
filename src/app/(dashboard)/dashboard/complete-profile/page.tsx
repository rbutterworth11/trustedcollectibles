"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inputCls = "mt-1 block w-full rounded-md border border-white/[0.07] bg-brand-dark px-3 py-2 text-base text-white placeholder:text-gray-500 focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber";

export default function CompleteProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") || "/dashboard";
  const mode = searchParams.get("mode");

  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("United Kingdom");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserEmail(user.email || "");
      if (user.email_confirmed_at || user.user_metadata?.email_verified_manually) {
        setEmailVerified(true);
      }
      const m = user.user_metadata || {};
      if (m.phone) setPhone(m.phone as string);
      if (m.date_of_birth) setDob(m.date_of_birth as string);
      if (m.address) {
        const a = m.address as Record<string, string>;
        if (a.line1) setLine1(a.line1);
        if (a.line2) setLine2(a.line2);
        if (a.city) setCity(a.city);
        if (a.postcode) setPostcode(a.postcode);
        if (a.country) setCountry(a.country);
      }
    });
  }, []);

  async function sendCode() {
    setEmailSending(true);
    setVerifyError("");
    const res = await fetch("/api/auth/verify-email", { method: "POST" });
    const data = await res.json();
    if (data.verified) setEmailVerified(true);
    else if (data.sent) setEmailSent(true);
    setEmailSending(false);
  }

  async function checkCode() {
    setVerifying(true);
    setVerifyError("");
    const res = await fetch("/api/auth/verify-email", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: verifyCode }),
    });
    const data = await res.json();
    if (data.verified) setEmailVerified(true);
    else setVerifyError(data.error || "Verification failed.");
    setVerifying(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!emailVerified) { setError("Please verify your email first."); return; }
    if (!phone.trim()) { setError("Phone number is required."); return; }
    if (!line1.trim()) { setError("Address line 1 is required."); return; }
    if (!city.trim()) { setError("City is required."); return; }
    if (!postcode.trim()) { setError("Postcode is required."); return; }
    if (mode === "seller" && !dob) { setError("Date of birth is required for sellers."); return; }

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
    if (updateError) { setError(updateError.message); setSaving(false); return; }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({
        shipping_address: { line1: line1.trim(), line2: line2.trim(), city: city.trim(), postcode: postcode.trim(), country },
      }).eq("id", user.id);
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
        {isSeller ? "We need to verify your identity to protect the platform." : "We need a few details before you can make a purchase."}
      </p>

      <div className="mt-8 space-y-5">
        {error && <div className="rounded-md bg-red-900/20 border border-red-500/20 p-3 text-sm text-red-400">{error}</div>}

        {/* Email Verification */}
        <div className={`rounded-lg border p-5 ${emailVerified ? "border-green-500/30 bg-green-900/10" : "border-white/[0.07] bg-brand-card"}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              {emailVerified && (
                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              Email Verification
            </h2>
            {emailVerified && <span className="text-xs text-green-400 font-medium">Verified</span>}
          </div>
          {emailVerified ? (
            <p className="mt-2 text-sm text-gray-400">{userEmail} is verified.</p>
          ) : !emailSent ? (
            <div className="mt-3">
              <p className="text-sm text-gray-400">We&apos;ll send a 6-digit code to <span className="text-white font-medium">{userEmail}</span></p>
              <button onClick={sendCode} disabled={emailSending} className="mt-3 rounded-md bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50">
                {emailSending ? "Sending..." : "Send Verification Code"}
              </button>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-gray-400">Enter the 6-digit code sent to <span className="text-white font-medium">{userEmail}</span></p>
              <div className="flex gap-2">
                <input type="text" value={verifyCode} onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" maxLength={6} className="w-36 rounded-md border border-white/[0.07] bg-brand-dark px-4 py-2 text-center text-lg font-bold tracking-widest text-white placeholder:text-gray-600 focus:border-brand-amber focus:ring-brand-amber" />
                <button onClick={checkCode} disabled={verifying || verifyCode.length !== 6} className="rounded-md bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50">
                  {verifying ? "..." : "Verify"}
                </button>
              </div>
              {verifyError && <p className="text-xs text-red-400">{verifyError}</p>}
              <button onClick={sendCode} className="text-xs text-brand-amber hover:text-brand-amber-hover">Resend code</button>
            </div>
          )}
        </div>

        {/* Contact & Address */}
        <form onSubmit={handleSubmit} className="space-y-5">
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

          <button type="submit" disabled={saving || !emailVerified} className="w-full rounded-md bg-brand-amber px-4 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50">
            {saving ? "Saving..." : !emailVerified ? "Verify email first" : isSeller ? "Verify & Start Selling" : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
