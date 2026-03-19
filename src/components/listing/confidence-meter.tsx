"use client";

const FACTOR_LABELS: Record<string, string> = {
  verified_coa: "Verified COA present",
  coa_hologram: "COA hologram confirmed",
  signature_match: "Signature matches known examples",
  condition_consistent: "Item condition consistent with age",
  seller_verified: "Seller is ID verified",
  seller_high_rating: "Seller has high rating",
  clear_photos: "Multiple clear photos provided",
  cert_number_verified: "Certificate number verified",
};

interface ConfidenceMeterProps {
  score: number | null;
  factors: string[];
  hasCoa: boolean;
}

export default function ConfidenceMeter({
  score,
  factors,
  hasCoa,
}: ConfidenceMeterProps) {
  if (score === null && factors.length === 0) return null;

  const displayScore = score ?? 0;
  const color =
    displayScore >= 80
      ? { ring: "#22c55e", text: "text-green-400", bg: "bg-green-400", label: "High" }
      : displayScore >= 50
        ? { ring: "#c67b2f", text: "text-brand-amber", bg: "bg-brand-amber", label: "Moderate" }
        : { ring: "#ef4444", text: "text-red-400", bg: "bg-red-400", label: "Low" };

  // SVG arc for the dial
  const radius = 62;
  const svgSize = 148;
  const center = svgSize / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="rounded-lg border border-white/[0.07] bg-brand-card p-5">
      <h2 className="font-semibold text-white mb-4">Authenticity Confidence</h2>

      <div className="flex items-start gap-6">
        {/* Dial */}
        <div className="relative shrink-0">
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="-rotate-90">
            {/* Background circle */}
            <circle
              cx={center} cy={center} r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="8"
            />
            {/* Score arc */}
            <circle
              cx={center} cy={center} r={radius}
              fill="none"
              stroke={color.ring}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${color.text}`}>
              {displayScore}%
            </span>
            <span className="text-[10px] text-gray-500 mt-0.5">
              {color.label}
            </span>
          </div>
        </div>

        {/* Factors */}
        <div className="flex-1 min-w-0">
          {!hasCoa && (
            <div className="mb-3 rounded-md border border-yellow-500/20 bg-yellow-900/20 px-3 py-2">
              <p className="text-xs font-medium text-yellow-400">
                Listed without COA — buyer discretion advised
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            {Object.entries(FACTOR_LABELS).map(([key, label]) => {
              const checked = factors.includes(key);
              return (
                <div key={key} className="flex items-center gap-2">
                  {checked ? (
                    <svg className="h-4 w-4 shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 shrink-0 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className={`text-xs ${checked ? "text-gray-300" : "text-gray-600"}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
