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
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={profile.email}
          disabled
          className="mt-1 w-full rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Account Type
        </label>
        <p className="mt-1 text-sm text-gray-600 capitalize">{profile.role}</p>
      </div>

      {profile.role === "seller" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stripe Connect
          </label>
          <p className="mt-1 text-sm text-gray-600">
            {profile.stripe_onboarded ? (
              <span className="text-green-600">Connected</span>
            ) : (
              <span className="text-yellow-600">
                Not connected — set up Stripe to receive payments.
              </span>
            )}
          </p>
          {!profile.stripe_onboarded && (
            <a
              href="/api/stripe/connect"
              className="mt-2 inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
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
          className="rounded-md bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {message && (
          <span className="text-sm text-gray-500">{message}</span>
        )}
      </div>

      <div className="border-t pt-6">
        <p className="text-xs text-gray-400">
          Member since{" "}
          {new Date(profile.created_at).toLocaleDateString()}
        </p>
      </div>
    </form>
  );
}
