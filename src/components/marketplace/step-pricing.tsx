"use client";

import type { ListingFormData } from "@/types";
import {
  PLATFORM_COMMISSION_RATE,
  STRIPE_PROCESSING_RATE,
  STRIPE_FIXED_FEE,
} from "@/lib/constants";

interface StepPricingProps {
  data: ListingFormData;
  onChange: (updates: Partial<ListingFormData>) => void;
  errors: Record<string, string>;
}

function formatCents(cents: number): string {
  return `£${(cents / 100).toFixed(2)}`;
}

export default function StepPricing({ data, onChange, errors }: StepPricingProps) {
  const priceInCents = Math.round(parseFloat(data.price || "0") * 100);
  const isValidPrice = priceInCents > 0;

  const commission = Math.round(priceInCents * PLATFORM_COMMISSION_RATE);
  const stripeProcessing = Math.round(priceInCents * STRIPE_PROCESSING_RATE) + STRIPE_FIXED_FEE;
  const totalFees = commission + stripeProcessing;
  const sellerPayout = priceInCents - totalFees;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Pricing</h2>
        <p className="text-sm text-gray-400 mt-1">
          Set your asking price. All prices are in GBP.
        </p>
      </div>

      <div className="max-w-sm">
        <label htmlFor="price" className="block text-sm font-medium text-gray-300">
          Asking Price (GBP) <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
          <input
            id="price"
            type="number"
            step="0.01"
            min="1"
            value={data.price}
            onChange={(e) => onChange({ price: e.target.value })}
            placeholder="0.00"
            className="block w-full rounded-md border border-white/[0.07] bg-brand-card pl-7 pr-3 py-2 text-sm text-white placeholder:text-gray-500 shadow-sm focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber"
          />
        </div>
        {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price}</p>}
      </div>

      <div className="max-w-sm space-y-3">
        <div className="flex items-center gap-3">
          <input
            id="acceptOffers"
            type="checkbox"
            checked={data.acceptOffers}
            onChange={(e) => onChange({ acceptOffers: e.target.checked })}
            className="h-4 w-4 rounded border-white/[0.07] bg-brand-card"
          />
          <label htmlFor="acceptOffers" className="text-sm font-medium text-gray-300">
            Accept offers from buyers
          </label>
        </div>

        {data.acceptOffers && (
          <div>
            <label htmlFor="minimumOffer" className="block text-sm font-medium text-gray-300">
              Minimum Offer (optional)
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
              <input
                id="minimumOffer"
                type="number"
                step="0.01"
                min="1"
                value={data.minimumOffer}
                onChange={(e) => onChange({ minimumOffer: e.target.value })}
                placeholder="0.00"
                className="block w-full rounded-md border border-white/[0.07] bg-brand-card pl-7 pr-3 py-2 text-sm text-white placeholder:text-gray-500 shadow-sm focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber"
              />
            </div>
            {errors.minimumOffer && (
              <p className="mt-1 text-xs text-red-400">{errors.minimumOffer}</p>
            )}
          </div>
        )}
      </div>

      {isValidPrice && (
        <div className="max-w-sm rounded-lg border border-white/[0.07] bg-brand-dark p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white">Fee Breakdown</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Asking price</span>
              <span className="text-white">{formatCents(priceInCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">
                Platform commission ({(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}%)
              </span>
              <span className="text-red-400">-{formatCents(commission)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">
                Payment processing ({(STRIPE_PROCESSING_RATE * 100).toFixed(1)}% + £0.30)
              </span>
              <span className="text-red-400">-{formatCents(stripeProcessing)}</span>
            </div>
            <hr className="my-1 border-white/[0.07]" />
            <div className="flex justify-between font-semibold">
              <span className="text-white">Your payout</span>
              <span className="text-green-400">{formatCents(sellerPayout)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
