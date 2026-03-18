"use client";

import { useState, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SiteContent {
  key: string;
  value: Record<string, unknown>;
  enabled: boolean;
  sort_order: number;
  updated_at: string;
}

interface Listing {
  id: string;
  title: string;
  player: string | null;
  sport: string | null;
  price: number;
  images: string[] | null;
}

interface StaffPick {
  id: string;
  listing_id: string;
  sort_order: number;
  listing: Listing;
}

interface Props {
  sections: SiteContent[];
  staffPicks: StaffPick[];
  allListings: Listing[];
}

/* ------------------------------------------------------------------ */
/*  Section labels (display order)                                     */
/* ------------------------------------------------------------------ */

const SECTION_ORDER = [
  { key: "hero", label: "Hero" },
  { key: "trust_bar", label: "Trust Bar" },
  { key: "new_arrivals", label: "New Arrivals" },
  { key: "staff_picks_section", label: "Staff Picks" },
  { key: "featured_collections", label: "Featured Collections" },
  { key: "cta_section", label: "CTA Section" },
];

/* ------------------------------------------------------------------ */
/*  Shared UI helpers                                                  */
/* ------------------------------------------------------------------ */

const inputCls =
  "bg-brand-dark border border-white/[0.07] text-white placeholder:text-gray-500 focus:border-brand-amber focus:ring-brand-amber rounded-md px-3 py-2 text-sm w-full";
const labelCls = "text-xs font-medium text-gray-400 mb-1 block";
const btnSave =
  "bg-brand-amber text-brand-dark font-semibold hover:bg-brand-amber-hover rounded-md px-4 py-2 text-sm";
const btnDanger =
  "bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-md px-3 py-1.5 text-xs font-medium";
const btnSecondary =
  "bg-white/5 text-gray-300 hover:bg-white/10 rounded-md px-3 py-1.5 text-xs font-medium";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-brand-amber" : "bg-gray-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function StatusMsg({ msg }: { msg: { type: "ok" | "err"; text: string } | null }) {
  if (!msg) return null;
  return (
    <p
      className={`text-xs mt-2 ${
        msg.type === "ok" ? "text-green-400" : "text-red-400"
      }`}
    >
      {msg.text}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function ContentEditor({ sections, staffPicks, allListings }: Props) {
  // Build a map of section data keyed by section key
  const buildMap = useCallback(() => {
    const m: Record<string, SiteContent> = {};
    for (const s of sections) m[s.key] = s;
    return m;
  }, [sections]);

  const [sectionMap, setSectionMap] = useState<Record<string, SiteContent>>(buildMap);
  const [picks, setPicks] = useState<StaffPick[]>(staffPicks);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [msgs, setMsgs] = useState<Record<string, { type: "ok" | "err"; text: string }>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  /* helpers */
  const toggle = (key: string) =>
    setExpanded((p) => ({ ...p, [key]: !p[key] }));

  const updateSection = (key: string, patch: Partial<SiteContent>) =>
    setSectionMap((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));

  const updateValue = (key: string, field: string, val: unknown) =>
    setSectionMap((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: { ...(prev[key]?.value ?? {}), [field]: val },
      },
    }));

  /* save content section */
  const saveSection = async (key: string) => {
    const s = sectionMap[key];
    if (!s) return;
    setSaving((p) => ({ ...p, [key]: true }));
    setMsgs((p) => ({ ...p, [key]: undefined as never }));
    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          value: s.value,
          enabled: s.enabled,
          sort_order: s.sort_order,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMsgs((p) => ({ ...p, [key]: { type: "ok", text: "Saved!" } }));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Save failed";
      setMsgs((p) => ({ ...p, [key]: { type: "err", text: message } }));
    } finally {
      setSaving((p) => ({ ...p, [key]: false }));
    }
  };

  /* save staff picks */
  const saveStaffPicks = async () => {
    const key = "staff_picks_section";
    setSaving((p) => ({ ...p, [key]: true }));
    setMsgs((p) => ({ ...p, [key]: undefined as never }));
    try {
      // Save both the section content AND the picks list
      const [res1, res2] = await Promise.all([
        fetch("/api/admin/content", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key,
            value: sectionMap[key]?.value,
            enabled: sectionMap[key]?.enabled,
            sort_order: sectionMap[key]?.sort_order,
          }),
        }),
        fetch("/api/admin/staff-picks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listingIds: picks.map((p) => p.listing_id),
          }),
        }),
      ]);
      if (!res1.ok) throw new Error(await res1.text());
      if (!res2.ok) throw new Error(await res2.text());
      setMsgs((p) => ({ ...p, [key]: { type: "ok", text: "Saved!" } }));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Save failed";
      setMsgs((p) => ({ ...p, [key]: { type: "err", text: message } }));
    } finally {
      setSaving((p) => ({ ...p, [key]: false }));
    }
  };

  /* staff picks helpers */
  const removePick = (listingId: string) =>
    setPicks((prev) => prev.filter((p) => p.listing_id !== listingId));

  const addPick = (listingId: string) => {
    const listing = allListings.find((l) => l.id === listingId);
    if (!listing) return;
    setPicks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        listing_id: listingId,
        sort_order: prev.length,
        listing,
      },
    ]);
  };

  const movePick = (idx: number, dir: -1 | 1) => {
    setPicks((prev) => {
      const next = [...prev];
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= next.length) return prev;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next.map((p, i) => ({ ...p, sort_order: i }));
    });
  };

  const pickedIds = new Set(picks.map((p) => p.listing_id));
  const availableListings = allListings.filter((l) => !pickedIds.has(l.id));

  /* ---------------------------------------------------------------- */
  /*  Section form renderers                                           */
  /* ---------------------------------------------------------------- */

  const val = (key: string) => (sectionMap[key]?.value ?? {}) as Record<string, unknown>;

  function renderHero() {
    const v = val("hero");
    return (
      <div className="space-y-3">
        <div>
          <label className={labelCls}>Title</label>
          <textarea rows={2} className={inputCls} value={(v.title as string) ?? ""} onChange={(e) => updateValue("hero", "title", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Subtitle</label>
          <textarea rows={3} className={inputCls} value={(v.subtitle as string) ?? ""} onChange={(e) => updateValue("hero", "subtitle", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>CTA Text</label>
            <input className={inputCls} value={(v.cta_text as string) ?? ""} onChange={(e) => updateValue("hero", "cta_text", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>CTA Link</label>
            <input className={inputCls} value={(v.cta_link as string) ?? ""} onChange={(e) => updateValue("hero", "cta_link", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Secondary CTA Text</label>
            <input className={inputCls} value={(v.secondary_cta_text as string) ?? ""} onChange={(e) => updateValue("hero", "secondary_cta_text", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Secondary CTA Link</label>
            <input className={inputCls} value={(v.secondary_cta_link as string) ?? ""} onChange={(e) => updateValue("hero", "secondary_cta_link", e.target.value)} />
          </div>
        </div>
      </div>
    );
  }

  function renderTrustBar() {
    const v = val("trust_bar");
    const items = (v.items as Array<{ icon: string; title: string; subtitle: string }>) ?? [];
    const setItems = (next: typeof items) => updateValue("trust_bar", "items", next);

    return (
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 bg-brand-dark border border-white/[0.07] rounded-md p-3">
            <div className="flex-1 grid grid-cols-3 gap-2">
              <div>
                <label className={labelCls}>Icon</label>
                <select
                  className={inputCls}
                  value={item.icon}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], icon: e.target.value };
                    setItems(next);
                  }}
                >
                  <option value="shield">Shield</option>
                  <option value="lock">Lock</option>
                  <option value="card">Card</option>
                  <option value="star">Star</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Title</label>
                <input
                  className={inputCls}
                  value={item.title}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], title: e.target.value };
                    setItems(next);
                  }}
                />
              </div>
              <div>
                <label className={labelCls}>Subtitle</label>
                <input
                  className={inputCls}
                  value={item.subtitle}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], subtitle: e.target.value };
                    setItems(next);
                  }}
                />
              </div>
            </div>
            <button type="button" className={btnDanger} onClick={() => setItems(items.filter((_, j) => j !== i))}>
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className={btnSecondary}
          onClick={() => setItems([...items, { icon: "shield", title: "", subtitle: "" }])}
        >
          + Add Item
        </button>
      </div>
    );
  }

  function renderNewArrivals() {
    const v = val("new_arrivals");
    return (
      <div className="space-y-3">
        <div>
          <label className={labelCls}>Title</label>
          <input className={inputCls} value={(v.title as string) ?? ""} onChange={(e) => updateValue("new_arrivals", "title", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Subtitle</label>
          <input className={inputCls} value={(v.subtitle as string) ?? ""} onChange={(e) => updateValue("new_arrivals", "subtitle", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Count</label>
          <input type="number" className={inputCls + " !w-24"} value={(v.count as number) ?? 8} onChange={(e) => updateValue("new_arrivals", "count", parseInt(e.target.value) || 0)} />
        </div>
      </div>
    );
  }

  function renderStaffPicks() {
    const v = val("staff_picks_section");
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Title</label>
            <input className={inputCls} value={(v.title as string) ?? ""} onChange={(e) => updateValue("staff_picks_section", "title", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Subtitle</label>
            <input className={inputCls} value={(v.subtitle as string) ?? ""} onChange={(e) => updateValue("staff_picks_section", "subtitle", e.target.value)} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Selected Listings</label>
          <div className="space-y-2">
            {picks.map((pick, idx) => (
              <div key={pick.listing_id} className="flex items-center gap-3 bg-brand-dark border border-white/[0.07] rounded-md p-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-white text-xs leading-none"
                    onClick={() => movePick(idx, -1)}
                    disabled={idx === 0}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-white text-xs leading-none"
                    onClick={() => movePick(idx, 1)}
                    disabled={idx === picks.length - 1}
                  >
                    ▼
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{pick.listing.title}</p>
                  <p className="text-xs text-gray-400">
                    {pick.listing.player} &middot; {pick.listing.sport} &middot; ${pick.listing.price}
                  </p>
                </div>
                <button type="button" className={btnDanger} onClick={() => removePick(pick.listing_id)}>
                  Remove
                </button>
              </div>
            ))}
            {picks.length === 0 && (
              <p className="text-xs text-gray-500">No staff picks selected.</p>
            )}
          </div>
        </div>

        <div>
          <label className={labelCls}>Add Listing</label>
          <select
            className={inputCls}
            value=""
            onChange={(e) => {
              if (e.target.value) addPick(e.target.value);
            }}
          >
            <option value="">Select a listing to add...</option>
            {availableListings.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title} — {l.player} (${l.price})
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  function renderFeaturedCollections() {
    const v = val("featured_collections");
    const items = (v.items as Array<{ name: string; description: string; category: string; gradient: string }>) ?? [];
    const setItems = (next: typeof items) => updateValue("featured_collections", "items", next);

    return (
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-brand-dark border border-white/[0.07] rounded-md p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelCls}>Name</label>
                <input
                  className={inputCls}
                  value={item.name}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], name: e.target.value };
                    setItems(next);
                  }}
                />
              </div>
              <div>
                <label className={labelCls}>Category Filter</label>
                <input
                  className={inputCls}
                  placeholder="e.g. Signed Jersey"
                  value={item.category}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], category: e.target.value };
                    setItems(next);
                  }}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                rows={2}
                className={inputCls}
                value={item.description}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], description: e.target.value };
                  setItems(next);
                }}
              />
            </div>
            <div>
              <label className={labelCls}>Gradient Classes</label>
              <input
                className={inputCls}
                placeholder="e.g. from-blue-950 to-blue-800"
                value={item.gradient}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], gradient: e.target.value };
                  setItems(next);
                }}
              />
            </div>
            <div className="flex justify-end">
              <button type="button" className={btnDanger} onClick={() => setItems(items.filter((_, j) => j !== i))}>
                Remove Collection
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className={btnSecondary}
          onClick={() => setItems([...items, { name: "", description: "", category: "", gradient: "from-blue-950 to-blue-800" }])}
        >
          + Add Collection
        </button>
      </div>
    );
  }

  function renderCTA() {
    const v = val("cta_section");
    return (
      <div className="space-y-3">
        <div>
          <label className={labelCls}>Title</label>
          <input className={inputCls} value={(v.title as string) ?? ""} onChange={(e) => updateValue("cta_section", "title", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Subtitle</label>
          <textarea rows={2} className={inputCls} value={(v.subtitle as string) ?? ""} onChange={(e) => updateValue("cta_section", "subtitle", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>CTA Text</label>
            <input className={inputCls} value={(v.cta_text as string) ?? ""} onChange={(e) => updateValue("cta_section", "cta_text", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>CTA Link</label>
            <input className={inputCls} value={(v.cta_link as string) ?? ""} onChange={(e) => updateValue("cta_section", "cta_link", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Secondary CTA Text</label>
            <input className={inputCls} value={(v.secondary_cta_text as string) ?? ""} onChange={(e) => updateValue("cta_section", "secondary_cta_text", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Secondary CTA Link</label>
            <input className={inputCls} value={(v.secondary_cta_link as string) ?? ""} onChange={(e) => updateValue("cta_section", "secondary_cta_link", e.target.value)} />
          </div>
        </div>
      </div>
    );
  }

  const formRenderers: Record<string, () => React.ReactNode> = {
    hero: renderHero,
    trust_bar: renderTrustBar,
    new_arrivals: renderNewArrivals,
    staff_picks_section: renderStaffPicks,
    featured_collections: renderFeaturedCollections,
    cta_section: renderCTA,
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-4">
      {SECTION_ORDER.map(({ key, label }) => {
        const section = sectionMap[key];
        const isOpen = expanded[key] ?? false;
        const isSaving = saving[key] ?? false;

        return (
          <div
            key={key}
            className="bg-brand-card border border-white/[0.07] rounded-lg p-5 mb-4"
          >
            {/* Header row */}
            <div className="flex items-center gap-4">
              <Toggle
                checked={section?.enabled ?? false}
                onChange={(v) => updateSection(key, { enabled: v })}
              />
              <span className="font-semibold text-white flex-1">{label}</span>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400">Order</label>
                <input
                  type="number"
                  className="bg-brand-dark border border-white/[0.07] text-white rounded-md px-2 py-1 text-xs w-16 text-center"
                  value={section?.sort_order ?? 0}
                  onChange={(e) =>
                    updateSection(key, {
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-white text-sm font-medium"
                onClick={() => toggle(key)}
              >
                {isOpen ? "Collapse" : "Expand"}
              </button>
            </div>

            {/* Expandable form */}
            {isOpen && (
              <div className="mt-4 pt-4 border-t border-white/[0.07]">
                {formRenderers[key]?.()}
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    className={btnSave}
                    disabled={isSaving}
                    onClick={() =>
                      key === "staff_picks_section"
                        ? saveStaffPicks()
                        : saveSection(key)
                    }
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <StatusMsg msg={msgs[key] ?? null} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
