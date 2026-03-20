"use client";

interface SellerTrustBadgeProps {
  rating: number | null;
  reviewCount: number;
  compact?: boolean;
}

export default function SellerTrustBadge({ rating, reviewCount, compact = false }: SellerTrustBadgeProps) {
  // Determine trust level
  let level: string;
  let color: string;

  if (reviewCount === 0) {
    level = "New Seller";
    color = "text-gray-400";
  } else if (rating && rating >= 4.5 && reviewCount >= 10) {
    level = "Top Seller";
    color = "text-green-400";
  } else if (rating && rating >= 4.0 && reviewCount >= 3) {
    level = "Trusted Seller";
    color = "text-brand-amber";
  } else {
    level = "Seller";
    color = "text-gray-400";
  }

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${color}`}>
        {rating ? (
          <>
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {rating.toFixed(1)}
          </>
        ) : level}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
      level === "Top Seller" ? "bg-green-900/40 text-green-400" :
      level === "Trusted Seller" ? "bg-brand-amber/10 text-brand-amber" :
      "bg-white/[0.07] text-gray-400"
    }`}>
      {rating ? (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : null}
      {rating ? `${rating.toFixed(1)} · ` : ""}{level}
    </span>
  );
}
