"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCurrency } from "@/lib/currency";
import { SPORTS, ITEM_TYPES, CONDITIONS } from "@/lib/constants";

const inputCls = "block w-full rounded-md border border-white/[0.07] bg-brand-dark px-3 py-2 text-base text-white placeholder:text-gray-500 focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  const { formatPrice } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [player, setPlayer] = useState("");
  const [team, setTeam] = useState("");
  const [year, setYear] = useState("");
  const [sport, setSport] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [acceptOffers, setAcceptOffers] = useState(false);
  const [minimumOffer, setMinimumOffer] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.from("listings").select("*").eq("id", listingId).single().then(({ data }) => {
      if (!data) { router.push("/dashboard/listings"); return; }
      setTitle(data.title);
      setDescription(data.description);
      setPrice((data.price / 100).toFixed(2));
      setPlayer(data.player);
      setTeam(data.team || "");
      setYear(data.year || "");
      setSport(data.sport);
      setCategory(data.category);
      setCondition(data.condition);
      setAcceptOffers(data.accept_offers);
      setMinimumOffer(data.minimum_offer ? (data.minimum_offer / 100).toFixed(2) : "");
      setStatus(data.status);
      setLoading(false);
    });
  }, [listingId, router]);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const updates: Record<string, unknown> = {
      title: title.trim(),
      description: description.trim(),
      price: Math.round(parseFloat(price) * 100),
      player: player.trim(),
      team: team.trim(),
      year: year || null,
      sport,
      category,
      condition,
      accept_offers: acceptOffers,
      minimum_offer: minimumOffer ? Math.round(parseFloat(minimumOffer) * 100) : null,
    };

    const res = await fetch("/api/listings/edit", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, updates }),
    });

    const data = await res.json();
    if (res.ok) {
      if (data.reReview) {
        setMessage("Saved! Photos changed — listing sent for re-review.");
      } else {
        setMessage("Saved! Changes are live.");
      }
      router.refresh();
    } else {
      setMessage(data.error || "Failed to save.");
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="py-12 text-center text-gray-500">Loading...</div>;
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Listing</h1>
          <p className="text-sm text-gray-400 mt-1">
            Status: <span className="text-white capitalize">{status.replace(/_/g, " ")}</span>
          </p>
        </div>
        <button onClick={() => router.push("/dashboard/listings")} className="text-sm text-gray-400 hover:text-white">
          &larr; Back
        </button>
      </div>

      {status === "listed" && (
        <div className="mb-6 rounded-md border border-blue-500/20 bg-blue-900/20 p-3 text-xs text-blue-300">
          Text changes (title, description, price) will go live immediately. Photo or COA changes will send the listing for re-review.
        </div>
      )}

      <div className="space-y-5">
        <div className="rounded-lg border border-white/[0.07] bg-brand-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <div className="relative mt-1">
              <input maxLength={80} className={inputCls + " pr-16"} value={title} onChange={(e) => setTitle(e.target.value)} />
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${title.length > 70 ? "text-brand-amber" : "text-gray-500"}`}>{title.length}/80</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Sport</label>
              <select className={inputCls + " mt-1"} value={sport} onChange={(e) => setSport(e.target.value)}>
                {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Item Type</label>
              <select className={inputCls + " mt-1"} value={category} onChange={(e) => setCategory(e.target.value)}>
                {ITEM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Player</label>
              <input className={inputCls + " mt-1"} value={player} onChange={(e) => setPlayer(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Team</label>
              <input className={inputCls + " mt-1"} value={team} onChange={(e) => setTeam(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Year</label>
              <select className={inputCls + " mt-1"} value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">—</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Condition</label>
              <select className={inputCls + " mt-1"} value={condition} onChange={(e) => setCondition(e.target.value)}>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea rows={4} className={inputCls + " mt-1"} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        <div className="rounded-lg border border-white/[0.07] bg-brand-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">Pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Price (£)</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">£</span>
                <input type="number" step="0.01" min="0.01" className={inputCls + " pl-7"} value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={acceptOffers} onChange={(e) => setAcceptOffers(e.target.checked)} className="h-4 w-4 rounded border-white/[0.07] bg-brand-dark text-brand-amber focus:ring-brand-amber" />
                <span className="text-sm text-gray-300">Accept offers</span>
              </label>
            </div>
          </div>
          {acceptOffers && (
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-300">Minimum Offer (£)</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">£</span>
                <input type="number" step="0.01" className={inputCls + " pl-7"} value={minimumOffer} onChange={(e) => setMinimumOffer(e.target.value)} placeholder="Optional" />
              </div>
            </div>
          )}
        </div>

        {message && (
          <p className={`text-sm ${message.includes("Failed") ? "text-red-400" : "text-green-400"}`}>{message}</p>
        )}

        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className="rounded-md bg-brand-amber px-6 py-2.5 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={() => router.push("/dashboard/listings")} className="rounded-md border border-white/[0.07] px-6 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
