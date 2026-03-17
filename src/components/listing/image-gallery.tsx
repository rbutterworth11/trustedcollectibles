"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (!images.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100 text-gray-400">
        No images
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[selected]}
          alt={`${title} - image ${selected + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                i === selected ? "border-black" : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={src}
                alt={`${title} - thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
