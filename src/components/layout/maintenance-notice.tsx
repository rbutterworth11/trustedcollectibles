"use client";

import { useState } from "react";

interface MaintenanceNoticeProps {
  text: string;
  type?: "info" | "warning" | "error";
}

const typeStyles = {
  info: "bg-blue-900/40 border-blue-500/20 text-blue-300",
  warning: "bg-yellow-900/40 border-yellow-500/20 text-yellow-300",
  error: "bg-red-900/40 border-red-500/20 text-red-300",
};

export default function MaintenanceNotice({
  text,
  type = "info",
}: MaintenanceNoticeProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !text) return null;

  return (
    <div
      className={`relative flex items-center justify-center border-b px-8 py-2.5 ${typeStyles[type]}`}
    >
      <span className="text-xs sm:text-sm font-medium">{text}</span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
