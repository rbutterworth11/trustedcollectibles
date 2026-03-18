"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type CurrencyCode = "GBP" | "USD" | "EUR";

interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // rate FROM GBP, e.g. 1 GBP = 1.27 USD
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  GBP: { code: "GBP", symbol: "£", rate: 1 },
  USD: { code: "USD", symbol: "$", rate: 1.27 },
  EUR: { code: "EUR", symbol: "€", rate: 1.17 },
};

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (penceGBP: number) => string;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "GBP",
  setCurrency: () => {},
  formatPrice: (pence) => `£${(pence / 100).toFixed(2)}`,
  symbol: "£",
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("GBP");

  // Read from cookie on mount
  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )tc_currency=([^;]*)/);
    if (match) {
      const val = match[1] as CurrencyCode;
      if (CURRENCIES[val]) setCurrencyState(val);
    }
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    document.cookie = `tc_currency=${code};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
  }, []);

  const formatPrice = useCallback(
    (penceGBP: number) => {
      const config = CURRENCIES[currency];
      const converted = (penceGBP / 100) * config.rate;
      return `${config.symbol}${converted.toFixed(2)}`;
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, formatPrice, symbol: CURRENCIES[currency].symbol }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

// Re-export server-safe formatter for backwards compatibility
export { formatPriceGBP } from "@/lib/format-price";
