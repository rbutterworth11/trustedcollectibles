import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Buyer Protection",
  description:
    "Learn about TrustedCollectibles buyer protection policy. Your purchases are protected by escrow payments, authentication guarantees, and a fair dispute process.",
  alternates: { canonical: `${SITE_URL}/buyer-protection` },
};

const protectedFrom = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    title: "Wrong Item Received",
    description:
      "If the item you receive is different from what was listed — wrong player, wrong sport, wrong item entirely — you are fully protected. Open a dispute and we will arrange a return and full refund.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    title: "Misrepresented Condition",
    description:
      "Sellers must accurately describe their item's condition. If the item arrives in significantly worse condition than described — undisclosed damage, missing components, or defects not shown in photos — you can open a dispute for a full or partial refund.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Not Authentic",
    description:
      "Every listed item goes through our verification process before sale. However, if you have reason to believe an item is not authentic after receiving it, open a dispute immediately. We will arrange an independent authentication review at no cost to you.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h17.25M21 12.75V14.25M3.375 14.25V5.625m0 0A1.125 1.125 0 014.5 4.5h9.75a1.125 1.125 0 011.125 1.125m-14.25 0v8.625" />
      </svg>
    ),
    title: "Seller Never Ships",
    description:
      "Sellers must ship within 2 working days of a sale. If the seller fails to ship or provide a valid tracking number within this window, you can cancel the order for an automatic full refund. Your money is never at risk.",
  },
];

const disputeSteps = [
  {
    number: 1,
    title: "Open a Dispute",
    description:
      "From your Orders page, select the order and click \"Open Dispute\". Describe the issue and upload any supporting photos. You have 48 hours after delivery confirmation to open a dispute.",
    timeframe: "Within 48 hours of delivery",
  },
  {
    number: 2,
    title: "Seller Response",
    description:
      "The seller is notified and has 48 hours to respond with their side. They can accept your claim, offer a partial refund, or contest it with evidence.",
    timeframe: "48-hour seller response window",
  },
  {
    number: 3,
    title: "TrustedCollectibles Review",
    description:
      "If the dispute isn't resolved between buyer and seller, our team steps in. We review all evidence — photos, listing details, messages, and authentication records — to make a fair decision.",
    timeframe: "Reviewed within 3 business days",
  },
  {
    number: 4,
    title: "Resolution",
    description:
      "We issue a decision: full refund, partial refund, or release of funds to the seller. If a return is required, we provide a prepaid shipping label. Refunds are processed within 2 business days of the decision.",
    timeframe: "Refund processed in 2 business days",
  },
];

export default function BuyerProtectionPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-amber/10">
          <svg className="h-8 w-8 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Buyer Protection</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Every purchase on TrustedCollectibles is protected by our escrow payment system.
          Your money is held securely until you confirm you&apos;re happy with your item.
        </p>
      </div>

      {/* Escrow Explainer */}
      <div className="mb-12 rounded-xl border border-brand-amber/20 bg-brand-amber/5 p-6 md:p-8">
        <h2 className="text-xl font-semibold text-white mb-3">How Escrow Protection Works</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          When you buy an item, your payment is held in escrow — not sent to the seller.
          The seller ships the item, you receive and inspect it, and only when you confirm
          everything is as described does the seller get paid. If something is wrong, your
          money stays protected.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <svg className="h-4 w-4 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Funds held until delivery confirmed
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <svg className="h-4 w-4 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            48-hour inspection window
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <svg className="h-4 w-4 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Full refund if item not as described
          </div>
        </div>
      </div>

      {/* What You're Protected From */}
      <h2 className="text-xl font-semibold text-white mb-6">What You&apos;re Protected From</h2>
      <div className="grid gap-4 sm:grid-cols-2 mb-12">
        {protectedFrom.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-white/[0.07] bg-brand-card p-6"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              {item.icon}
            </div>
            <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Dispute Process */}
      <h2 className="text-xl font-semibold text-white mb-6">Dispute Process</h2>
      <p className="text-gray-400 mb-6">
        If something goes wrong with your order, here&apos;s exactly what happens when you open a dispute.
      </p>
      <div className="mb-12 space-y-4">
        {disputeSteps.map((step, i) => (
          <div key={step.number} className="relative">
            <div className="flex gap-4 rounded-lg border border-white/[0.07] bg-brand-card p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-amber text-brand-dark font-bold text-lg">
                {step.number}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium text-white">{step.title}</h3>
                  <span className="rounded-full bg-white/[0.07] px-2.5 py-0.5 text-xs text-gray-400">
                    {step.timeframe}
                  </span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
            {i < disputeSteps.length - 1 && (
              <div className="ml-[1.75rem] h-4 w-px bg-white/[0.07]" />
            )}
          </div>
        ))}
      </div>

      {/* Shipping Deadline */}
      <div className="mb-12 rounded-lg border border-white/[0.07] bg-brand-card p-6 md:p-8">
        <h2 className="text-xl font-semibold text-white mb-3">Seller Shipping Deadline</h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Sellers are required to ship items within <strong className="text-white">2 working days</strong> of
          a confirmed sale and provide a valid tracking number. If this deadline is missed:
        </p>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            You can cancel the order for an immediate full refund
          </li>
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            The seller receives a late-shipping warning on their account
          </li>
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Repeated late shipments may result in seller account suspension
          </li>
        </ul>
      </div>

      {/* Important Details */}
      <div className="mb-12 rounded-lg border border-white/[0.07] bg-brand-card p-6 md:p-8">
        <h2 className="text-xl font-semibold text-white mb-4">Important Details</h2>
        <div className="space-y-4 text-sm text-gray-400">
          <div>
            <h3 className="font-medium text-gray-300 mb-1">48-Hour Review Window</h3>
            <p>After delivery is confirmed, you have 48 hours to inspect the item and open a dispute if needed. After this window, the payment is automatically released to the seller.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-300 mb-1">Evidence Requirements</h3>
            <p>When opening a dispute, provide clear photos and a detailed description. The more evidence you provide, the faster we can resolve your case.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-300 mb-1">Return Shipping</h3>
            <p>If a return is required and the dispute is found in your favour, TrustedCollectibles provides a prepaid return label. You will not be out of pocket for return shipping.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-300 mb-1">Refund Method</h3>
            <p>Refunds are returned to your original payment method. Processing times depend on your bank but typically take 3–5 business days after we issue the refund.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-3">Shop With Confidence</h2>
        <p className="text-gray-400 mb-6">
          Every item on TrustedCollectibles is verified and every payment is protected.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/marketplace"
            className="rounded-md bg-brand-amber px-6 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover"
          >
            Browse Marketplace
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-md border border-white/[0.07] px-6 py-3 text-sm text-gray-300 hover:bg-white/5"
          >
            How It Works
          </Link>
        </div>
      </div>
    </div>
  );
}
