interface EnhancedAuthBadgeProps {
  verdict: string;
  notes: string | null;
  tier: string;
}

const verdictConfig: Record<string, { label: string; color: string; bg: string }> = {
  authentic: { label: "Authentic", color: "text-green-400", bg: "bg-green-900/40" },
  likely_authentic: { label: "Likely Authentic", color: "text-green-400", bg: "bg-green-900/40" },
  inconclusive: { label: "Inconclusive", color: "text-yellow-400", bg: "bg-yellow-900/40" },
  likely_not_authentic: { label: "Likely Not Authentic", color: "text-red-400", bg: "bg-red-900/40" },
};

export default function EnhancedAuthBadge({ verdict, notes, tier }: EnhancedAuthBadgeProps) {
  const config = verdictConfig[verdict] ?? { label: verdict, color: "text-gray-400", bg: "bg-gray-800" };

  return (
    <div className="rounded-lg border border-brand-amber/20 bg-brand-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <svg className="h-5 w-5 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <h2 className="font-semibold text-white">TC Enhanced Authentication</h2>
        {tier === "premium" && (
          <span className="rounded-full bg-brand-amber/20 px-2 py-0.5 text-[10px] font-bold text-brand-amber">PREMIUM</span>
        )}
      </div>
      <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${config.bg} ${config.color}`}>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {config.label}
      </div>
      {notes && (
        <p className="mt-3 text-sm text-gray-400 leading-relaxed">{notes}</p>
      )}
    </div>
  );
}
