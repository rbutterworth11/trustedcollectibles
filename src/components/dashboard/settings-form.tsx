"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

const inputCls =
  "mt-1 w-full rounded-md border border-white/[0.07] bg-brand-card px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber";

export default function SettingsForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name);
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("United Kingdom");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Load current values from user_metadata
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const supabase = createClient();

    // Update profiles table
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        shipping_address: {
          line1: line1.trim(),
          line2: line2.trim(),
          city: city.trim(),
          postcode: postcode.trim(),
          country,
        },
      })
      .eq("id", profile.id);

    if (error) {
      setMessage("Failed to save. Please try again.");
      setSaving(false);
      return;
    }

    // Update auth user_metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName.trim(),
        phone: phone.trim(),
        date_of_birth: dob || undefined,
        address: {
          line1: line1.trim(),
          line2: line2.trim(),
          city: city.trim(),
          postcode: postcode.trim(),
          country,
        },
        profile_completed:
          !!(phone.trim() && line1.trim() && city.trim() && postcode.trim()) || undefined,
      },
    });

    if (authError) {
      setMessage("Profile saved but some metadata failed to update.");
    } else {
      setMessage("Profile updated.");
    }

    router.refresh();
    setSaving(false);
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-6">
      {/* Account info */}
      <div>
        <label className="block text-sm font-medium text-gray-300">Email</label>
        <input
          type="email"
          value={profile.email}
          disabled
          className="mt-1 w-full rounded-md border border-white/[0.07] bg-brand-dark px-3 py-2 text-sm text-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Account Type</label>
        <p className="mt-1 text-sm text-gray-400 capitalize">{profile.role}</p>
      </div>

      {/* Contact Details */}
      <div className="border-t border-white/[0.07] pt-6">
        <h3 className="text-sm font-semibold text-white mb-4">Contact Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputCls}
              placeholder="+44 7123 456789"
              autoComplete="tel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="border-t border-white/[0.07] pt-6">
        <h3 className="text-sm font-semibold text-white mb-4">Shipping Address</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Address Line 1</label>
            <input
              type="text"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              className={inputCls}
              placeholder="123 High Street"
              autoComplete="address-line1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Address Line 2</label>
            <input
              type="text"
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              className={inputCls}
              placeholder="Flat 4"
              autoComplete="address-line2"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputCls}
                placeholder="London"
                autoComplete="address-level2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Postcode</label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className={inputCls}
                placeholder="SW1A 1AA"
                autoComplete="postal-code"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputCls}
            >
              <option>United Kingdom</option>
              <option>Ireland</option>
              <option>United States</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>Germany</option>
              <option>France</option>
              <option>Spain</option>
              <option>Italy</option>
              <option>Netherlands</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stripe Connect */}
      {profile.role === "seller" && (
        <div className="border-t border-white/[0.07] pt-6">
          <label className="block text-sm font-medium text-gray-300">
            Stripe Connect
          </label>
          <p className="mt-1 text-sm text-gray-400">
            {profile.stripe_onboarded ? (
              <span className="text-green-400">Connected</span>
            ) : (
              <span className="text-yellow-400">
                Not connected — set up Stripe to receive payments.
              </span>
            )}
          </p>
          {!profile.stripe_onboarded && (
            <a
              href="/api/stripe/connect"
              className="mt-2 inline-block rounded-md bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover"
            >
              Connect Stripe
            </a>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-brand-amber px-6 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {message && (
          <span className="text-sm text-gray-400">{message}</span>
        )}
      </div>

      <div className="border-t border-white/[0.07] pt-6">
        <p className="text-xs text-gray-400">
          Member since{" "}
          {new Date(profile.created_at).toLocaleDateString()}
        </p>
      </div>
    </form>
  );
}
