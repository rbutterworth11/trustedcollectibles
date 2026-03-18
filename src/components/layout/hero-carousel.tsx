"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
}

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden bg-brand-dark text-white">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
        style={{ backgroundImage: `url(${slide.image})` }}
      />
      <div className="absolute inset-0 bg-brand-dark/75" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24 text-center">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white">
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p className="mx-auto mt-3 max-w-xl text-gray-300 text-sm sm:text-base">
            {slide.subtitle}
          </p>
        )}
        {slide.cta_text && slide.cta_link && (
          <Link
            href={slide.cta_link}
            className="mt-6 inline-block rounded-md bg-brand-amber px-6 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover"
          >
            {slide.cta_text}
          </Link>
        )}
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current
                  ? "w-6 bg-brand-amber"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
