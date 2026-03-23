import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Selling Guide",
  description: "Learn how to sell authenticated sports memorabilia on TrustedCollectibles. Photography tips, pricing advice, authentication requirements, and how to maximise your sales.",
  alternates: { canonical: `${SITE_URL}/selling-guide` },
};

export default function SellingGuidePage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Selling Guide</h1>
        <p className="text-sm text-gray-400 mb-10">
          Everything you need to list, sell, and ship authenticated sports memorabilia successfully.
        </p>

        {/* How Selling Works */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">How Selling Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Create Your Listing", desc: "Upload photos, add details, and set your price. Our 3-step wizard makes it quick." },
              { step: "2", title: "Get Verified", desc: "Our team reviews your item and COA. Approved listings get the Verified badge." },
              { step: "3", title: "Receive Orders", desc: "Buyers purchase or make offers. You're notified instantly." },
              { step: "4", title: "Ship & Get Paid", desc: "Ship within 3 days with tracking. Payment released after buyer confirms." },
            ].map((s) => (
              <div key={s.step} className="rounded-lg border border-white/[0.07] bg-brand-card p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-amber text-sm font-bold text-brand-dark">{s.step}</span>
                <h3 className="mt-3 text-lg font-medium text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Photography Guide */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Photography Guide</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Great photos are the most important factor in selling your item quickly and for the best price. Here&apos;s how to photograph your memorabilia like a pro:
          </p>
          <div className="space-y-3">
            {[
              { title: "Use natural light", desc: "Photograph near a window or outdoors in shade. Avoid direct sunlight which causes glare on signatures and glass. Never use flash." },
              { title: "Show the full item", desc: "Your main photo should show the complete item clearly. For jerseys, lay them flat or hang them. For photos and cards, photograph them head-on without angle." },
              { title: "Get a signature close-up", desc: "Take a dedicated close-up of the autograph. This is what buyers scrutinise most. Use macro mode if your phone has it. The signature should fill most of the frame." },
              { title: "Photograph the COA", desc: "Take clear photos of the front and back of your Certificate of Authenticity. Make sure the certificate number and hologram sticker are clearly readable." },
              { title: "Capture the hologram", desc: "Photograph the hologram sticker at an angle so the holographic effect is visible. This is a key authenticity marker." },
              { title: "Show any flaws", desc: "If there's any wear, discolouration, or damage, photograph it clearly. Buyers appreciate honesty and it prevents disputes." },
              { title: "Use a clean background", desc: "A plain dark or white surface works best. Avoid cluttered backgrounds that distract from the item." },
              { title: "Take multiple angles", desc: "The more photos the better. Front, back, details, labels, and any unique features. Upload up to 6 photos per listing." },
            ].map((tip) => (
              <div key={tip.title} className="rounded-lg border border-white/[0.07] bg-brand-card p-4">
                <h3 className="font-medium text-white">{tip.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Title Format */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Writing a Great Title</h2>
          <div className="rounded-lg border border-brand-amber/20 bg-brand-amber/5 p-5">
            <p className="text-sm font-medium text-brand-amber mb-2">
              Format: [Player name] signed [item type] [year/details]
            </p>
            <p className="text-sm text-gray-400 mb-3">Keep it under 80 characters. Be specific and include key details.</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                <span className="text-green-400 mr-2">Good:</span>
                &ldquo;Wayne Rooney signed Manchester United shirt 2011&rdquo;
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-green-400 mr-2">Good:</span>
                &ldquo;Muhammad Ali signed Everlast boxing glove PSA certified&rdquo;
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-red-400 mr-2">Bad:</span>
                &ldquo;Signed shirt&rdquo; — too vague, won&apos;t appear in searches
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-red-400 mr-2">Bad:</span>
                &ldquo;AMAZING RARE VINTAGE!!!&rdquo; — unprofessional, no useful info
              </p>
            </div>
          </div>
        </section>

        {/* Authentication Requirements */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Authentication Requirements</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            All listings are reviewed by our authentication team before going live. Here&apos;s what you need:
          </p>
          <div className="rounded-lg border border-white/[0.07] bg-brand-card p-6 space-y-4">
            <h3 className="text-lg font-medium text-white">Required</h3>
            <ul className="text-gray-400 list-disc pl-6 space-y-2">
              <li>At least one clear photo of the item</li>
              <li>COA source (PSA, Beckett, JSA, etc.)</li>
              <li>Certificate number</li>
              <li>Accurate title following our naming format</li>
              <li>Sport, item type, player name, and condition</li>
            </ul>
            <h3 className="text-lg font-medium text-white mt-6">Recommended</h3>
            <ul className="text-gray-400 list-disc pl-6 space-y-2">
              <li>Signature close-up photo</li>
              <li>COA front and back photos</li>
              <li>Hologram sticker photo</li>
              <li>Additional item photos (3-4 angles)</li>
              <li>Detailed description including provenance</li>
            </ul>
            <div className="mt-4 rounded-md border border-yellow-500/20 bg-yellow-900/20 p-4">
              <p className="text-sm text-yellow-400">
                <strong>Items without a COA</strong> can still be listed with &ldquo;Seller Self-Authenticated&rdquo; as the source, but they&apos;ll receive a lower confidence score. We recommend getting items professionally authenticated before listing — you can use our <Link href="/authenticate" className="underline hover:text-yellow-300">Authentication Service</Link> for £14.99.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Advice */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Pricing Your Items</h2>
          <div className="space-y-3">
            {[
              { title: "Research comparable sales", desc: "Search for similar items on our marketplace and other platforms. Price competitively based on condition, authentication, and player popularity." },
              { title: "Consider accepting offers", desc: "Enabling offers increases your chances of selling. Set a minimum offer to filter out lowball bids." },
              { title: "Factor in our fees", desc: "We charge a 10% platform commission plus Stripe processing fees (2.9% + 30p). The fee breakdown is shown when you set your price." },
              { title: "Use the Bump feature", desc: "Once per day, you can bump your listing to the top of search results for free. Use it strategically when traffic is high." },
              { title: "Price to sell", desc: "Items priced realistically sell faster. A slightly lower price with quick turnover often nets more than an overpriced item sitting for months." },
            ].map((tip) => (
              <div key={tip.title} className="rounded-lg border border-white/[0.07] bg-brand-card p-4">
                <h3 className="font-medium text-white">{tip.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Shipping & Packaging</h2>
          <div className="rounded-lg border border-white/[0.07] bg-brand-card p-6 space-y-4">
            <p className="text-gray-400 leading-relaxed">
              When an item sells, you must ship it within <strong className="text-white">2 working days</strong> and provide a tracking number. Here are our packaging recommendations:
            </p>
            <ul className="text-gray-400 list-disc pl-6 space-y-2">
              <li><strong className="text-white">Jerseys/shirts:</strong> Fold carefully with acid-free tissue paper, place in a sturdy box. Don&apos;t fold across the signature.</li>
              <li><strong className="text-white">Framed items:</strong> Wrap in bubble wrap, use corner protectors, and double-box for transit.</li>
              <li><strong className="text-white">Cards & photos:</strong> Use a rigid card mailer or top-loader inside a padded envelope.</li>
              <li><strong className="text-white">Gloves & equipment:</strong> Wrap individually in tissue and bubble wrap. Use a box with adequate padding.</li>
              <li><strong className="text-white">Include the COA:</strong> Always ship the Certificate of Authenticity with the item.</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              We recommend using <strong className="text-white">tracked and insured</strong> shipping for all items. Royal Mail Tracked, DPD, or UPS are good options for UK shipments.
            </p>
          </div>
        </section>

        {/* Getting Paid */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mt-10 mb-4">Getting Paid</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Payments are processed through Stripe Connect. Here&apos;s how the payout works:
          </p>
          <ol className="text-gray-400 list-decimal pl-6 space-y-2 mb-4">
            <li>Buyer pays — funds held in escrow</li>
            <li>You ship and add tracking number</li>
            <li>Buyer confirms delivery (or auto-confirmed after 14 days)</li>
            <li>Platform fee (10%) deducted</li>
            <li>Remaining funds transferred to your Stripe account within 2-3 business days</li>
          </ol>
          <p className="text-sm text-gray-500">
            You&apos;ll need to connect your Stripe account from <Link href="/dashboard/settings" className="text-brand-amber hover:text-brand-amber-hover">Dashboard Settings</Link> before you can receive payouts.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center pt-6 border-t border-white/[0.07]">
          <p className="text-gray-400 mb-4">Ready to list your first item?</p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard/listings/new" className="rounded-md bg-brand-amber px-6 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover">
              Create a Listing
            </Link>
            <Link href="/authenticate" className="rounded-md border border-white/[0.07] px-6 py-3 text-sm font-medium text-gray-300 hover:bg-white/5">
              Get Authenticated
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
