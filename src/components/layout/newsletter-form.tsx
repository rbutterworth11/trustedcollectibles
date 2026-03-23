"use client";

import { useState, useRef } from "react";

const MAILCHIMP_URL =
  "https://trustedcollectibles.us10.list-manage.com/subscribe/post?u=24e3267dbe669ecbe1c77e792&id=96d1ff9043";

export default function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit() {
    // Small delay so the native form submission fires first
    setTimeout(() => setSubmitted(true), 100);
  }

  if (submitted) {
    return (
      <p className="text-sm text-brand-amber">
        Thanks for subscribing! Check your inbox to confirm.
      </p>
    );
  }

  return (
    <form
      ref={formRef}
      action={MAILCHIMP_URL}
      method="POST"
      target="_blank"
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
    >
      {/* Mailchimp honeypot — must stay outside viewport */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-5000px" }}>
        <input
          type="text"
          name="b_24e3267dbe669ecbe1c77e792_96d1ff9043"
          tabIndex={-1}
          defaultValue=""
        />
      </div>

      <input
        type="email"
        name="EMAIL"
        required
        placeholder="Your email address"
        className="w-full sm:w-64 rounded-md border border-white/[0.07] bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-amber/50 focus:outline-none focus:ring-1 focus:ring-brand-amber/50"
      />
      <button
        type="submit"
        className="shrink-0 rounded-md bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-amber-hover"
      >
        Subscribe
      </button>
    </form>
  );
}
