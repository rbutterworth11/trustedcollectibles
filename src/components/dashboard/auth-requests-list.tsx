"use client";

import Link from "next/link";

interface AuthRequest {
  id: string;
  tier: "standard" | "premium";
  status: string;
  sport: string;
  item_type: string;
  verdict: string | null;
  reviewer_notes: string | null;
  amount: number;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending_payment: { label: "Awaiting Payment", color: "bg-gray-800 text-gray-400" },
  paid: { label: "Submitted", color: "bg-yellow-900/40 text-yellow-400" },
  in_review: { label: "Under Review", color: "bg-blue-900/40 text-blue-400" },
  completed: { label: "Completed", color: "bg-green-900/40 text-green-400" },
};

const verdictConfig: Record<string, { label: string; color: string }> = {
  authentic: { label: "Authentic", color: "text-green-400" },
  likely_authentic: { label: "Likely Authentic", color: "text-green-400" },
  inconclusive: { label: "Inconclusive", color: "text-yellow-400" },
  likely_not_authentic: { label: "Likely Not Authentic", color: "text-red-400" },
};

export default function AuthRequestsList({ requests }: { requests: AuthRequest[] }) {
  if (requests.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/[0.07] p-12 text-center">
        <p className="text-sm text-gray-500">No authentication requests yet.</p>
        <Link href="/authenticate" className="mt-2 inline-block text-sm font-medium text-brand-amber hover:text-brand-amber-hover">
          Get an item authenticated
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => {
        const status = statusConfig[req.status] ?? { label: req.status, color: "bg-gray-800 text-gray-400" };
        const verdict = req.verdict ? verdictConfig[req.verdict] : null;
        return (
          <div key={req.id} className="rounded-lg border border-white/[0.07] bg-brand-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-white">{req.sport} — {req.item_type}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>{status.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${req.tier === "premium" ? "bg-brand-amber/20 text-brand-amber" : "bg-white/[0.07] text-gray-400"}`}>
                    {req.tier === "premium" ? "Detailed Report" : "Standard"}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-500">{new Date(req.created_at).toLocaleDateString()}</span>
            </div>
            {verdict && (
              <div className="mt-4 pt-4 border-t border-white/[0.07]">
                <p className="text-sm">
                  Verdict: <span className={`font-bold ${verdict.color}`}>{verdict.label}</span>
                </p>
                {req.reviewer_notes && <p className="mt-2 text-sm text-gray-400">{req.reviewer_notes}</p>}
                {req.tier === "premium" && req.status === "completed" && (
                  <a href={`/api/authenticate/certificate/${req.id}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-brand-amber px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-amber-hover">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Download Certificate
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
