"use client";

import { useCurrency, CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { useState } from "react";

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);

  const options: CurrencyCode[] = ["GBP", "USD", "EUR"];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-md border border-white/[0.07] px-2.5 py-2 text-xs font-medium text-gray-300 transition-colors hover:border-white/20 hover:bg-white/5 min-h-[44px] md:min-h-0"
      >
        <span className="text-brand-amber font-semibold">
          {CURRENCIES[currency].symbol}
        </span>
        {currency}
        <svg
          className={`h-3 w-3 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-32 rounded-lg border border-white/[0.07] bg-brand-card py-1 shadow-xl">
            {options.map((code) => {
              const config = CURRENCIES[code];
              const active = code === currency;
              return (
                <button
                  key={code}
                  onClick={() => {
                    setCurrency(code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-brand-amber/10 text-brand-amber"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="w-5 font-semibold">{config.symbol}</span>
                  <span>{code}</span>
                  {active && (
                    <svg className="ml-auto h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
