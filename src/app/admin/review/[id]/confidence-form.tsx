"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FACTORS = [
  { key: "verified_coa", label: "Verified COA present" },
  { key: "coa_hologram", label: "COA hologram confirmed" },
  { key: "signature_match", label: "Signature matches known examples" },
  { key: "condition_consistent", label: "Item condition consistent with age" },
  { key: "seller_verified", label: "Seller is ID verified" },
  { key: "seller_high_rating", label: "Seller has high rating" },
  { key: "clear_photos", label: "Multiple clear photos provided" },
  { key: "cert_number_verified", label: "Certificate number verified" },
];

interface ConfidenceFormProps {
  listingId: string;
  initialScore: number | null;
  initialFactors: string[];
}

export default function ConfidenceForm({
  listingId,
  initialScore,
  initialFactors,
}: ConfidenceFormProps) {
  const router = useRouter();
  const [score, setScore] = useState(initialScore ?? 0);
  const [factors, setFactors] = useState<string[]>(initialFactors);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function toggleFactor(key: string) {
    setFactors((prev) => {
      const next = prev.includes(key)
        ? prev.filter((f) => f !== key)
        : [...prev, key];
      // Auto-calculate suggested score based on factors
      const suggested = Math.round((next.length / FACTORS.length) * 100);
      setScore(suggested);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/confidence", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, score, factors }),
    });
    if (res.ok) {
      setMessage("Saved!");
      router.refresh();
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to save");
    }
    setSaving(false);
  }

  const color =
    score >= 80 ? "text-green-400" : score >= 50 ? "text-brand-amber" : "text-red-400";
  const barColor =
    score >= 80 ? "bg-green-400" : score >= 50 ? "bg-brand-amber" : "bg-red-400";

  return (
    <section className="rounded-lg border border-white/[0.07] bg-brand-card p-5 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
        Confidence Score
      </h2>

      {/* Score slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-400">Score</label>
          <span className={`text-lg font-bold ${color}`}>{score}%</span>
        </div>
        <div className="relative h-2 rounded-full bg-white/[0.07] overflow-hidden mb-1">
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${barColor} transition-all`}
            style={{ width: `${score}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={score}
          onChange={(e) => setScore(parseInt(e.target.value))}
          className="w-full accent-brand-amber"
        />
        <div className="flex justify-between text-[10px] text-gray-500">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Factor checkboxes */}
      <div>
        <label className="text-xs font-medium text-gray-400 mb-2 block">
          Contributing Factors
        </label>
        <div className="space-y-2">
          {FACTORS.map((f) => {
            const checked = factors.includes(f.key);
            return (
              <label
                key={f.key}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleFactor(f.key)}
                  className="h-4 w-4 rounded border-white/[0.07] bg-brand-dark text-brand-amber focus:ring-brand-amber"
                />
                <span
                  className={`text-sm ${
                    checked ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                  }`}
                >
                  {f.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Score"}
        </button>
        {message && (
          <span
            className={`text-xs ${
              message === "Saved!" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </span>
        )}
      </div>
    </section>
  );
}
