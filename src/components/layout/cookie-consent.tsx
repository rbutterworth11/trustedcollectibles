"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_NAME = "tc_cookie_consent";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

function setCookie(value: string) {
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function getCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? match[1] : null;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookie()) setVisible(true);
  }, []);

  function accept(value: "all" | "essential") {
    setCookie(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-white/[0.07] bg-brand-card/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-400">
          We use cookies to improve your experience. By continuing you agree to
          our{" "}
          <Link
            href="/cookies"
            className="text-brand-amber underline underline-offset-2 hover:text-brand-amber-hover"
          >
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => accept("essential")}
            className="rounded-md border border-white/[0.07] px-4 py-2 text-xs font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Essential Only
          </button>
          <button
            onClick={() => accept("all")}
            className="rounded-md bg-brand-amber px-4 py-2 text-xs font-semibold text-brand-dark transition-colors hover:bg-brand-amber-hover"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
