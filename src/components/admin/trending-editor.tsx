"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TrendingProfile {
  id?: string;
  name: string;
  image_url: string | null;
  filter_type: "player" | "team";
  sort_order: number;
  enabled: boolean;
}

export default function TrendingEditor({
  profiles: initial,
}: {
  profiles: TrendingProfile[];
}) {
  const router = useRouter();
  const [profiles, setProfiles] = useState<TrendingProfile[]>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function update(index: number, field: keyof TrendingProfile, value: string | boolean) {
    const next = [...profiles];
    (next[index] as unknown as Record<string, unknown>)[field] = value;
    setProfiles(next);
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...profiles];
    const swap = index + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    next.forEach((p, i) => (p.sort_order = i));
    setProfiles(next);
  }

  function add() {
    setProfiles([
      ...profiles,
      { name: "", image_url: null, filter_type: "player", sort_order: profiles.length, enabled: true },
    ]);
  }

  function remove(index: number) {
    setProfiles(profiles.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/trending", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profiles: profiles.map((p, i) => ({ ...p, sort_order: i })) }),
    });
    if (res.ok) {
      setMessage("Saved!");
      router.refresh();
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to save");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        Manage the trending players and teams shown on the homepage. Drag to reorder, upload images, and toggle visibility.
      </p>

      <div className="space-y-2">
        {profiles.map((p, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-lg border bg-brand-card p-3 ${
              p.enabled ? "border-white/[0.07]" : "border-white/[0.04] opacity-60"
            }`}
          >
            {/* Reorder */}
            <div className="flex flex-col gap-0.5">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="text-gray-500 hover:text-white text-xs disabled:opacity-30">▲</button>
              <button onClick={() => move(i, 1)} disabled={i === profiles.length - 1} className="text-gray-500 hover:text-white text-xs disabled:opacity-30">▼</button>
            </div>

            {/* Avatar preview */}
            <div className="h-10 w-10 shrink-0 rounded-full border border-white/[0.07] bg-white/5 overflow-hidden">
              {p.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-500">
                  {p.name ? p.name.split(" ").map((w) => w[0]).join("").slice(0, 2) : "?"}
                </div>
              )}
            </div>

            {/* Name */}
            <input
              type="text"
              value={p.name}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder="Player or team name"
              className="flex-1 min-w-0 rounded-md border border-white/[0.07] bg-brand-dark px-3 py-1.5 text-sm text-white placeholder:text-gray-500 focus:border-brand-amber focus:ring-brand-amber"
            />

            {/* Type */}
            <select
              value={p.filter_type}
              onChange={(e) => update(i, "filter_type", e.target.value)}
              className="rounded-md border border-white/[0.07] bg-brand-dark px-2 py-1.5 text-xs text-white focus:border-brand-amber"
            >
              <option value="player">Player</option>
              <option value="team">Team</option>
            </select>

            {/* Image URL */}
            <input
              type="text"
              value={p.image_url || ""}
              onChange={(e) => update(i, "image_url", e.target.value)}
              placeholder="Image URL"
              className="w-36 hidden sm:block rounded-md border border-white/[0.07] bg-brand-dark px-2 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-brand-amber"
            />

            {/* Upload */}
            <label className="shrink-0 cursor-pointer text-xs text-gray-500 hover:text-brand-amber hidden sm:block">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("folder", "trending");
                  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                  if (res.ok) {
                    const { url } = await res.json();
                    update(i, "image_url", url);
                  }
                }}
              />
            </label>

            {/* Toggle */}
            <button
              onClick={() => update(i, "enabled", !p.enabled)}
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                p.enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}
            >
              {p.enabled ? "ON" : "OFF"}
            </button>

            {/* Delete */}
            <button onClick={() => remove(i)} className="shrink-0 text-red-400 hover:text-red-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button onClick={add} className="rounded-md bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/10">
        + Add Profile
      </button>

      <div className="flex items-center gap-3 pt-4 border-t border-white/[0.07]">
        <button onClick={handleSave} disabled={saving} className="rounded-md bg-brand-amber px-6 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50">
          {saving ? "Saving..." : "Save All"}
        </button>
        {message && <span className={`text-xs ${message === "Saved!" ? "text-green-400" : "text-red-400"}`}>{message}</span>}
      </div>
    </div>
  );
}
