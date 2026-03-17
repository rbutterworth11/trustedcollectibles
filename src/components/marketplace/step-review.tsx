"use client";

import Image from "next/image";
import type { ListingFormData } from "@/types";
import {
  PLATFORM_COMMISSION_RATE,
  STRIPE_PROCESSING_RATE,
  STRIPE_FIXED_FEE,
} from "@/lib/constants";

interface StepReviewProps {
  data: ListingFormData;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function ReviewImage({ src, label }: { src: string; label: string }) {
  if (!src) return null;
  return (
    <div className="relative aspect-square w-24 rounded-md overflow-hidden border">
      <Image src={src} alt={label} fill className="object-cover" />
    </div>
  );
}

export default function StepReview({ data }: StepReviewProps) {
  const priceInCents = Math.round(parseFloat(data.price || "0") * 100);
  const commission = Math.round(priceInCents * PLATFORM_COMMISSION_RATE);
  const stripeProcessing = Math.round(priceInCents * STRIPE_PROCESSING_RATE) + STRIPE_FIXED_FEE;
  const sellerPayout = priceInCents - commission - stripeProcessing;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Review Your Listing</h2>
        <p className="text-sm text-gray-600 mt-1">
          Double-check everything before submitting. After submission, our team
          will verify your item&apos;s authenticity.
        </p>
      </div>

      {/* Photos */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Photos
        </h3>
        <div className="flex gap-3 flex-wrap">
          <ReviewImage src={data.mainPhoto} label="Main" />
          <ReviewImage src={data.signaturePhoto} label="Signature" />
          {data.additionalPhotos.map((url, i) => (
            <ReviewImage key={i} src={url} label={`Additional ${i + 1}`} />
          ))}
        </div>
      </section>

      {/* Item Details */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Item Details
        </h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-500">Title</dt>
            <dd className="font-medium">{data.title}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Sport</dt>
            <dd>{data.sport}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Item Type</dt>
            <dd>{data.category}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Player</dt>
            <dd>{data.player}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Team</dt>
            <dd>{data.team}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Year</dt>
            <dd>{data.year || "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Condition</dt>
            <dd>{data.condition}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-gray-500">Description</dt>
            <dd className="whitespace-pre-wrap">{data.description}</dd>
          </div>
        </dl>
      </section>

      {/* COA */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Certificate of Authenticity
        </h3>
        <div className="flex gap-3 mb-2">
          <ReviewImage src={data.coaFront} label="COA Front" />
          <ReviewImage src={data.coaBack} label="COA Back" />
          {data.coaHologram && <ReviewImage src={data.coaHologram} label="Hologram" />}
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-500">Authentication Source</dt>
            <dd>{data.coaSource}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Certificate Number</dt>
            <dd>{data.coaCertificateNumber}</dd>
          </div>
        </dl>
      </section>

      {/* Pricing */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Pricing
        </h3>
        <div className="rounded-lg border bg-gray-50 p-4 max-w-sm space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Asking price</span>
            <span>{formatCents(priceInCents)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fees</span>
            <span className="text-red-600">
              -{formatCents(commission + stripeProcessing)}
            </span>
          </div>
          <hr className="my-1" />
          <div className="flex justify-between font-semibold">
            <span>Your payout</span>
            <span className="text-green-700">{formatCents(sellerPayout)}</span>
          </div>
          {data.acceptOffers && (
            <p className="text-xs text-gray-500 pt-1">
              Accepting offers
              {data.minimumOffer
                ? ` (minimum $${parseFloat(data.minimumOffer).toFixed(2)})`
                : ""}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
