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
  "block w-full rounded-md border border-white/[0.07] bg-brand-card px-3 py-2 text-sm text-white shadow-sm focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber min-h-[44px]";

export default function SearchFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filtersOpen, setFiltersOpen] = useState(false);

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
    setFiltersOpen(false);
  };

  // Filter controls shared between desktop and mobile drawer
  const filterControls = (
    <>
      <div className="w-full md:w-40">
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

      <div className="w-full md:w-44">
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

      <div className="w-full md:w-36">
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

      <div className="w-full md:w-28">
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

      <div className="w-full md:w-28">
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

      <div className="w-full md:w-44">
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
    </>
  );

  return (
    <div className="space-y-4">
      {/* Search bar — always visible */}
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
          className="block w-full rounded-md border border-white/[0.07] bg-brand-card pl-10 pr-3 py-2 md:py-2 text-sm text-white placeholder:text-gray-500 shadow-sm focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber min-h-[44px] md:min-h-0"
        />
      </div>

      {/* ===== MOBILE: Filters button + drawer ===== */}
      <div className="md:hidden">
        <button
          onClick={() => setFiltersOpen(true)}
          className="flex min-h-[44px] items-center gap-2 rounded-md border border-white/[0.07] bg-brand-card px-4 py-2 text-sm font-medium text-gray-300 hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-amber px-1.5 text-xs font-bold text-brand-dark">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Mobile filter drawer */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setFiltersOpen(false)}
            />
            {/* Drawer panel — slides up from bottom */}
            <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-brand-card">
              {/* Drawer header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.07] bg-brand-card px-4 py-3 rounded-t-2xl">
                <h2 className="text-base font-semibold text-white">Filters</h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-md text-gray-300 hover:bg-white/5 hover:text-white"
                  aria-label="Close filters"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Filter fields stacked */}
              <div className="flex flex-col gap-4 px-4 py-4">
                {filterControls}
              </div>

              {/* Bottom action buttons */}
              <div className="sticky bottom-0 flex gap-3 border-t border-white/[0.07] bg-brand-card px-4 py-4">
                <button
                  onClick={clearAll}
                  className="flex-1 min-h-[44px] rounded-md border border-white/[0.07] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="flex-1 min-h-[44px] rounded-md bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== DESKTOP: Filters row ===== */}
      <div className="hidden md:flex flex-wrap items-end gap-3">
        {filterControls}

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
