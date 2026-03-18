"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ListingFormData } from "@/types";
import type { Database } from "@/types/supabase";
import ImageUpload from "@/components/ui/image-upload";
import { SPORTS, ITEM_TYPES, CONDITIONS, COA_SOURCES } from "@/lib/constants";
import {
  PLATFORM_COMMISSION_RATE,
  STRIPE_PROCESSING_RATE,
  STRIPE_FIXED_FEE,
} from "@/lib/constants";

const STEP_LABELS = ["Photos", "Details & Price", "Review"];

const INITIAL_DATA: ListingFormData = {
  mainPhoto: "",
  signaturePhoto: "",
  additionalPhotos: [],
  title: "",
  description: "",
  sport: "",
  category: "",
  player: "",
  team: "",
  year: "",
  condition: "",
  coaFront: "",
  coaBack: "",
  coaHologram: "",
  coaSource: "",
  coaCertificateNumber: "",
  price: "",
  acceptOffers: false,
  minimumOffer: "",
};

const inputCls =
  "block w-full rounded-md border border-white/[0.07] bg-brand-dark px-3 py-2 text-sm text-white placeholder:text-gray-500 shadow-sm focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber";
const labelCls = "block text-sm font-medium text-gray-300";

export default function NewListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ListingFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateData(updates: Partial<ListingFormData>) {
    setData((prev) => ({ ...prev, ...updates }));
    const clearedErrors = { ...errors };
    for (const key of Object.keys(updates)) delete clearedErrors[key];
    setErrors(clearedErrors);
  }

  function updateAdditionalPhoto(index: number, url: string) {
    const photos = [...data.additionalPhotos];
    if (url) { photos[index] = url; } else { photos.splice(index, 1); }
    updateData({ additionalPhotos: photos });
  }

  function validateStep(stepIndex: number): boolean {
    const e: Record<string, string> = {};

    if (stepIndex === 0) {
      if (!data.mainPhoto) e.mainPhoto = "Main photo is required.";
      if (!data.coaSource) e.coaSource = "COA source is required.";
      if (!data.coaCertificateNumber.trim()) e.coaCertificateNumber = "Certificate number is required.";
    }

    if (stepIndex === 1) {
      if (!data.title.trim()) e.title = "Title is required.";
      else if (data.title.length > 80) e.title = "Title must be 80 characters or less.";
      if (!data.sport) e.sport = "Sport is required.";
      if (!data.category) e.category = "Item type is required.";
      if (!data.player.trim()) e.player = "Player name is required.";
      if (!data.condition) e.condition = "Condition is required.";
      const price = parseFloat(data.price);
      if (!data.price || isNaN(price) || price <= 0) e.price = "Enter a valid price.";
      if (data.acceptOffers && data.minimumOffer) {
        const min = parseFloat(data.minimumOffer);
        if (isNaN(min) || min <= 0) e.minimumOffer = "Enter a valid minimum offer.";
        else if (min >= price) e.minimumOffer = "Must be less than asking price.";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }

  function buildPayload(status: "draft" | "pending_verification"): Omit<Database["public"]["Tables"]["listings"]["Insert"], "seller_id"> {
    const priceInCents = Math.round(parseFloat(data.price || "0") * 100);
    const allImages = [data.mainPhoto, ...data.additionalPhotos].filter(Boolean);
    return {
      title: data.title.trim(), description: data.description.trim(),
      sport: data.sport, category: data.category, player: data.player.trim(),
      team: data.team.trim(), year: data.year || null, condition: data.condition,
      price: priceInCents, accept_offers: data.acceptOffers,
      minimum_offer: data.minimumOffer ? Math.round(parseFloat(data.minimumOffer) * 100) : null,
      images: allImages, signature_photo: data.signaturePhoto || null,
      coa_front: data.coaFront || null, coa_back: data.coaBack || null,
      coa_hologram: data.coaHologram || null, coa_source: data.coaSource || null,
      coa_certificate_number: data.coaCertificateNumber.trim() || null,
      status,
    };
  }

  async function handleSubmit() {
    for (let i = 0; i < STEP_LABELS.length - 1; i++) {
      if (!validateStep(i)) { setStep(i); return; }
    }
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from("listings").insert({ ...buildPayload("pending_verification"), seller_id: user.id });
      if (error) alert(`Failed to submit: ${error.message}`);
      else setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveDraft() {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from("listings").insert({ ...buildPayload("draft"), seller_id: user.id });
      if (error) alert(`Failed to save: ${error.message}`);
      else router.push("/dashboard/listings");
    } finally {
      setSubmitting(false);
    }
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-65px)] bg-brand-dark">
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-900/40 mb-4">
            <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Listing Submitted!</h1>
          <p className="mt-2 text-gray-400">
            Your item has been submitted for verification. Our team will review it within 24-48 hours. You&apos;ll be notified once it&apos;s approved.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => { setData(INITIAL_DATA); setStep(0); setSubmitted(false); setErrors({}); }}
              className="rounded-md bg-brand-amber px-6 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover"
            >
              List Another Item
            </button>
            <button
              onClick={() => router.push("/dashboard/listings")}
              className="rounded-md border border-white/[0.07] px-6 py-3 text-sm font-medium text-gray-300 hover:bg-white/5"
            >
              View My Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));
  const priceNum = parseFloat(data.price || "0");

  return (
    <div className="min-h-[calc(100vh-65px)] bg-brand-dark">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold text-white">Create Listing</h1>

        {/* Step indicator */}
        <div className="mt-6 mb-8">
          <div className="flex items-center justify-between">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="flex items-center">
                <button
                  type="button"
                  onClick={() => { if (i < step) setStep(i); }}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    i === step ? "bg-brand-amber text-brand-dark"
                    : i < step ? "bg-green-600 text-white"
                    : "bg-white/5 text-gray-500"
                  }`}
                >
                  {i < step ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </button>
                <span className={`ml-2 hidden text-sm sm:inline ${i === step ? "font-medium text-brand-amber" : "text-gray-500"}`}>
                  {label}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`mx-3 h-px w-8 sm:w-16 ${i < step ? "bg-green-600" : "bg-white/[0.07]"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Photos & COA */}
        {step === 0 && (
          <div className="rounded-lg border border-white/[0.07] bg-brand-card p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Photos & Authentication</h2>
              <p className="text-sm text-gray-400 mt-1">Upload clear photos of your item and COA.</p>
            </div>

            <div>
              <label className={labelCls}>Item Photo <span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-2">Clear, well-lit photo of the full item.</p>
              <ImageUpload label="Main Photo" folder="listings" value={data.mainPhoto} onChange={(url) => updateData({ mainPhoto: url })} required />
            </div>

            <div>
              <label className={labelCls}>Signature Close-Up</label>
              <p className="text-xs text-gray-500 mb-2">Close-up of the autograph.</p>
              <ImageUpload label="Signature" folder="listings" value={data.signaturePhoto} onChange={(url) => updateData({ signaturePhoto: url })} />
            </div>

            <div>
              <label className={labelCls}>Additional Photos</label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[...data.additionalPhotos, ""].slice(0, 4).map((url, i) => (
                  <ImageUpload key={i} label={`Photo ${i + 1}`} folder="listings" value={url} onChange={(u) => updateAdditionalPhoto(i, u)} />
                ))}
              </div>
            </div>

            <hr className="border-white/[0.07]" />

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Certificate of Authenticity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>COA Source <span className="text-red-500">*</span></label>
                  <select className={inputCls + " mt-1"} value={data.coaSource} onChange={(e) => updateData({ coaSource: e.target.value })}>
                    <option value="">Select source</option>
                    {COA_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.coaSource && <p className="mt-1 text-xs text-red-400">{errors.coaSource}</p>}
                </div>
                <div>
                  <label className={labelCls}>Certificate # <span className="text-red-500">*</span></label>
                  <input className={inputCls + " mt-1"} value={data.coaCertificateNumber} onChange={(e) => updateData({ coaCertificateNumber: e.target.value })} placeholder="e.g. PSA-12345" />
                  {errors.coaCertificateNumber && <p className="mt-1 text-xs text-red-400">{errors.coaCertificateNumber}</p>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div>
                  <ImageUpload label="COA Front" folder="coa" value={data.coaFront} onChange={(url) => updateData({ coaFront: url })} />
                </div>
                <div>
                  <ImageUpload label="COA Back" folder="coa" value={data.coaBack} onChange={(url) => updateData({ coaBack: url })} />
                </div>
                <div>
                  <ImageUpload label="Hologram" folder="coa" value={data.coaHologram} onChange={(url) => updateData({ coaHologram: url })} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Details & Price */}
        {step === 1 && (
          <div className="rounded-lg border border-white/[0.07] bg-brand-card p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-white">Details & Pricing</h2>
              <p className="text-sm text-gray-400 mt-1">Describe your item and set your price.</p>
            </div>

            <div>
              <label className={labelCls}>Title <span className="text-red-500">*</span></label>
              <div className="mt-1.5 rounded-md border border-brand-amber/20 bg-brand-amber/5 px-3 py-2">
                <p className="text-xs font-medium text-brand-amber">Format: [Player name] signed [item type] [year/details]</p>
                <p className="mt-0.5 text-xs text-gray-400">e.g. &ldquo;Wayne Rooney signed Manchester United shirt 2011&rdquo;</p>
              </div>
              <div className="relative mt-2">
                <input maxLength={80} className={inputCls + " pr-16"} value={data.title} onChange={(e) => updateData({ title: e.target.value })} placeholder="Wayne Rooney signed Manchester United shirt 2011" />
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${data.title.length > 70 ? "text-brand-amber" : "text-gray-500"}`}>{data.title.length}/80</span>
              </div>
              {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Sport <span className="text-red-500">*</span></label>
                <select className={inputCls + " mt-1"} value={data.sport} onChange={(e) => updateData({ sport: e.target.value })}>
                  <option value="">Select sport</option>
                  {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.sport && <p className="mt-1 text-xs text-red-400">{errors.sport}</p>}
              </div>
              <div>
                <label className={labelCls}>Item Type <span className="text-red-500">*</span></label>
                <select className={inputCls + " mt-1"} value={data.category} onChange={(e) => updateData({ category: e.target.value })}>
                  <option value="">Select type</option>
                  {ITEM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Player <span className="text-red-500">*</span></label>
                <input className={inputCls + " mt-1"} value={data.player} onChange={(e) => updateData({ player: e.target.value })} placeholder="e.g. Wayne Rooney" />
                {errors.player && <p className="mt-1 text-xs text-red-400">{errors.player}</p>}
              </div>
              <div>
                <label className={labelCls}>Team</label>
                <input className={inputCls + " mt-1"} value={data.team} onChange={(e) => updateData({ team: e.target.value })} placeholder="e.g. Manchester United" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Year</label>
                <select className={inputCls + " mt-1"} value={data.year} onChange={(e) => updateData({ year: e.target.value })}>
                  <option value="">Select year</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Condition <span className="text-red-500">*</span></label>
                <select className={inputCls + " mt-1"} value={data.condition} onChange={(e) => updateData({ condition: e.target.value })}>
                  <option value="">Select condition</option>
                  {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.condition && <p className="mt-1 text-xs text-red-400">{errors.condition}</p>}
              </div>
            </div>

            <div>
              <label className={labelCls}>Description</label>
              <textarea rows={3} className={inputCls + " mt-1"} value={data.description} onChange={(e) => updateData({ description: e.target.value })} placeholder="Describe the item, how it was signed, any notable details..." />
            </div>

            <hr className="border-white/[0.07]" />

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Asking Price (£) <span className="text-red-500">*</span></label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">£</span>
                    <input type="number" step="0.01" min="0.01" className={inputCls + " pl-7"} value={data.price} onChange={(e) => updateData({ price: e.target.value })} placeholder="0.00" />
                  </div>
                  {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price}</p>}
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={data.acceptOffers} onChange={(e) => updateData({ acceptOffers: e.target.checked })} className="h-4 w-4 rounded border-white/[0.07] bg-brand-dark text-brand-amber focus:ring-brand-amber" />
                    <span className="text-sm text-gray-300">Accept offers</span>
                  </label>
                </div>
              </div>
              {data.acceptOffers && (
                <div className="mt-3 w-1/2">
                  <label className={labelCls}>Minimum Offer (£)</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">£</span>
                    <input type="number" step="0.01" min="0.01" className={inputCls + " pl-7"} value={data.minimumOffer} onChange={(e) => updateData({ minimumOffer: e.target.value })} placeholder="Optional" />
                  </div>
                  {errors.minimumOffer && <p className="mt-1 text-xs text-red-400">{errors.minimumOffer}</p>}
                </div>
              )}
              {priceNum > 0 && (
                <div className="mt-3 rounded-md bg-brand-dark border border-white/[0.07] p-3 text-xs space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Platform fee ({PLATFORM_COMMISSION_RATE * 100}%)</span>
                    <span>-£{(priceNum * PLATFORM_COMMISSION_RATE).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Stripe fee ({STRIPE_PROCESSING_RATE * 100}% + £{(STRIPE_FIXED_FEE / 100).toFixed(2)})</span>
                    <span>-£{(priceNum * STRIPE_PROCESSING_RATE + STRIPE_FIXED_FEE / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-400 font-medium pt-1 border-t border-white/[0.07]">
                    <span>Your payout</span>
                    <span>£{(priceNum - priceNum * PLATFORM_COMMISSION_RATE - priceNum * STRIPE_PROCESSING_RATE - STRIPE_FIXED_FEE / 100).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 2 && (
          <div className="rounded-lg border border-white/[0.07] bg-brand-card p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Review Your Listing</h2>
              <p className="text-sm text-gray-400 mt-1">Check everything looks good before submitting.</p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[data.mainPhoto, data.signaturePhoto, ...data.additionalPhotos].filter(Boolean).map((url, i) => (
                <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-white/5 border border-white/[0.07]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div><dt className="text-gray-500">Title</dt><dd className="text-white font-medium">{data.title}</dd></div>
              <div><dt className="text-gray-500">Price</dt><dd className="text-brand-amber font-bold">£{parseFloat(data.price || "0").toFixed(2)}</dd></div>
              <div><dt className="text-gray-500">Sport</dt><dd className="text-white">{data.sport}</dd></div>
              <div><dt className="text-gray-500">Item Type</dt><dd className="text-white">{data.category}</dd></div>
              <div><dt className="text-gray-500">Player</dt><dd className="text-white">{data.player}</dd></div>
              <div><dt className="text-gray-500">Team</dt><dd className="text-white">{data.team || "—"}</dd></div>
              <div><dt className="text-gray-500">Year</dt><dd className="text-white">{data.year || "—"}</dd></div>
              <div><dt className="text-gray-500">Condition</dt><dd className="text-white">{data.condition}</dd></div>
              <div><dt className="text-gray-500">COA Source</dt><dd className="text-white">{data.coaSource}</dd></div>
              <div><dt className="text-gray-500">Certificate #</dt><dd className="text-white">{data.coaCertificateNumber}</dd></div>
              {data.acceptOffers && <div><dt className="text-gray-500">Min Offer</dt><dd className="text-white">{data.minimumOffer ? `£${parseFloat(data.minimumOffer).toFixed(2)}` : "Any"}</dd></div>}
            </dl>
            {data.description && (
              <div>
                <dt className="text-sm text-gray-500">Description</dt>
                <dd className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{data.description}</dd>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="rounded-md border border-white/[0.07] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5">
                Back
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleSaveDraft} disabled={submitting} className="rounded-md border border-white/[0.07] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 disabled:opacity-50">
              Save Draft
            </button>
            {step < STEP_LABELS.length - 1 ? (
              <button type="button" onClick={handleNext} className="rounded-md bg-brand-amber px-6 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover">
                Continue
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={submitting} className="rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">
                {submitting ? "Submitting..." : "Submit for Verification"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
