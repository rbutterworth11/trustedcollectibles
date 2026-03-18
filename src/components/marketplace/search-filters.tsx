"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SPORTS, ITEM_TYPES, CONDITIONS } from "@/lib/constants";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;

const selectClass =
  "block w-full rounded-md border border-white/[0.07] bg-brand-card px-3 py-2 text-sm text-white shadow-sm focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber";

export default function SearchFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q = searchParams.get("q") ?? "";
  const sport = searchParams.get("sport") ?? "";
  const category = searchParams.get("category") ?? "";
  const condition = searchParams.get("condition") ?? "";
  const minPrice = searchParams.get("min_price") ?? "";
  const maxPrice = searchParams.get("max_price") ?? "";
  const sort = searchParams.get("sort") ?? "newest";

  const [searchValue, setSearchValue] = useState(q);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync search input when URL changes externally (e.g. clear all)
  useEffect(() => {
    setSearchValue(q);
  }, [q]);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      // Reset to page 1 on filter change
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateParams({ q: value });
      }, 300);
    },
    [updateParams]
  );

  const activeFilterCount = [sport, category, condition, minPrice, maxPrice, q].filter(Boolean).length +
    (sort !== "newest" ? 1 : 0);

  const clearAll = () => {
    setSearchValue("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by title, player, or team..."
          className="block w-full rounded-md border border-white/[0.07] bg-brand-card pl-10 pr-3 py-2 text-sm text-white placeholder:text-gray-500 shadow-sm focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber"
        />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-40">
          <label className="block text-xs font-medium text-gray-400 mb-1">Sport</label>
          <select
            value={sport}
            onChange={(e) => updateParams({ sport: e.target.value })}
            className={selectClass}
          >
            <option value="">All Sports</option>
            {SPORTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="w-44">
          <label className="block text-xs font-medium text-gray-400 mb-1">Item Type</label>
          <select
            value={category}
            onChange={(e) => updateParams({ category: e.target.value })}
            className={selectClass}
          >
            <option value="">All Types</option>
            {ITEM_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="w-36">
          <label className="block text-xs font-medium text-gray-400 mb-1">Condition</label>
          <select
            value={condition}
            onChange={(e) => updateParams({ condition: e.target.value })}
            className={selectClass}
          >
            <option value="">Any Condition</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="w-28">
          <label className="block text-xs font-medium text-gray-400 mb-1">Min Price</label>
          <input
            type="number"
            min="0"
            step="1"
            value={minPrice}
            onChange={(e) => updateParams({ min_price: e.target.value })}
            placeholder="$0"
            className={selectClass}
          />
        </div>

        <div className="w-28">
          <label className="block text-xs font-medium text-gray-400 mb-1">Max Price</label>
          <input
            type="number"
            min="0"
            step="1"
            value={maxPrice}
            onChange={(e) => updateParams({ max_price: e.target.value })}
            placeholder="Any"
            className={selectClass}
          />
        </div>

        <div className="w-44">
          <label className="block text-xs font-medium text-gray-400 mb-1">Sort</label>
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className={selectClass}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-brand-amber hover:text-brand-amber-hover underline underline-offset-2 pb-2"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>
    </div>
  );
}
