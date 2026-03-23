import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using TrustedCollectibles, the UK marketplace for authenticated sports memorabilia. Covers buyer protection, seller obligations, escrow payments, and dispute resolution.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">
        Terms &amp; Conditions
      </h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: March 2024</p>

      {/* 1. Introduction */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        1. Introduction
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        These Terms and Conditions (&quot;Terms&quot;) govern your access to and
        use of the TrustedCollectibles platform (&quot;Platform&quot;), operated
        by TrustedCollectibles Ltd, a company registered in England and Wales
        (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or
        &quot;TrustedCollectibles&quot;).
      </p>
      <p className="text-gray-400 mb-4 leading-relaxed">
        By accessing or using the Platform, you agree to be bound by these
        Terms. If you do not agree to these Terms, you must not use the
        Platform. We recommend that you print or save a copy of these Terms for
        your records.
      </p>
      <p className="text-gray-400 mb-4 leading-relaxed">
        TrustedCollectibles operates as an online marketplace facilitating the
        buying and selling of authenticated sports memorabilia between
        registered users. We act as an intermediary between buyers and sellers,
        providing escrow payment services, verification processes, and dispute
        resolution.
      </p>

      {/* 2. Definitions */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        2. Definitions
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        In these Terms, the following definitions apply:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Platform</strong> — the
          TrustedCollectibles website, mobile applications, and all related
          services and tools provided by TrustedCollectibles Ltd.
        </li>
        <li>
          <strong className="text-white">Buyer</strong> — a registered user who
          purchases or intends to purchase an Item through the Platform.
        </li>
        <li>
          <strong className="text-white">Seller</strong> — a registered user who
          lists or intends to list an Item for sale on the Platform.
        </li>
        <li>
          <strong className="text-white">Item</strong> — any sports memorabilia
          or collectible listed for sale on the Platform.
        </li>
        <li>
          <strong className="text-white">Listing</strong> — an offer by a Seller
          to sell an Item on the Platform, including all associated descriptions,
          images, pricing, and other information.
        </li>
        <li>
          <strong className="text-white">Order</strong> — a confirmed purchase
          of an Item by a Buyer through the Platform.
        </li>
        <li>
          <strong className="text-white">Escrow</strong> — the secure holding of
          Buyer funds by TrustedCollectibles until the conditions for release to
          the Seller have been met.
        </li>
        <li>
          <strong className="text-white">COA</strong> — Certificate of
          Authenticity, a document certifying the genuineness of an Item, issued
          by a recognised authentication provider.
        </li>
        <li>
          <strong className="text-white">Commission</strong> — the fee charged
          by TrustedCollectibles to the Seller upon the successful completion of
          a sale.
        </li>
      </ul>

      {/* 3. Account Registration */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        3. Account Registration
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        To buy or sell on the Platform, you must create an account. By
        registering, you represent and warrant that:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>You are at least 18 years of age.</li>
        <li>
          All information you provide during registration is accurate, current,
          and complete.
        </li>
        <li>
          You will maintain only one account per person. Duplicate accounts may
          be suspended or terminated without notice.
        </li>
        <li>
          You are responsible for maintaining the confidentiality of your account
          credentials and for all activities that occur under your account.
        </li>
        <li>
          You will notify us immediately of any unauthorised use of your account
          or any other breach of security.
        </li>
      </ul>
      <p className="text-gray-400 mb-4 leading-relaxed">
        We reserve the right to suspend or terminate your account at any time if
        we reasonably believe you have violated these Terms or if your account
        poses a risk to the Platform, other users, or third parties.
      </p>

      {/* 4. Buyer Protection */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        4. Buyer Protection
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        TrustedCollectibles is committed to protecting buyers. Our Buyer
        Protection programme includes the following safeguards:
      </p>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        4.1 Item Verification
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        All items listed on the Platform are subject to our verification
        process. Sellers must provide proof of authenticity, including a valid
        Certificate of Authenticity (COA), before a listing is approved. Our
        team reviews listings to ensure descriptions and images are accurate and
        consistent with the claimed item.
      </p>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        4.2 Escrow Payment Protection
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        When you purchase an Item, your payment is held securely in escrow by
        TrustedCollectibles. Funds are not released to the Seller until you have
        received and inspected the Item. This ensures that your money is
        protected throughout the transaction.
      </p>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        4.3 Inspection Period
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Upon receiving your Item, you have <strong className="text-white">48 hours</strong> to
        inspect it and confirm that it matches the Listing description. During
        this period, you may raise a dispute if the Item is not as described,
        damaged, or otherwise unsatisfactory.
      </p>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        4.4 Refund Policy
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        If an Item is found not to be as described, you are entitled to a full
        refund. Refunds are processed back to your original payment method
        within 5&ndash;10 business days of the dispute being resolved in your
        favour.
      </p>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        4.5 Dispute Process
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        To raise a dispute, navigate to your order in your Dashboard and select
        &quot;Raise a Dispute&quot;. You must provide a clear description of the
        issue along with supporting evidence (photographs, documentation, etc.).
        Disputes must be raised within the 3 business day inspection period.
      </p>

      {/* 5. Seller Obligations */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        5. Seller Obligations
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        As a Seller on TrustedCollectibles, you agree to the following
        obligations:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Genuine Items Only</strong> — You must
          only list items that are genuine and authentic. Listing counterfeit,
          replica, or fraudulent items is strictly prohibited and will result in
          immediate account termination.
        </li>
        <li>
          <strong className="text-white">Accurate Descriptions and Photos</strong>{" "}
          — All listing descriptions must be truthful, accurate, and not
          misleading. Photographs must be of the actual Item being sold and must
          accurately represent its condition.
        </li>
        <li>
          <strong className="text-white">Certificate of Authenticity</strong> —
          A genuine COA from a recognised authentication provider must accompany
          every listing. Items without a valid COA will not be approved.
        </li>
        <li>
          <strong className="text-white">Shipping</strong> — You must dispatch
          sold Items within <strong className="text-white">2 working days</strong> of
          receiving an order notification. Items must be packaged securely and
          appropriately for transit.
        </li>
        <li>
          <strong className="text-white">Tracking Information</strong> — You
          must provide accurate tracking information for all dispatched orders.
          Failure to provide tracking may delay the release of funds.
        </li>
        <li>
          <strong className="text-white">No Counterfeit Items</strong> — The
          listing of counterfeit, forged, or misrepresented items is a serious
          violation. We will report such activity to the relevant authorities
          where appropriate.
        </li>
      </ul>

      {/* 6. Prohibited Items */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        6. Prohibited Items
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        The following items are strictly prohibited from being listed on the
        Platform:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          Counterfeit, replica, or forged memorabilia of any kind.
        </li>
        <li>
          Stolen goods or items obtained through illegal means.
        </li>
        <li>
          Items without a valid Certificate of Authenticity from a recognised
          authentication provider.
        </li>
        <li>
          Items that infringe upon the intellectual property rights, trademarks,
          or other proprietary rights of any third party.
        </li>
        <li>
          Any item that violates applicable UK law or regulation.
        </li>
      </ul>
      <p className="text-gray-400 mb-4 leading-relaxed">
        We reserve the right to remove any listing that we believe, in our sole
        discretion, violates these prohibitions, and to suspend or terminate the
        account of the offending Seller.
      </p>

      {/* 7. Commission & Fees */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        7. Commission &amp; Fees
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        TrustedCollectibles charges the following fees:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Platform Commission</strong> — A
          commission of <strong className="text-white">10%</strong> of the sale
          price is charged on all completed sales. This commission is deducted
          from the Seller&apos;s payout.
        </li>
        <li>
          <strong className="text-white">Payment Processing Fees</strong> —
          Stripe payment processing fees of{" "}
          <strong className="text-white">2.9% + 30p</strong> per transaction
          apply. These fees are deducted from the Seller&apos;s payout.
        </li>
        <li>
          <strong className="text-white">Listing Fees</strong> — There are no
          fees to create a listing on the Platform. Listings are free of charge.
        </li>
      </ul>
      <p className="text-gray-400 mb-4 leading-relaxed">
        All fees are deducted automatically from the Seller&apos;s payout upon
        the successful completion of a sale. The Seller receives the sale price
        minus the platform commission and payment processing fees.
      </p>

      {/* 8. Escrow Payment System */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        8. Escrow Payment System
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        TrustedCollectibles operates an escrow payment system to protect both
        Buyers and Sellers. The process works as follows:
      </p>
      <ol className="text-gray-400 mb-4 list-decimal pl-6 space-y-2">
        <li>
          <strong className="text-white">Buyer Payment</strong> — When a Buyer
          purchases an Item, the payment is collected and held securely by
          TrustedCollectibles. The Seller is notified of the order but does not
          receive payment at this stage.
        </li>
        <li>
          <strong className="text-white">Seller Dispatch</strong> — The Seller
          dispatches the Item and provides tracking information. The Buyer is
          notified of the dispatch.
        </li>
        <li>
          <strong className="text-white">Buyer Confirmation</strong> — Upon
          receiving the Item, the Buyer inspects it and confirms delivery through
          the Platform. The escrow funds are then released to the Seller (minus
          applicable fees).
        </li>
        <li>
          <strong className="text-white">Automatic Release</strong> — If the
          Buyer does not confirm delivery or raise a dispute within{" "}
          <strong className="text-white">14 days</strong> of the tracking
          showing delivery, the funds are automatically released to the Seller.
        </li>
        <li>
          <strong className="text-white">Dispute Handling</strong> — If the
          Buyer raises a dispute during the inspection period, the funds remain
          in escrow until the dispute is resolved through our dispute resolution
          process.
        </li>
      </ol>

      {/* 9. Dispute Resolution */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        9. Dispute Resolution
      </h2>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        9.1 Raising a Dispute
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        If you are dissatisfied with an Item you have received, you may raise a
        dispute through the Platform within the 3 business day inspection
        period. To raise a dispute, go to your order history in your Dashboard,
        select the relevant order, and click &quot;Raise a Dispute&quot;. You
        must provide:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>A clear description of the issue.</li>
        <li>
          Photographic evidence showing the problem (e.g., damage, discrepancy
          from listing).
        </li>
        <li>
          Any other supporting documentation relevant to your claim.
        </li>
      </ul>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        9.2 Investigation Process
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Our dispute resolution team will review the dispute within{" "}
        <strong className="text-white">5 business days</strong> of it being
        raised. During the investigation, we may contact both the Buyer and
        Seller for additional information. Both parties are expected to
        cooperate fully with the investigation.
      </p>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        9.3 Possible Outcomes
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Following our investigation, the dispute may result in one of the
        following outcomes:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Full Refund to Buyer</strong> — The
          Buyer receives a complete refund and is required to return the Item to
          the Seller at the Seller&apos;s expense.
        </li>
        <li>
          <strong className="text-white">Partial Refund</strong> — A partial
          refund is issued to the Buyer, with the remaining funds released to
          the Seller. This may apply where the Item has minor discrepancies from
          the listing.
        </li>
        <li>
          <strong className="text-white">Release to Seller</strong> — The full
          funds are released to the Seller if the dispute is found to be without
          merit.
        </li>
      </ul>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        9.4 Right to Appeal
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Either party may appeal the outcome of a dispute within 7 days of the
        decision. Appeals must include new evidence or information not
        previously considered. The appeal decision is final.
      </p>

      {/* 10. Intellectual Property */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        10. Intellectual Property
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        All content on the Platform, including but not limited to text, graphics,
        logos, icons, images, software, and the compilation thereof, is the
        property of TrustedCollectibles Ltd or its content suppliers and is
        protected by United Kingdom and international copyright and intellectual
        property laws.
      </p>
      <p className="text-gray-400 mb-4 leading-relaxed">
        By posting content on the Platform (including listing descriptions,
        images, and reviews), you grant TrustedCollectibles a non-exclusive,
        worldwide, royalty-free licence to use, reproduce, modify, adapt, publish,
        and display such content in connection with the operation and promotion of
        the Platform.
      </p>
      <p className="text-gray-400 mb-4 leading-relaxed">
        If you believe that content on the Platform infringes your intellectual
        property rights, please contact us at{" "}
        <strong className="text-white">support@trustedcollectibles.com</strong>{" "}
        with details of the alleged infringement. We will investigate and, where
        appropriate, remove the infringing content in accordance with applicable
        law.
      </p>

      {/* 11. Limitation of Liability */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        11. Limitation of Liability
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        TrustedCollectibles acts as an intermediary between Buyers and Sellers.
        While we take reasonable steps to verify listings and authenticate items,
        we do not guarantee the authenticity, quality, safety, or legality of any
        Item listed on the Platform beyond our stated verification processes.
      </p>
      <p className="text-gray-400 mb-4 leading-relaxed">
        To the maximum extent permitted by law, TrustedCollectibles shall not be
        liable for any indirect, incidental, special, consequential, or punitive
        damages, or any loss of profits or revenues, whether incurred directly or
        indirectly, or any loss of data, use, goodwill, or other intangible
        losses resulting from:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>Your use of or inability to use the Platform.</li>
        <li>
          Any conduct or content of any third party on the Platform, including
          other users.
        </li>
        <li>Unauthorised access to or alteration of your data.</li>
        <li>Any other matter relating to the Platform.</li>
      </ul>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Nothing in these Terms shall exclude or limit our liability for death or
        personal injury caused by our negligence, fraud or fraudulent
        misrepresentation, or any other liability that cannot be excluded or
        limited under English law.
      </p>

      {/* 12. Governing Law */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        12. Governing Law
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        These Terms shall be governed by and construed in accordance with the
        laws of England and Wales. Any disputes arising out of or in connection
        with these Terms, including any question regarding their existence,
        validity, or termination, shall be subject to the exclusive jurisdiction
        of the courts of England and Wales.
      </p>
      <p className="text-gray-400 mb-4 leading-relaxed">
        If you are a consumer, you will benefit from any mandatory provisions of
        the law of the country in which you are resident. Nothing in these Terms
        affects your rights as a consumer to rely on such mandatory provisions of
        local law.
      </p>

      {/* 13. Changes to Terms */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        13. Changes to Terms
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        We reserve the right to update or modify these Terms at any time. When we
        make changes, we will update the &quot;Last updated&quot; date at the top
        of this page and, where appropriate, notify you by email or through a
        prominent notice on the Platform.
      </p>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Your continued use of the Platform after any changes to these Terms
        constitutes your acceptance of the revised Terms. If you do not agree to
        the updated Terms, you must stop using the Platform and close your
        account.
      </p>

      {/* 14. Contact */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        14. Contact
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        If you have any questions about these Terms, please contact us at:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Email:</strong>{" "}
          support@trustedcollectibles.com
        </li>
        <li>
          <strong className="text-white">Company:</strong>{" "}
          TrustedCollectibles Ltd
        </li>
        <li>
          <strong className="text-white">Registered in:</strong> England and
          Wales
        </li>
      </ul>
    </div>
  );
}
