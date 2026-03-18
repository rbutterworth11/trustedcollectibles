"use client";

import Link from "next/link";
import { useState } from "react";

interface AnnouncementBarProps {
  text: string;
  link?: string;
  bgColor?: string;
  textColor?: string;
}

export default function AnnouncementBar({
  text,
  link,
  bgColor = "#c67b2f",
  textColor = "#08090e",
}: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !text) return null;

  const content = (
    <span className="text-xs sm:text-sm font-medium">{text}</span>
  );

  return (
    <div
      className="relative flex items-center justify-center px-8 py-2"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {link ? (
        <Link href={link} className="hover:underline">
          {content}
        </Link>
      ) : (
        content
      )}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
        style={{ color: textColor }}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
