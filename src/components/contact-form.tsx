"use client";

import { useState } from "react";

const subjectOptions = [
  "General Enquiry",
  "Authentication Question",
  "Order Issue",
  "Selling Question",
  "Report an Issue",
  "Other",
];

const inputClasses =
  "bg-brand-card border border-white/[0.07] text-white placeholder:text-gray-500 focus:border-brand-amber focus:ring-brand-amber rounded-md px-4 py-2.5 text-sm w-full";
const labelClasses = "block text-sm font-medium text-gray-300 mb-1.5";

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6 text-brand-amber"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6 text-brand-amber"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6 text-brand-amber"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-amber/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-8 w-8 text-brand-amber"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Thank you!</h2>
        <p className="text-gray-400">
          We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-5">
      {/* Form — left */}
      <div className="lg:col-span-3">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className={labelClasses}>
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClasses}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="subject" className={labelClasses}>
              Subject
            </label>
            <select
              id="subject"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={inputClasses}
            >
              <option value="" disabled>
                Select a subject
              </option>
              {subjectOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="message" className={labelClasses}>
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              className={inputClasses}
            />
          </div>

          <button
            type="submit"
            className="bg-brand-amber text-brand-dark font-semibold hover:bg-brand-amber-hover rounded-md px-6 py-3 text-sm"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Info cards — right */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-brand-card border border-white/[0.07] rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <MailIcon />
            <h3 className="text-sm font-medium text-white">Email</h3>
          </div>
          <p className="text-gray-400 text-sm">
            support@trustedcollectibles.com
          </p>
        </div>

        <div className="bg-brand-card border border-white/[0.07] rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <ClockIcon />
            <h3 className="text-sm font-medium text-white">Response Time</h3>
          </div>
          <p className="text-gray-400 text-sm">Within 24 hours</p>
        </div>

        <div className="bg-brand-card border border-white/[0.07] rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <CalendarIcon />
            <h3 className="text-sm font-medium text-white">Office Hours</h3>
          </div>
          <p className="text-gray-400 text-sm">Mon-Fri 9am-6pm GMT</p>
        </div>
      </div>
    </div>
  );
}
