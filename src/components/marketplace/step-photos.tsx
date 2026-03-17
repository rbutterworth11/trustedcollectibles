"use client";

import ImageUpload from "@/components/ui/image-upload";
import type { ListingFormData } from "@/types";

interface StepPhotosProps {
  data: ListingFormData;
  onChange: (updates: Partial<ListingFormData>) => void;
  errors: Record<string, string>;
}

export default function StepPhotos({ data, onChange, errors }: StepPhotosProps) {
  function updateAdditionalPhoto(index: number, url: string) {
    const photos = [...data.additionalPhotos];
    if (url) {
      photos[index] = url;
    } else {
      photos.splice(index, 1);
    }
    onChange({ additionalPhotos: photos });
  }

  // Always show enough slots for uploading (up to 3)
  const additionalSlots = Math.min(3, Math.max(data.additionalPhotos.length + 1, 1));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Photos</h2>
        <p className="text-sm text-gray-600 mt-1">
          Upload clear, well-lit photos. The main photo and a close-up of the
          signature are required.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <ImageUpload
            label="Main Photo"
            value={data.mainPhoto}
            folder="items"
            required
            onChange={(url) => onChange({ mainPhoto: url })}
          />
          {errors.mainPhoto && (
            <p className="mt-1 text-xs text-red-600">{errors.mainPhoto}</p>
          )}
        </div>

        <div>
          <ImageUpload
            label="Signature Close-Up"
            value={data.signaturePhoto}
            folder="items"
            required
            onChange={(url) => onChange({ signaturePhoto: url })}
          />
          {errors.signaturePhoto && (
            <p className="mt-1 text-xs text-red-600">{errors.signaturePhoto}</p>
          )}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">
          Additional Photos <span className="text-gray-400">(up to 3)</span>
        </p>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: additionalSlots }).map((_, i) => (
            <ImageUpload
              key={i}
              label={`Photo ${i + 1}`}
              value={data.additionalPhotos[i] || ""}
              folder="items"
              onChange={(url) => updateAdditionalPhoto(i, url)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
