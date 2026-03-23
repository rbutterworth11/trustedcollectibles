import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Buying Guide",
  description: "Learn how to buy authenticated sports memorabilia safely on TrustedCollectibles. Tips on spotting fakes, understanding COAs, escrow protection, and making smart purchases.",
  alternates: { canonical: `${SITE_URL}/buying-guide` },
};

export default function BuyingGuidePage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Buying Guide</h1>
        <p className="text-sm text-gray-400 mb-10">
          Everything you need to know about buying authenticated sports memorabilia with confidence.
        </p>

        {/* How Buying Works */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">How Buying Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Browse & Research", desc: "Search by sport, player, team, or item type. Every listing includes detailed photos, condition rating, and authentication details." },
              { step: "2", title: "Buy or Make an Offer", desc: "Purchase at the listed price or submit an offer. Your payment is processed securely through Stripe and held in escrow." },
              { step: "3", title: "Receive & Confirm", desc: "Inspect your item when it arrives. You have 48 hours to confirm delivery or raise a dispute." },
            ].map((s) => (
              <div key={s.step} className="rounded-lg border border-white/[0.07] bg-brand-card p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-amber text-sm font-bold text-brand-dark">{s.step}</span>
                <h3 className="mt-3 text-lg font-medium text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Understanding Authentication */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Understanding Authentication</h2>
          <div className="rounded-lg border border-white/[0.07] bg-brand-card p-6 space-y-4">
            <p className="text-gray-400 leading-relaxed">
              Authentication is the process of verifying that a signed item is genuine. On TrustedCollectibles, every listing goes through our expert review before it appears on the marketplace.
            </p>
            <h3 className="text-lg font-medium text-white mt-6 mb-3">What is a COA?</h3>
            <p className="text-gray-400 leading-relaxed">
              A Certificate of Authenticity (COA) is a document from a recognised authentication house confirming an item&apos;s genuineness. The most trusted COA providers include:
            </p>
            <ul className="text-gray-400 list-disc pl-6 space-y-2 mb-4">
              <li><strong className="text-white">PSA/DNA</strong> — The gold standard for autograph authentication. Look for their tamper-evident hologram sticker.</li>
              <li><strong className="text-white">JSA (James Spence Authentication)</strong> — Highly respected, offers both sticker and full letter authentication.</li>
              <li><strong className="text-white">Beckett Authentication (BAS)</strong> — Well-known for card grading and autograph verification.</li>
              <li><strong className="text-white">SGC</strong> — Growing in reputation, particularly for vintage items.</li>
            </ul>
            <h3 className="text-lg font-medium text-white mt-6 mb-3">What to Look For</h3>
            <ul className="text-gray-400 list-disc pl-6 space-y-2">
              <li>A hologram sticker or tamper-evident seal from the authentication house</li>
              <li>A certificate number you can verify on the authenticator&apos;s website</li>
              <li>Clear photos of the signature, the COA, and the hologram</li>
              <li>Consistency between the item described and the photos shown</li>
              <li>The seller&apos;s rating and review history</li>
            </ul>
          </div>
        </section>

        {/* Confidence Score */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Our Confidence Score</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Every listing on TrustedCollectibles has an Authenticity Confidence Score — a percentage rating from 0-100% based on multiple verification factors:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Verified COA present",
              "COA hologram confirmed",
              "Signature matches known examples",
              "Item condition consistent with age",
              "Seller is ID verified",
              "Seller has high rating",
              "Multiple clear photos provided",
              "Certificate number verified",
            ].map((factor) => (
              <div key={factor} className="flex items-center gap-2 rounded-md border border-white/[0.07] bg-brand-card px-4 py-3">
                <svg className="h-4 w-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-300">{factor}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Items scoring 80%+ are rated <span className="text-green-400 font-medium">High Confidence</span>. Items without a COA can still be listed but will show a lower score with a buyer discretion notice.
          </p>
        </section>

        {/* Escrow Protection */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Escrow Payment Protection</h2>
          <div className="rounded-lg border border-blue-500/20 bg-blue-900/20 p-6 space-y-3">
            <p className="text-blue-300 leading-relaxed">
              When you buy an item, your payment is <strong className="text-white">not</strong> sent directly to the seller. Instead, it&apos;s held securely by our platform in escrow.
            </p>
            <ol className="text-blue-300 list-decimal pl-6 space-y-2">
              <li>You pay — funds are held securely by TrustedCollectibles</li>
              <li>Seller ships the item with a tracking number</li>
              <li>You receive and inspect the item (48-hour review window)</li>
              <li>You confirm delivery — funds are released to the seller</li>
            </ol>
            <p className="text-blue-300 leading-relaxed">
              If the item doesn&apos;t match the description, you can open a dispute. Our team investigates and you receive a full refund if the item is not as described.
            </p>
          </div>
        </section>

        {/* Tips */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Smart Buying Tips</h2>
          <div className="space-y-3">
            {[
              { title: "Check the seller's history", desc: "Look at their ratings, reviews, and how long they've been on the platform. Established sellers with positive reviews are more reliable." },
              { title: "Study the photos carefully", desc: "Zoom in on the signature, check for consistency with known examples, and look at the item's condition closely." },
              { title: "Verify the certificate number", desc: "Most authentication houses let you look up certificate numbers on their website. Always verify before buying high-value items." },
              { title: "Compare prices", desc: "Research what similar items have sold for recently. If a price seems too good to be true, it might be." },
              { title: "Use the offer system", desc: "Many sellers accept offers. Don't be afraid to negotiate, especially on items that have been listed for a while." },
              { title: "Ask questions", desc: "Use the messaging system to ask the seller about provenance, signing events, and any other details before committing." },
            ].map((tip) => (
              <div key={tip.title} className="rounded-lg border border-white/[0.07] bg-brand-card p-4">
                <h3 className="font-medium text-white">{tip.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-6 border-t border-white/[0.07]">
          <p className="text-gray-400 mb-4">Ready to start collecting?</p>
          <div className="flex justify-center gap-3">
            <Link href="/marketplace" className="rounded-md bg-brand-amber px-6 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover">
              Browse Marketplace
            </Link>
            <Link href="/faq" className="rounded-md border border-white/[0.07] px-6 py-3 text-sm font-medium text-gray-300 hover:bg-white/5">
              Read FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
