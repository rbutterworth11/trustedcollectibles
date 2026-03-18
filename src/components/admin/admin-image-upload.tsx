"use client";

import Image from "next/image";
import { useState, useRef } from "react";

interface AdminImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
  aspectRatio?: string;
}

export default function AdminImageUpload({
  value,
  onChange,
  folder,
  label = "Image",
  aspectRatio = "aspect-video",
}: AdminImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const { url } = await res.json();
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="text-xs font-medium text-gray-400 mb-1 block">
        {label}
      </label>

      {value ? (
        <div className="space-y-2">
          <div
            className={`relative ${aspectRatio} w-full overflow-hidden rounded-lg border border-white/[0.07] bg-white/5`}
          >
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="bg-white/5 text-gray-300 hover:bg-white/10 rounded-md px-3 py-1.5 text-xs font-medium disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Replace"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-md px-3 py-1.5 text-xs font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`flex ${aspectRatio} w-full items-center justify-center rounded-lg border-2 border-dashed border-white/[0.07] bg-brand-dark text-gray-500 transition-colors hover:border-brand-amber/30 hover:text-gray-400 disabled:opacity-50`}
        >
          {uploading ? (
            <span className="text-sm">Uploading...</span>
          ) : (
            <div className="text-center">
              <svg
                className="mx-auto h-8 w-8 mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs">Click to upload</span>
            </div>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />

      {/* Manual URL input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL..."
        className="mt-2 bg-brand-dark border border-white/[0.07] text-white placeholder:text-gray-500 focus:border-brand-amber focus:ring-brand-amber rounded-md px-3 py-1.5 text-xs w-full"
      />

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
