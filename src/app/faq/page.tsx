import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";
import FaqAccordion from "@/components/faq-accordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Get answers to common questions about TrustedCollectibles \u2014 authentication, COAs, shipping, escrow payments, returns, selling, and more.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-400 text-lg">
          Everything you need to know about buying and selling on
          TrustedCollectibles.
        </p>
      </div>

      <FaqAccordion />

      {/* CTA */}
      <div className="mt-16 text-center">
        <p className="text-gray-400 mb-4 leading-relaxed">
          Still have questions? We&apos;re happy to help.
        </p>
        <Link
          href="/contact"
          className="bg-brand-amber text-brand-dark font-semibold hover:bg-brand-amber-hover rounded-md px-6 py-3 text-sm inline-block"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
