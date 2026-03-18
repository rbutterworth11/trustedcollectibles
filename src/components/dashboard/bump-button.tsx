"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BumpButton({ listingId, lastBumpedAt }: { listingId: string; lastBumpedAt: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const canBump = !lastBumpedAt || (Date.now() - new Date(lastBumpedAt).getTime()) > 24 * 60 * 60 * 1000;

  async function handleBump() {
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/listings/bump", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Bumped! Your listing is now at the top.");
      router.refresh();
    } else {
      setMessage(data.error || "Failed to bump");
    }
    setLoading(false);
  }

  return (
    <div>
      <button
        onClick={handleBump}
        disabled={loading || !canBump}
        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
          canBump
            ? "bg-brand-amber/10 text-brand-amber border border-brand-amber/30 hover:bg-brand-amber/20"
            : "bg-white/5 text-gray-500 border border-white/[0.07]"
        }`}
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        {loading ? "Bumping..." : canBump ? "Bump" : "Bumped today"}
      </button>
      {message && <p className={`text-xs mt-1 ${message.includes("!") ? "text-green-400" : "text-red-400"}`}>{message}</p>}
    </div>
  );
}
