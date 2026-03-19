"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AuthRequest {
  id: string;
  user_id: string;
  tier: "standard" | "premium";
  status: string;
  sport: string;
  item_type: string;
  details: string | null;
  item_photos: string[];
  coa_photos: string[];
  verdict: string | null;
  reviewer_notes: string | null;
  amount: number;
  created_at: string;
  user: { full_name: string; email: string } | null;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending_payment: { label: "Awaiting Payment", color: "bg-gray-800 text-gray-400" },
  paid: { label: "Paid — Ready for Review", color: "bg-yellow-900/40 text-yellow-400" },
  in_review: { label: "Under Review", color: "bg-blue-900/40 text-blue-400" },
  completed: { label: "Completed", color: "bg-green-900/40 text-green-400" },
};

export default function AdminAuthReview({ requests }: { requests: AuthRequest[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [verdict, setVerdict] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const counts: Record<string, number> = {};
  requests.forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1; });

  function openReview(req: AuthRequest) {
    setExpandedId(req.id);
    setVerdict(req.verdict || "");
    setNotes(req.reviewer_notes || "");
  }

  async function submitVerdict(requestId: string) {
    if (!verdict) return;
    setSaving(true);
    const res = await fetch("/api/admin/auth-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, verdict, notes }),
    });
    if (res.ok) {
      setExpandedId(null);
      router.refresh();
    }
    setSaving(false);
  }

  async function markInReview(requestId: string) {
    await fetch("/api/admin/auth-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, status: "in_review" }),
    });
    router.refresh();
  }

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setFilter("all")} className={`rounded-full px-3 py-1 text-xs font-medium ${filter === "all" ? "bg-brand-amber text-brand-dark" : "bg-white/[0.07] text-gray-400 hover:bg-white/10"}`}>
          All ({requests.length})
        </button>
        {Object.entries(counts).map(([status, count]) => (
          <button key={status} onClick={() => setFilter(status)} className={`rounded-full px-3 py-1 text-xs font-medium ${filter === status ? "bg-brand-amber text-brand-dark" : "bg-white/[0.07] text-gray-400 hover:bg-white/10"}`}>
            {statusConfig[status]?.label ?? status} ({count})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500 mt-6">No requests found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => {
            const config = statusConfig[req.status] ?? { label: req.status, color: "bg-gray-800 text-gray-400" };
            const isExpanded = expandedId === req.id;
            return (
              <div key={req.id} className="rounded-lg border border-white/[0.07] bg-brand-card overflow-hidden">
                {/* Summary row */}
                <button onClick={() => isExpanded ? setExpandedId(null) : openReview(req)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.03]">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{req.sport} — {req.item_type}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}>{config.label}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${req.tier === "premium" ? "bg-brand-amber/20 text-brand-amber" : "bg-white/[0.07] text-gray-400"}`}>
                        {req.tier === "premium" ? "Premium" : "Standard"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {(req.user as any)?.full_name || (req.user as any)?.email || "User"} · {new Date(req.created_at).toLocaleDateString()} · £{(req.amount / 100).toFixed(2)}
                    </p>
                  </div>
                  <svg className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded review panel */}
                {isExpanded && (
                  <div className="border-t border-white/[0.07] p-4 space-y-4">
                    {/* Photos */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-gray-400 mb-2">Item Photos</h3>
                      <div className="flex gap-2 flex-wrap">
                        {req.item_photos.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="relative h-24 w-24 rounded-md overflow-hidden bg-white/5 hover:ring-2 hover:ring-brand-amber">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Item ${i+1}`} className="h-full w-full object-cover" />
                          </a>
                        ))}
                      </div>
                    </div>
                    {req.coa_photos.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-400 mb-2">COA Photos</h3>
                        <div className="flex gap-2 flex-wrap">
                          {req.coa_photos.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="relative h-24 w-24 rounded-md overflow-hidden bg-white/5 hover:ring-2 hover:ring-brand-amber">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt={`COA ${i+1}`} className="h-full w-full object-cover" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    {req.details && (
                      <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-400 mb-1">Details</h3>
                        <p className="text-sm text-gray-300">{req.details}</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    {req.status === "paid" && (
                      <button onClick={() => markInReview(req.id)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Start Review
                      </button>
                    )}

                    {/* Verdict form */}
                    {(req.status === "in_review" || req.status === "paid") && (
                      <div className="border-t border-white/[0.07] pt-4 space-y-3">
                        <h3 className="text-sm font-semibold text-white">Submit Verdict</h3>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Verdict</label>
                          <select value={verdict} onChange={(e) => setVerdict(e.target.value)} className="w-full rounded-md border border-white/[0.07] bg-brand-dark px-3 py-2 text-sm text-white focus:border-brand-amber focus:ring-brand-amber">
                            <option value="">Select verdict...</option>
                            <option value="authentic">Authentic</option>
                            <option value="likely_authentic">Likely Authentic</option>
                            <option value="inconclusive">Inconclusive</option>
                            <option value="likely_not_authentic">Likely Not Authentic</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Notes / Assessment</label>
                          <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-md border border-white/[0.07] bg-brand-dark px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-amber focus:ring-brand-amber" placeholder="Provide your expert assessment..." />
                        </div>
                        <button onClick={() => submitVerdict(req.id)} disabled={!verdict || saving} className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">
                          {saving ? "Submitting..." : "Submit Verdict"}
                        </button>
                      </div>
                    )}

                    {/* Show existing verdict */}
                    {req.status === "completed" && req.verdict && (
                      <div className="border-t border-white/[0.07] pt-4">
                        <p className="text-sm"><span className="text-gray-400">Verdict:</span> <span className="font-bold text-white">{req.verdict.replace(/_/g, " ")}</span></p>
                        {req.reviewer_notes && <p className="text-sm text-gray-400 mt-1">{req.reviewer_notes}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
