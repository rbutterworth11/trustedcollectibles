import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "TrustedCollectibles was built by sports memorabilia experts who believe every collector deserves authenticity guarantees. Learn about our mission, verification process, and commitment to trust.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          About TrustedCollectibles
        </h1>
        <p className="text-gray-400 text-lg">
          Built by collectors, for collectors.
        </p>
      </div>

      {/* Our Story */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        Our Story
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        TrustedCollectibles was founded by sports memorabilia enthusiasts who
        got tired of the counterfeit problem plaguing the market. Too many
        collectors were getting burned by fake autographs, forged COAs, and
        unverifiable items sold on general-purpose marketplaces. We knew there
        had to be a better way.
      </p>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Every item on our platform is verified by our expert team before it can
        be listed. We partner with trusted authentication houses &mdash; PSA,
        Beckett, JSA, and more &mdash; and only accept items with valid
        Certificates of Authenticity. If it&apos;s on TrustedCollectibles, you
        can trust it&apos;s real.
      </p>

      {/* Our Mission */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        Our Mission
      </h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {[
          {
            title: "Expert Verification",
            description:
              "Every item reviewed by our authentication team before listing.",
          },
          {
            title: "Escrow Protection",
            description:
              "Buyer payments held securely until delivery is confirmed.",
          },
          {
            title: "Trusted COAs Only",
            description:
              "We only accept items authenticated by recognised houses (PSA, Beckett, JSA, SGC, Fanatics).",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-brand-card border border-white/[0.07] rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-white mb-3">
              {card.title}
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Why TrustedCollectibles? */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        Why TrustedCollectibles?
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Unlike general marketplaces, we specialise exclusively in authenticated
        sports memorabilia. Our team has decades of combined experience in the
        memorabilia industry &mdash; from grading cards to verifying signed
        jerseys. We&apos;ve built the verification process from the ground up to
        give both buyers and sellers the confidence they deserve. Every
        transaction is protected by our escrow system, and every item carries
        the weight of our reputation.
      </p>

      {/* The Numbers */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        The Numbers
      </h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {[
          { stat: "15,000+", label: "Items Verified" },
          { stat: "99.7%", label: "Buyer Satisfaction" },
          { stat: "\u00a32M+", label: "in Protected Transactions" },
          { stat: "50+", label: "Authentication Partners" },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-2xl font-bold text-brand-amber">{item.stat}</p>
            <p className="mt-1 text-sm text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h2 className="text-xl font-semibold text-white mb-4">
          Ready to start collecting?
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
