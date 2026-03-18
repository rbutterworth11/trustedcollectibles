"use client";

import { useState } from "react";

interface Props {
  initialSettings: Record<string, string>;
}

const FIELD_GROUPS = [
  {
    title: "General",
    fields: [
      { key: "site_name", label: "Site Name", type: "text" as const },
      { key: "contact_email", label: "Contact Email", type: "text" as const },
    ],
  },
  {
    title: "Commission & Pricing",
    fields: [
      {
        key: "commission_rate",
        label: "Commission Rate (%)",
        type: "text" as const,
      },
      {
        key: "min_listing_price",
        label: "Minimum Listing Price (pence)",
        type: "text" as const,
        hint: "Value in pence, e.g. 500 = \u00a35.00",
      },
      { key: "usd_rate", label: "USD Rate (from GBP)", type: "text" as const },
      { key: "eur_rate", label: "EUR Rate (from GBP)", type: "text" as const },
    ],
  },
  {
    title: "Authentication",
    fields: [
      {
        key: "accepted_coa_sources",
        label: "Accepted COA Sources",
        type: "textarea" as const,
        hint: "Comma-separated list",
      },
    ],
  },
  {
    title: "Shipping",
    fields: [
      {
        key: "shipping_options",
        label: "Shipping Options",
        type: "textarea" as const,
        hint: "Comma-separated list",
      },
    ],
  },
  {
    title: "Social Media",
    fields: [
      { key: "social_twitter", label: "Twitter URL", type: "text" as const },
      {
        key: "social_instagram",
        label: "Instagram URL",
        type: "text" as const,
      },
      { key: "social_facebook", label: "Facebook URL", type: "text" as const },
    ],
  },
];

export default function SiteSettingsEditor({ initialSettings }: Props) {
  const [settings, setSettings] =
    useState<Record<string, string>>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage({ text: data.error || "Save failed.", type: "error" });
      } else {
        setMessage({ text: "Settings saved successfully.", type: "success" });
      }
    } catch {
      setMessage({ text: "Network error.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "bg-brand-dark border border-white/[0.07] text-white focus:border-brand-amber rounded-md px-3 py-2 text-sm w-full outline-none transition-colors";
  const labelClass = "text-xs font-medium text-gray-400 mb-1 block";

  return (
    <div className="space-y-6">
      {FIELD_GROUPS.map((group) => (
        <div
          key={group.title}
          className="bg-brand-card border border-white/[0.07] rounded-lg p-5"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            {group.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.fields.map((field) => (
              <div
                key={field.key}
                className={
                  field.type === "textarea" ? "md:col-span-2" : undefined
                }
              >
                <label className={labelClass}>{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    value={settings[field.key] ?? ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    rows={3}
                    className={inputClass}
                  />
                ) : (
                  <input
                    type="text"
                    value={settings[field.key] ?? ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className={inputClass}
                  />
                )}
                {"hint" in field && field.hint && (
                  <p className="text-xs text-gray-500 mt-1">{field.hint}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-brand-amber px-6 py-2.5 text-sm font-semibold text-brand-dark hover:bg-brand-amber/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save All Settings"}
        </button>
        {message && (
          <p
            className={`text-sm ${
              message.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
