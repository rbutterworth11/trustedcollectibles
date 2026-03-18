import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how to buy and sell authenticated sports memorabilia on TrustedCollectibles. Our step-by-step guide covers listing, verification, escrow payments, and delivery.",
  alternates: { canonical: `${SITE_URL}/how-it-works` },
};

const buyerSteps = [
  {
    number: 1,
    title: "Browse & Discover",
    description:
      "Search our marketplace of verified memorabilia. Filter by sport, player, price, and condition. Every item has been authenticated by our team.",
  },
  {
    number: 2,
    title: "Buy or Make an Offer",
    description:
      "Purchase instantly at the listed price or make an offer. All payments are processed securely through Stripe.",
  },
  {
    number: 3,
    title: "Escrow Protection",
    description:
      "Your payment is held securely in escrow. The seller is notified to ship your item within 3 business days.",
  },
  {
    number: 4,
    title: "Receive & Verify",
    description:
      "Inspect your item when it arrives. You have 3 business days to confirm everything is as described.",
  },
  {
    number: 5,
    title: "Confirm or Dispute",
    description:
      "Happy? Confirm delivery and the seller gets paid. Not as described? Open a dispute and we\u2019ll investigate.",
  },
];

const sellerSteps = [
  {
    number: 1,
    title: "Create Your Listing",
    description:
      "Upload photos, add details, and provide your COA information. Our step-by-step wizard makes it easy.",
  },
  {
    number: 2,
    title: "Expert Verification",
    description:
      "Our authentication team reviews your item and COA. Items that pass verification get the \u201cVerified\u201d badge.",
  },
  {
    number: 3,
    title: "Receive Orders & Offers",
    description:
      "Buyers can purchase at your price or send offers. You\u2019ll be notified instantly.",
  },
  {
    number: 4,
    title: "Ship & Get Paid",
    description:
      "Ship within 3 business days with tracking. Once the buyer confirms delivery, funds are transferred to your Stripe account minus the 10% platform fee.",
  },
];

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-brand-card border border-white/[0.07] rounded-lg p-6 flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-amber text-brand-dark font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-medium text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">How It Works</h1>
        <p className="text-gray-400 text-lg">
          Buy and sell authenticated memorabilia with confidence.
        </p>
      </div>

      {/* For Buyers */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        For Buyers
      </h2>
      <div className="grid gap-4">
        {buyerSteps.map((step) => (
          <StepCard key={step.number} {...step} />
        ))}
      </div>

      {/* For Sellers */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        For Sellers
      </h2>
      <div className="grid gap-4">
        {sellerSteps.map((step) => (
          <StepCard key={step.number} {...step} />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h2 className="text-xl font-semibold text-white mb-4">
          Ready to get started?
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/marketplace"
            className="bg-brand-amber text-brand-dark font-semibold hover:bg-brand-amber-hover rounded-md px-6 py-3 text-sm"
          >
            Browse Marketplace
          </Link>
          <Link
            href="/sell"
            className="border border-white/[0.07] text-gray-300 hover:bg-white/5 rounded-md px-6 py-3 text-sm"
          >
            Start Selling
          </Link>
        </div>
      </div>
    </div>
  );
}
