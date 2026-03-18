"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ListingFormData } from "@/types";
import type { Database } from "@/types/supabase";
import StepPhotos from "@/components/marketplace/step-photos";
import StepDetails from "@/components/marketplace/step-details";
import StepCoa from "@/components/marketplace/step-coa";
import StepPricing from "@/components/marketplace/step-pricing";
import StepReview from "@/components/marketplace/step-review";

const STEP_LABELS = ["Photos", "Details", "COA", "Pricing", "Review"];

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

export default function NewListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ListingFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateData(updates: Partial<ListingFormData>) {
    setData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const clearedErrors = { ...errors };
    for (const key of Object.keys(updates)) {
      delete clearedErrors[key];
    }
    setErrors(clearedErrors);
  }

  function validateStep(stepIndex: number): boolean {
    const newErrors: Record<string, string> = {};

    if (stepIndex === 0) {
      if (!data.mainPhoto) newErrors.mainPhoto = "Main photo is required.";
      if (!data.signaturePhoto) newErrors.signaturePhoto = "Signature close-up is required.";
    }

    if (stepIndex === 1) {
      if (!data.title.trim()) newErrors.title = "Title is required.";
      else if (data.title.length > 80) newErrors.title = "Title must be 80 characters or less.";
      if (!data.description.trim()) newErrors.description = "Description is required.";
      if (!data.sport) newErrors.sport = "Sport is required.";
      if (!data.category) newErrors.category = "Item type is required.";
      if (!data.player.trim()) newErrors.player = "Player name is required.";
      if (!data.team.trim()) newErrors.team = "Team is required.";
      if (!data.condition) newErrors.condition = "Condition is required.";
    }

    if (stepIndex === 2) {
      if (!data.coaFront) newErrors.coaFront = "COA front photo is required.";
      if (!data.coaBack) newErrors.coaBack = "COA back photo is required.";
      if (!data.coaSource) newErrors.coaSource = "Authentication source is required.";
      if (!data.coaCertificateNumber.trim()) {
        newErrors.coaCertificateNumber = "Certificate number is required.";
      }
    }

    if (stepIndex === 3) {
      const price = parseFloat(data.price);
      if (!data.price || isNaN(price) || price <= 0) {
        newErrors.price = "Enter a valid price greater than $0.";
      }
      if (data.acceptOffers && data.minimumOffer) {
        const min = parseFloat(data.minimumOffer);
        if (isNaN(min) || min <= 0) {
          newErrors.minimumOffer = "Enter a valid minimum offer.";
        } else if (min >= price) {
          newErrors.minimumOffer = "Minimum offer must be less than asking price.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
    }
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function buildPayload(
    status: "draft" | "pending_verification"
  ): Omit<Database["public"]["Tables"]["listings"]["Insert"], "seller_id"> {
    const priceInCents = Math.round(parseFloat(data.price || "0") * 100);
    const allImages = [data.mainPhoto, ...data.additionalPhotos].filter(Boolean);

    return {
      title: data.title.trim(),
      description: data.description.trim(),
      sport: data.sport,
      category: data.category,
      player: data.player.trim(),
      team: data.team.trim(),
      year: data.year || null,
      condition: data.condition,
      price: priceInCents,
      accept_offers: data.acceptOffers,
      minimum_offer: data.minimumOffer
        ? Math.round(parseFloat(data.minimumOffer) * 100)
        : null,
      images: allImages,
      signature_photo: data.signaturePhoto || null,
      coa_front: data.coaFront || null,
      coa_back: data.coaBack || null,
      coa_hologram: data.coaHologram || null,
      coa_source: data.coaSource || null,
      coa_certificate_number: data.coaCertificateNumber.trim() || null,
      status,
    };
  }

  async function handleSaveDraft() {
    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const payload = buildPayload("draft");
      const { error } = await supabase.from("listings").insert({
        ...payload,
        seller_id: user.id,
      });

      if (error) {
        alert(`Failed to save draft: ${error.message}`);
      } else {
        router.push("/dashboard/listings");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    // Validate all steps before submitting
    for (let i = 0; i < STEP_LABELS.length - 1; i++) {
      if (!validateStep(i)) {
        setStep(i);
        return;
      }
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const payload = buildPayload("pending_verification");
      const { error } = await supabase.from("listings").insert({
        ...payload,
        seller_id: user.id,
      });

      if (error) {
        alert(`Failed to submit listing: ${error.message}`);
      } else {
        router.push("/dashboard/listings");
      }
    } finally {
      setSubmitting(false);
    }
  }

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
                  onClick={() => {
                    // Allow jumping back, but validate before jumping forward
                    if (i < step) setStep(i);
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    i === step
                      ? "bg-brand-amber text-brand-dark"
                      : i < step
                        ? "bg-green-600 text-white"
                        : "bg-white/5 text-gray-500"
                  }`}
                >
                  {i < step ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </button>
                <span
                  className={`ml-2 hidden text-sm sm:inline ${
                    i === step ? "font-medium text-brand-amber" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <div
                    className={`mx-3 h-px w-8 sm:w-12 ${
                      i < step ? "bg-green-600" : "bg-white/[0.07]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="rounded-lg border border-white/[0.07] bg-brand-card p-6">
          {step === 0 && (
            <StepPhotos data={data} onChange={updateData} errors={errors} />
          )}
          {step === 1 && (
            <StepDetails data={data} onChange={updateData} errors={errors} />
          )}
          {step === 2 && (
            <StepCoa data={data} onChange={updateData} errors={errors} />
          )}
          {step === 3 && (
            <StepPricing data={data} onChange={updateData} errors={errors} />
          )}
          {step === 4 && <StepReview data={data} />}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-md border border-white/[0.07] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className="rounded-md border border-white/[0.07] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>

            {step < STEP_LABELS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-md bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit for Verification"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
