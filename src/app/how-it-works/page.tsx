import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how to buy and sell authenticated sports memorabilia on TrustedCollectibles. Our step-by-step guide covers listing, verification, escrow payments, shipping, and buyer protection.",
  alternates: { canonical: `${SITE_URL}/how-it-works` },
};

/* ──────────────────────── DATA ──────────────────────── */

const buyerSteps = [
  {
    number: 1,
    title: "Browse & Discover",
    description:
      "Search our marketplace of verified memorabilia. Filter by sport, player, price, and condition. Every item has been authenticated by our expert team before it goes live.",
    detail: "Use saved searches and wishlists to track items you love.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Buy or Make an Offer",
    description:
      "Purchase instantly at the listed price or make an offer. Negotiate directly with the seller through our messaging system. All payments are processed securely through Stripe.",
    detail: "Offers are binding — if accepted, payment is taken automatically.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Secure Escrow Payment",
    description:
      "Your payment is held in escrow — the seller never touches your money until you confirm you're happy. This protects you from fraud, non-delivery, and misrepresented items.",
    detail: "Payments powered by Stripe for maximum security.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    number: 4,
    title: "Seller Ships Within 2 Days",
    description:
      "The seller is required to ship your item within 2 working days and provide a tracking number. You can track your shipment directly from your orders page. If the seller misses this deadline, you can cancel for a full refund.",
    detail: "All shipments require tracking and signature on delivery.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h17.25M21 12.75V14.25M3.375 14.25V5.625m0 0A1.125 1.125 0 014.5 4.5h9.75a1.125 1.125 0 011.125 1.125m-14.25 0v8.625" />
      </svg>
    ),
  },
  {
    number: 5,
    title: "Receive & Inspect",
    description:
      "When your item arrives, inspect it carefully. Check the condition, authenticity markings, and match it against the listing description and photos. You have 48 hours to review.",
    detail: "Take photos when unboxing — useful if you need to raise a dispute.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  {
    number: 6,
    title: "Confirm or Open Dispute",
    description:
      "Happy with your item? Confirm delivery and the seller receives payment. Something wrong? Open a dispute within 48 hours. Our team reviews all evidence and resolves disputes within 3 business days.",
    detail: "Full buyer protection on every purchase.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const sellerSteps = [
  {
    number: 1,
    title: "Create Your Account",
    description:
      "Sign up and complete your seller profile. Add your details, verify your email, and you're ready to start listing items on the marketplace.",
    detail: "Complete profiles build trust and attract more buyers.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "List Your Item",
    description:
      "Upload high-quality photos, write a detailed description, set your price, and provide your Certificate of Authenticity (COA) information. Our step-by-step listing wizard guides you through everything.",
    detail: "Better photos and descriptions = faster sales.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Expert Verification",
    description:
      "Our authentication team reviews your item, photos, and COA documentation. Items that pass receive the \"Verified\" badge, giving buyers confidence and boosting your listing visibility.",
    detail: "Most items are reviewed within 24 hours.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    number: 4,
    title: "Receive Orders & Offers",
    description:
      "Buyers can purchase at your listed price or send you offers. You'll receive instant notifications for both. Review and accept or decline offers from your dashboard.",
    detail: "Set a minimum offer threshold to filter low-ball offers.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    number: 5,
    title: "Ship Within 2 Working Days",
    description:
      "Once an order is confirmed, you must ship the item within 2 working days and enter the tracking number. Use tracked, signed-for delivery to protect yourself and the buyer.",
    detail: "Late shipments may result in order cancellation and account warnings.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
  },
  {
    number: 6,
    title: "Get Paid",
    description:
      "Once the buyer confirms delivery (or after the 48-hour review window passes without a dispute), funds are released to your Stripe account minus the 10% platform fee.",
    detail: "Stripe payouts typically arrive within 2–3 business days.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
];

const shippingInfo = [
  {
    title: "Tracked & Signed Delivery",
    description: "All shipments must use tracked, signed-for delivery services to protect both parties.",
  },
  {
    title: "2 Working Day Shipping Deadline",
    description: "Sellers must ship within 2 working days of a confirmed sale or the buyer can cancel.",
  },
  {
    title: "Packaging Requirements",
    description: "Items must be securely packaged to prevent damage. Use rigid mailers for flat items and bubble wrap for 3D items.",
  },
  {
    title: "Insurance Recommended",
    description: "We strongly recommend insuring shipments for the full sale value, especially for high-value items.",
  },
];

/* ──────────────────────── COMPONENTS ──────────────────────── */

function StepCard({
  number,
  title,
  description,
  detail,
  icon,
  isLast,
}: {
  number: number;
  title: string;
  description: string;
  detail: string;
  icon: React.ReactNode;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-5">
      {/* Vertical connector line */}
      <div className="flex flex-col items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-amber/10 text-brand-amber border border-brand-amber/20">
          {icon}
        </div>
        {!isLast && <div className="mt-2 w-px flex-1 bg-brand-amber/20" />}
      </div>

      {/* Content */}
      <div className={`pb-8 ${isLast ? "" : ""}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="rounded-full bg-brand-amber px-2.5 py-0.5 text-xs font-bold text-brand-dark">
            Step {number}
          </span>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-gray-400 leading-relaxed mb-2">{description}</p>
        <p className="text-sm text-brand-amber/70 italic">{detail}</p>
      </div>
    </div>
  );
}

/* ──────────────────────── PAGE ──────────────────────── */

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero */}
      <div className="mb-14 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          How TrustedCollectibles Works
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          A trusted marketplace where every item is verified, every payment is protected
          by escrow, and both buyers and sellers are supported at every step.
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="mb-14 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { stat: "100%", label: "Verified Items" },
          { stat: "Escrow", label: "Payment Protection" },
          { stat: "48hr", label: "Review Window" },
          { stat: "2 Days", label: "Shipping Deadline" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-white/[0.07] bg-brand-card p-4 text-center"
          >
            <div className="text-2xl font-bold text-brand-amber mb-1">{item.stat}</div>
            <div className="text-xs text-gray-400">{item.label}</div>
          </div>
        ))}
      </div>

      {/* ─── FOR BUYERS ─── */}
      <div className="mb-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">For Buyers</h2>
            <p className="text-sm text-gray-400">How to purchase authenticated memorabilia safely</p>
          </div>
        </div>

        <div className="ml-1">
          {buyerSteps.map((step, i) => (
            <StepCard
              key={step.number}
              {...step}
              isLast={i === buyerSteps.length - 1}
            />
          ))}
        </div>

        {/* Buyer Protection Callout */}
        <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <div>
              <h3 className="font-semibold text-white mb-1">Buyer Protection Guarantee</h3>
              <p className="text-sm text-gray-400 mb-3">
                Every purchase is covered by our buyer protection policy. You&apos;re protected against wrong items,
                misrepresented condition, inauthentic items, and non-delivery.
              </p>
              <Link
                href="/buyer-protection"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300"
              >
                Read full Buyer Protection policy
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FOR SELLERS ─── */}
      <div className="mb-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.998 2.998 0 00.306-1.424V6.75a.75.75 0 01.75-.75h16.5a.75.75 0 01.75.75v1.175a2.998 2.998 0 00.306 1.424" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">For Sellers</h2>
            <p className="text-sm text-gray-400">How to list and sell your memorabilia</p>
          </div>
        </div>

        <div className="ml-1">
          {sellerSteps.map((step, i) => (
            <StepCard
              key={step.number}
              {...step}
              isLast={i === sellerSteps.length - 1}
            />
          ))}
        </div>

        {/* Seller Fee Callout */}
        <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/5 p-6">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-white mb-1">Simple, Transparent Fees</h3>
              <p className="text-sm text-gray-400">
                We charge a flat <strong className="text-white">10% platform fee</strong> on completed sales.
                No listing fees, no hidden charges. You only pay when your item sells.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SHIPPING INFO ─── */}
      <div className="mb-16">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-amber/10">
            <svg className="h-5 w-5 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h17.25M21 12.75V14.25M3.375 14.25V5.625m0 0A1.125 1.125 0 014.5 4.5h9.75a1.125 1.125 0 011.125 1.125m-14.25 0v8.625" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Shipping & Delivery</h2>
            <p className="text-sm text-gray-400">What to expect for every order</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {shippingInfo.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-white/[0.07] bg-brand-card p-5"
            >
              <h3 className="font-medium text-white mb-1.5">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── BUYER PROTECTION SUMMARY ─── */}
      <div className="mb-16">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
            <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Buyer Protection</h2>
            <p className="text-sm text-gray-400">Your purchase is always protected</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: "Wrong Item", desc: "Full refund if you receive the wrong item" },
            { title: "Not as Described", desc: "Full or partial refund for misrepresented condition" },
            { title: "Not Authentic", desc: "Free independent authentication review and full refund" },
            { title: "Non-Delivery", desc: "Automatic refund if seller doesn't ship within 2 days" },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-lg border border-white/[0.07] bg-brand-card p-4"
            >
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-medium text-white text-sm">{item.title}</h3>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/buyer-protection"
            className="text-sm font-medium text-brand-amber hover:text-brand-amber-hover"
          >
            View full Buyer Protection policy &rarr;
          </Link>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-white/[0.07] bg-brand-card p-8 md:p-10 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Ready to Get Started?
        </h2>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          Join thousands of collectors buying and selling authenticated sports memorabilia
          with confidence.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/marketplace"
            className="rounded-md bg-brand-amber px-6 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover"
          >
            Browse Marketplace
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-white/[0.07] px-6 py-3 text-sm text-gray-300 hover:bg-white/5"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
