/**
 * Server-safe GBP price formatter.
 * Use this in server components. For client components with
 * currency switching, use useCurrency() from @/lib/currency.
 */
export function formatPriceGBP(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}
