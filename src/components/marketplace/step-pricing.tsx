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
  return `$${(cents / 100).toFixed(2)}`;
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
        <h2 className="text-lg font-semibold">Pricing</h2>
        <p className="text-sm text-gray-600 mt-1">
          Set your asking price. All prices are in USD.
        </p>
      </div>

      <div className="max-w-sm">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Asking Price (USD) <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            id="price"
            type="number"
            step="0.01"
            min="1"
            value={data.price}
            onChange={(e) => onChange({ price: e.target.value })}
            placeholder="0.00"
            className="block w-full rounded-md border border-gray-300 pl-7 pr-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
      </div>

      <div className="max-w-sm space-y-3">
        <div className="flex items-center gap-3">
          <input
            id="acceptOffers"
            type="checkbox"
            checked={data.acceptOffers}
            onChange={(e) => onChange({ acceptOffers: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="acceptOffers" className="text-sm font-medium text-gray-700">
            Accept offers from buyers
          </label>
        </div>

        {data.acceptOffers && (
          <div>
            <label htmlFor="minimumOffer" className="block text-sm font-medium text-gray-700">
              Minimum Offer (optional)
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="minimumOffer"
                type="number"
                step="0.01"
                min="1"
                value={data.minimumOffer}
                onChange={(e) => onChange({ minimumOffer: e.target.value })}
                placeholder="0.00"
                className="block w-full rounded-md border border-gray-300 pl-7 pr-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            {errors.minimumOffer && (
              <p className="mt-1 text-xs text-red-600">{errors.minimumOffer}</p>
            )}
          </div>
        )}
      </div>

      {isValidPrice && (
        <div className="max-w-sm rounded-lg border bg-gray-50 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">Fee Breakdown</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Asking price</span>
              <span>{formatCents(priceInCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Platform commission ({(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}%)
              </span>
              <span className="text-red-600">-{formatCents(commission)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Payment processing ({(STRIPE_PROCESSING_RATE * 100).toFixed(1)}% + $0.30)
              </span>
              <span className="text-red-600">-{formatCents(stripeProcessing)}</span>
            </div>
            <hr className="my-1" />
            <div className="flex justify-between font-semibold">
              <span>Your payout</span>
              <span className="text-green-700">{formatCents(sellerPayout)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
