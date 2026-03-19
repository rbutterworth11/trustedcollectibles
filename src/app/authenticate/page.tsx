import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Get Authenticated",
  description: "Get your sports memorabilia professionally authenticated by TrustedCollectibles experts. Standard check £14.99, detailed report with certificate £29.99.",
  alternates: { canonical: `${SITE_URL}/authenticate` },
};

export default function AuthenticatePage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Get Your Item Authenticated</h1>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
            Not sure if your memorabilia is genuine? Our expert team will review your item and COA photos to give you a professional authentication verdict.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Standard */}
          <div className="rounded-xl border border-white/[0.07] bg-brand-card p-8">
            <h2 className="text-lg font-semibold text-white">Standard Check</h2>
            <p className="mt-2 text-3xl font-bold text-white">£14.99</p>
            <p className="mt-1 text-sm text-gray-500">One-time fee</p>
            <ul className="mt-6 space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Expert review of item photos
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                COA verification check
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Verdict: Authentic / Inconclusive / Not Authentic
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Results within 48 hours
              </li>
            </ul>
            <Link href="/authenticate/submit?tier=standard" className="mt-8 block w-full rounded-md border border-white/[0.07] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-white/5 transition-colors">
              Get Standard Check
            </Link>
          </div>

          {/* Premium */}
          <div className="rounded-xl border-2 border-brand-amber bg-brand-card p-8 relative">
            <span className="absolute -top-3 left-6 rounded-full bg-brand-amber px-3 py-0.5 text-xs font-bold text-brand-dark">RECOMMENDED</span>
            <h2 className="text-lg font-semibold text-white">Detailed Report</h2>
            <p className="mt-2 text-3xl font-bold text-brand-amber">£29.99</p>
            <p className="mt-1 text-sm text-gray-500">One-time fee</p>
            <ul className="mt-6 space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-brand-amber shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Everything in Standard
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-brand-amber shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Detailed written assessment
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-brand-amber shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Downloadable PDF certificate
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-brand-amber shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Priority review (24 hours)
              </li>
            </ul>
            <Link href="/authenticate/submit?tier=premium" className="mt-8 block w-full rounded-md bg-brand-amber px-4 py-3 text-center text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover transition-colors">
              Get Detailed Report
            </Link>
          </div>
        </div>

        {/* How it works */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-6">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Upload Photos", desc: "Submit clear photos of your item, signature, and COA." },
              { step: "2", title: "Expert Review", desc: "Our authentication team reviews your submission." },
              { step: "3", title: "Get Your Verdict", desc: "Receive your result and certificate within 24-48 hours." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-amber text-brand-dark font-bold text-lg">{s.step}</span>
                <h3 className="mt-3 font-semibold text-white">{s.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
