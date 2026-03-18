"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

export default function SettingsForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile.id);

    if (error) {
      setMessage("Failed to save. Please try again.");
    } else {
      setMessage("Profile updated.");
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Email
        </label>
        <input
          type="email"
          value={profile.email}
          disabled
          className="mt-1 w-full rounded-md border border-white/[0.07] bg-brand-dark px-3 py-2 text-sm text-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Full Name
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 w-full rounded-md border border-white/[0.07] bg-brand-card px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Account Type
        </label>
        <p className="mt-1 text-sm text-gray-400 capitalize">{profile.role}</p>
      </div>

      {profile.role === "seller" && (
        <div>
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
