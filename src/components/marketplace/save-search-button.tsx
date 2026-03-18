"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SaveSearchButton() {
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");

  // Build filters object from current search params
  const filters: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    if (key !== "page") filters[key] = value;
  }

  // Don't show if no filters active
  if (Object.keys(filters).length === 0) return null;

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/saved-searches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), filters }),
    });
    if (res.ok) {
      setSaved(true);
      setShowForm(false);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  if (saved) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-green-400">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Search saved!
      </span>
    );
  }

  if (showForm) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name this search..."
          className="rounded-md border border-white/[0.07] bg-brand-dark px-3 py-1.5 text-xs text-white placeholder:text-gray-500 focus:border-brand-amber focus:ring-brand-amber w-40"
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="rounded-md bg-brand-amber px-3 py-1.5 text-xs font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50"
        >
          Save
        </button>
        <button
          onClick={() => setShowForm(false)}
          className="text-xs text-gray-500 hover:text-white"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.07] px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-brand-amber hover:border-brand-amber/30 transition-colors"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      Save Search
    </button>
  );
}
