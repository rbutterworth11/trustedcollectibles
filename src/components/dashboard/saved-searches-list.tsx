"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface SavedSearch {
  id: string;
  name: string;
  filters: Record<string, string>;
  notify: boolean;
  created_at: string;
}

export default function SavedSearchesList({ searches }: { searches: SavedSearch[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    await fetch("/api/saved-searches", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchId: id }),
    });
    router.refresh();
  }

  function buildUrl(filters: Record<string, string>) {
    const params = new URLSearchParams(filters);
    return `/marketplace?${params.toString()}`;
  }

  if (searches.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/[0.07] p-12 text-center">
        <p className="text-sm text-gray-500">No saved searches yet.</p>
        <Link href="/marketplace" className="mt-2 inline-block text-sm font-medium text-brand-amber hover:text-brand-amber-hover">
          Browse the marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {searches.map((search) => (
        <div key={search.id} className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-brand-card p-4">
          <div>
            <Link href={buildUrl(search.filters)} className="font-medium text-white hover:text-brand-amber">
              {search.name}
            </Link>
            <p className="text-xs text-gray-500 mt-0.5">
              {Object.entries(search.filters).map(([k, v]) => `${k}: ${v}`).join(" · ") || "All items"}
            </p>
          </div>
          <button
            onClick={() => handleDelete(search.id)}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
