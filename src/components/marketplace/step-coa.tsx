"use client";

import ImageUpload from "@/components/ui/image-upload";
import type { ListingFormData } from "@/types";
import { COA_SOURCES } from "@/lib/constants";

interface StepCoaProps {
  data: ListingFormData;
  onChange: (updates: Partial<ListingFormData>) => void;
  errors: Record<string, string>;
}

export default function StepCoa({ data, onChange, errors }: StepCoaProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Certificate of Authenticity</h2>
        <p className="text-sm text-gray-400 mt-1">
          Upload photos of your COA. This is critical for our verification
          process and builds buyer confidence.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <ImageUpload
            label="COA Front"
            value={data.coaFront}
            folder="coa"
            required
            onChange={(url) => onChange({ coaFront: url })}
          />
          {errors.coaFront && (
            <p className="mt-1 text-xs text-red-400">{errors.coaFront}</p>
          )}
        </div>

        <div>
          <ImageUpload
            label="COA Back"
            value={data.coaBack}
            folder="coa"
            required
            onChange={(url) => onChange({ coaBack: url })}
          />
          {errors.coaBack && (
            <p className="mt-1 text-xs text-red-400">{errors.coaBack}</p>
          )}
        </div>
      </div>

      <div className="max-w-[200px]">
        <ImageUpload
          label="Hologram Sticker"
          value={data.coaHologram}
          folder="coa"
          onChange={(url) => onChange({ coaHologram: url })}
        />
        <p className="mt-1 text-xs text-gray-500">Optional — if your COA has one</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="coaSource" className="block text-sm font-medium text-gray-300">
            Authentication Source <span className="text-red-500">*</span>
          </label>
          <select
            id="coaSource"
            value={data.coaSource}
            onChange={(e) => onChange({ coaSource: e.target.value })}
            className="mt-1 block w-full rounded-md border border-white/[0.07] bg-brand-card px-3 py-2 text-sm text-white shadow-sm focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber"
          >
            <option value="">Select source</option>
            {COA_SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.coaSource && <p className="mt-1 text-xs text-red-400">{errors.coaSource}</p>}
        </div>

        <div>
          <label htmlFor="coaCertificateNumber" className="block text-sm font-medium text-gray-300">
            Certificate Number <span className="text-red-500">*</span>
          </label>
          <input
            id="coaCertificateNumber"
            type="text"
            value={data.coaCertificateNumber}
            onChange={(e) => onChange({ coaCertificateNumber: e.target.value })}
            placeholder="e.g. AB12345"
            className="mt-1 block w-full rounded-md border border-white/[0.07] bg-brand-card px-3 py-2 text-sm text-white placeholder:text-gray-500 shadow-sm focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber"
          />
          {errors.coaCertificateNumber && (
            <p className="mt-1 text-xs text-red-400">{errors.coaCertificateNumber}</p>
          )}
        </div>
      </div>
    </div>
  );
}
