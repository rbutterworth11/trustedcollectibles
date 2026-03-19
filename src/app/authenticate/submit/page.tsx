"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/ui/image-upload";
import { SPORTS, ITEM_TYPES } from "@/lib/constants";

function SubmitForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier") === "premium" ? "premium" : "standard";
  const price = tier === "premium" ? 2999 : 1499;
  const priceDisplay = tier === "premium" ? "£29.99" : "£14.99";

  const [sport, setSport] = useState("");
  const [itemType, setItemType] = useState("");
  const [details, setDetails] = useState("");
  const [itemPhotos, setItemPhotos] = useState<string[]>([]);
  const [coaPhotos, setCoaPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updatePhoto(arr: string[], setArr: (v: string[]) => void, index: number, url: string) {
    const next = [...arr];
    if (url) { next[index] = url; } else { next.splice(index, 1); }
    setArr(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (itemPhotos.filter(Boolean).length === 0) { setError("At least one item photo is required."); return; }
    if (!sport) { setError("Please select a sport."); return; }
    if (!itemType) { setError("Please select an item type."); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/authenticate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, sport, itemType, details, itemPhotos: itemPhotos.filter(Boolean), coaPhotos: coaPhotos.filter(Boolean) }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to create checkout session.");
        setSubmitting(false);
      }
    } catch {
      setError("Something went wrong.");
      setSubmitting(false);
    }
  }

  const inputCls = "block w-full rounded-md border border-white/[0.07] bg-brand-dark px-3 py-2 text-base text-white placeholder:text-gray-500 focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber";

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-bold text-white">Submit for Authentication</h1>
        <div className="mt-2 flex items-center gap-3">
          <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${tier === "premium" ? "bg-brand-amber text-brand-dark" : "bg-white/[0.07] text-gray-300"}`}>
            {tier === "premium" ? "Detailed Report" : "Standard Check"}
          </span>
          <span className="text-sm text-gray-400">{priceDisplay}</span>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && <div className="rounded-md bg-red-900/20 border border-red-500/20 p-3 text-sm text-red-400">{error}</div>}

          {/* Item Photos */}
          <div className="rounded-lg border border-white/[0.07] bg-brand-card p-5 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Item Photos</h2>
              <p className="text-xs text-gray-500 mt-1">Upload clear photos: front, back, and signature close-up.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[...itemPhotos, "", "", ""].slice(0, 4).map((url, i) => (
                <ImageUpload key={`item-${i}`} label={["Front", "Back", "Signature", "Extra"][i]} folder="auth-checks" value={url || ""} onChange={(u) => updatePhoto(itemPhotos, setItemPhotos, i, u)} />
              ))}
            </div>
          </div>

          {/* COA Photos */}
          <div className="rounded-lg border border-white/[0.07] bg-brand-card p-5 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-white">COA Photos (if available)</h2>
              <p className="text-xs text-gray-500 mt-1">Upload photos of any certificate of authenticity.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[...coaPhotos, "", ""].slice(0, 3).map((url, i) => (
                <ImageUpload key={`coa-${i}`} label={["COA Front", "COA Back", "Hologram"][i]} folder="auth-checks" value={url || ""} onChange={(u) => updatePhoto(coaPhotos, setCoaPhotos, i, u)} />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="rounded-lg border border-white/[0.07] bg-brand-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white">Item Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Sport *</label>
                <select className={inputCls + " mt-1"} value={sport} onChange={(e) => setSport(e.target.value)}>
                  <option value="">Select sport</option>
                  {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Item Type *</label>
                <select className={inputCls + " mt-1"} value={itemType} onChange={(e) => setItemType(e.target.value)}>
                  <option value="">Select type</option>
                  {ITEM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Additional Details</label>
              <textarea rows={3} className={inputCls + " mt-1"} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Player name, year, how you obtained the item..." />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full rounded-md bg-brand-amber px-4 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50">
            {submitting ? "Processing..." : `Pay ${priceDisplay} & Submit`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SubmitPage() {
  return <Suspense fallback={<div className="min-h-screen bg-brand-dark" />}><SubmitForm /></Suspense>;
}
