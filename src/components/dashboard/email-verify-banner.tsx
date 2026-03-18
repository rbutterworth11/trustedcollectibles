"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function EmailVerifyBanner() {
  const [show, setShow] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && !user.email_confirmed_at) {
        setShow(true);
      }
    });
  }, []);

  if (!show) return null;

  async function handleResend() {
    setSending(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      await supabase.auth.resend({ type: "signup", email: user.email });
      setSent(true);
    }
    setSending(false);
  }

  return (
    <div className="mb-4 rounded-lg border border-brand-amber/30 bg-brand-amber/10 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <svg className="h-5 w-5 text-brand-amber shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-white">Verify your email</p>
          <p className="text-xs text-gray-400">Check your inbox to confirm your email address.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {sent ? (
          <span className="text-xs text-green-400">Email sent!</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={sending}
            className="rounded-md border border-brand-amber/30 px-3 py-1.5 text-xs font-medium text-brand-amber hover:bg-brand-amber/20 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Resend"}
          </button>
        )}
        <button onClick={() => setShow(false)} className="text-gray-500 hover:text-white">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
