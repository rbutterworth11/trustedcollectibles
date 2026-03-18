import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "GDPR-compliant privacy policy for TrustedCollectibles. Learn how we collect, use, and protect your personal data including names, emails, addresses, and payment information.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: March 2024</p>

      {/* 1. Introduction */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        1. Introduction
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        TrustedCollectibles Ltd (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
        is the data controller responsible for your personal data. We are
        committed to protecting your privacy and handling your data in an open
        and transparent manner.
      </p>
      <p className="text-gray-400 mb-4 leading-relaxed">
        This Privacy Policy explains how we collect, use, store, and share your
        personal information when you use the TrustedCollectibles platform
        (&quot;Platform&quot;). It also describes your rights under the UK
        General Data Protection Regulation (UK GDPR) and the Data Protection
        Act 2018.
      </p>
      <p className="text-gray-400 mb-4 leading-relaxed">
        TrustedCollectibles Ltd is registered with the Information
        Commissioner&apos;s Office (ICO) as a data controller. If you have any
        questions about this Privacy Policy, please contact us using the details
        provided in the Contact section below.
      </p>

      {/* 2. Data We Collect */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        2. Data We Collect
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        We collect the following categories of personal data:
      </p>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        2.1 Account Data
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        When you register for an account, we collect your full name, email
        address, and password. If you sign up using a third-party provider
        (e.g., Google), we receive your name and email from that provider.
      </p>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        2.2 Profile Data
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Information you add to your profile, such as a display name, profile
        picture, bio, and seller verification details.
      </p>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        2.3 Transaction Data
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Details of purchases, sales, order history, dispute records, and
        communication between buyers and sellers conducted through the Platform.
      </p>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        2.4 Payment Data
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Payment transactions are processed securely by our payment partner,
        Stripe. <strong className="text-white">We do not store your credit or
        debit card numbers.</strong> Stripe collects and processes your payment
        card information directly. We receive only transaction confirmation
        details, amounts, and the last four digits of your card for reference.
      </p>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        2.5 Shipping Addresses
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Delivery addresses you provide for orders are stored to facilitate
        shipping and for order history purposes.
      </p>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        2.6 Communications
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Records of communications between you and other users through the
        Platform messaging system, as well as any correspondence between you and
        our support team.
      </p>
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        2.7 Device and Usage Data
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        We automatically collect certain technical information when you visit the
        Platform, including your IP address, browser type and version, operating
        system, referring URL, pages visited, time spent on pages, and other
        diagnostic data.
      </p>

      {/* 3. How We Use Your Data */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        3. How We Use Your Data
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        We use your personal data for the following purposes:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Account Management</strong> — To
          create, maintain, and secure your account, and to verify your identity.
        </li>
        <li>
          <strong className="text-white">Transaction Processing</strong> — To
          facilitate purchases, sales, escrow payments, payouts, and refunds.
        </li>
        <li>
          <strong className="text-white">Communication</strong> — To send you
          order confirmations, shipping notifications, dispute updates, and
          other service-related communications.
        </li>
        <li>
          <strong className="text-white">Security</strong> — To detect and
          prevent fraud, abuse, and security incidents, and to protect the
          integrity of the Platform.
        </li>
        <li>
          <strong className="text-white">Legal Obligations</strong> — To comply
          with applicable laws, regulations, and legal processes, including tax
          reporting and anti-money laundering requirements.
        </li>
        <li>
          <strong className="text-white">Marketing</strong> — To send you
          promotional communications about new features, listings, or offers,
          but only where you have given us your explicit opt-in consent. You can
          unsubscribe at any time.
        </li>
      </ul>

      {/* 4. Legal Basis for Processing */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        4. Legal Basis for Processing (GDPR Article 6)
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        We process your personal data on the following legal bases:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Contract Performance</strong> —
          Processing is necessary for the performance of a contract with you
          (e.g., facilitating purchases, managing your account, processing
          payments).
        </li>
        <li>
          <strong className="text-white">Legitimate Interests</strong> —
          Processing is necessary for our legitimate interests, such as
          improving the Platform, preventing fraud, and ensuring security,
          provided these interests are not overridden by your data protection
          rights.
        </li>
        <li>
          <strong className="text-white">Consent</strong> — Where you have
          given us specific consent, such as for marketing communications. You
          may withdraw consent at any time.
        </li>
        <li>
          <strong className="text-white">Legal Obligation</strong> — Processing
          is necessary for compliance with a legal obligation to which we are
          subject, such as tax reporting and regulatory requirements.
        </li>
      </ul>

      {/* 5. Data Sharing */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        5. Data Sharing
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        We may share your personal data with the following categories of
        recipients:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Stripe</strong> — Our payment
          processor. Stripe processes your payment information in accordance
          with their own privacy policy.
        </li>
        <li>
          <strong className="text-white">Supabase</strong> — Our hosting and
          database infrastructure provider. Data is stored securely on
          Supabase&apos;s infrastructure.
        </li>
        <li>
          <strong className="text-white">Shipping Carriers</strong> — Your name
          and delivery address are shared with shipping carriers to fulfil
          orders.
        </li>
        <li>
          <strong className="text-white">Law Enforcement</strong> — We may
          disclose your data when required to do so by law, regulation, or legal
          process, or when we believe disclosure is necessary to protect our
          rights, your safety, or the safety of others.
        </li>
      </ul>
      <p className="text-gray-400 mb-4 leading-relaxed">
        <strong className="text-white">
          We do not sell your personal data to third parties.
        </strong>{" "}
        We will never share your information with advertisers or data brokers.
      </p>

      {/* 6. Data Retention */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        6. Data Retention
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        We retain your personal data only for as long as is necessary to fulfil
        the purposes for which it was collected:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Account Data</strong> — Retained while
          your account is active and for 6 years after account closure, in
          accordance with the Limitation Act 1980.
        </li>
        <li>
          <strong className="text-white">Transaction Records</strong> —
          Retained for 7 years after the transaction date, as required by HMRC
          for tax and accounting purposes.
        </li>
        <li>
          <strong className="text-white">Marketing Consent</strong> — Retained
          until you withdraw your consent. You can unsubscribe at any time using
          the link in our emails or by contacting us.
        </li>
        <li>
          <strong className="text-white">Device and Usage Data</strong> —
          Retained for up to 26 months for analytics purposes.
        </li>
      </ul>

      {/* 7. Your Rights */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        7. Your Rights (GDPR)
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Under the UK GDPR, you have the following rights regarding your personal
        data:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Right of Access</strong> — You have the
          right to request a copy of the personal data we hold about you.
        </li>
        <li>
          <strong className="text-white">Right to Rectification</strong> — You
          have the right to request that we correct any inaccurate or incomplete
          personal data.
        </li>
        <li>
          <strong className="text-white">Right to Erasure</strong> — You have
          the right to request that we delete your personal data, subject to
          certain legal exceptions (e.g., data retained for legal obligations).
        </li>
        <li>
          <strong className="text-white">Right to Restriction</strong> — You
          have the right to request that we restrict the processing of your
          personal data in certain circumstances.
        </li>
        <li>
          <strong className="text-white">Right to Data Portability</strong> —
          You have the right to receive your personal data in a structured,
          commonly used, and machine-readable format.
        </li>
        <li>
          <strong className="text-white">Right to Object</strong> — You have
          the right to object to the processing of your personal data for
          certain purposes, including direct marketing.
        </li>
        <li>
          <strong className="text-white">Right to Withdraw Consent</strong> —
          Where processing is based on consent, you may withdraw that consent at
          any time without affecting the lawfulness of processing carried out
          prior to withdrawal.
        </li>
        <li>
          <strong className="text-white">Right to Lodge a Complaint</strong> —
          You have the right to lodge a complaint with the Information
          Commissioner&apos;s Office (ICO) if you believe your data protection
          rights have been violated. You can contact the ICO at{" "}
          <strong className="text-white">ico.org.uk</strong>.
        </li>
      </ul>
      <p className="text-gray-400 mb-4 leading-relaxed">
        To exercise any of these rights, please contact us at{" "}
        <strong className="text-white">privacy@trustedcollectibles.com</strong>.
        We will respond to your request within one month, as required by law.
      </p>

      {/* 8. Cookies */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        8. Cookies
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        We use cookies and similar technologies on the Platform. For detailed
        information about the cookies we use, why we use them, and how you can
        manage your cookie preferences, please see our{" "}
        <a
          href="/cookies"
          className="text-brand-amber hover:text-brand-amber-hover underline"
        >
          Cookie Policy
        </a>
        .
      </p>

      {/* 9. International Transfers */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        9. International Transfers
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Your personal data may be transferred to, and processed in, countries
        outside the United Kingdom. Where data is transferred internationally,
        we ensure appropriate safeguards are in place:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          Data is processed in countries that the UK government has deemed to
          provide an adequate level of data protection.
        </li>
        <li>
          <strong className="text-white">Supabase</strong> — Our database
          infrastructure provider operates servers in the United States. Data
          transfers to Supabase are protected by Standard Contractual Clauses
          (SCCs) approved by the European Commission and recognised under UK
          data protection law.
        </li>
        <li>
          <strong className="text-white">Stripe</strong> — Payment data is
          processed by Stripe, which operates globally and maintains compliance
          with applicable data protection frameworks.
        </li>
      </ul>

      {/* 10. Data Security */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        10. Data Security
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        We take the security of your personal data seriously and implement
        appropriate technical and organisational measures to protect it,
        including:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Encryption</strong> — All data is
          encrypted in transit using TLS/SSL and at rest where applicable.
        </li>
        <li>
          <strong className="text-white">Access Controls</strong> — Access to
          personal data is restricted to authorised personnel only, on a
          need-to-know basis.
        </li>
        <li>
          <strong className="text-white">Regular Audits</strong> — We conduct
          regular security audits and assessments to identify and address
          potential vulnerabilities.
        </li>
        <li>
          <strong className="text-white">Incident Response</strong> — We
          maintain procedures for detecting, reporting, and investigating
          personal data breaches in accordance with our obligations under the UK
          GDPR.
        </li>
      </ul>

      {/* 11. Children */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        11. Children
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        The Platform is not intended for use by individuals under the age of 18.
        We do not knowingly collect personal data from children under 18. If we
        become aware that we have collected personal data from a child under 18,
        we will take steps to delete that information as soon as possible. If
        you believe we have inadvertently collected data from a minor, please
        contact us immediately.
      </p>

      {/* 12. Changes */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        12. Changes to This Privacy Policy
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        We may update this Privacy Policy from time to time to reflect changes
        in our practices, technology, legal requirements, or other factors. When
        we make material changes, we will notify you by email or by posting a
        prominent notice on the Platform prior to the changes taking effect.
      </p>
      <p className="text-gray-400 mb-4 leading-relaxed">
        We encourage you to review this Privacy Policy periodically to stay
        informed about how we are protecting your data. The &quot;Last
        updated&quot; date at the top of this page indicates when this Privacy
        Policy was last revised.
      </p>

      {/* 13. Contact */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        13. Contact
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        If you have any questions about this Privacy Policy or wish to exercise
        your data protection rights, please contact our Data Protection Officer:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Email:</strong>{" "}
          privacy@trustedcollectibles.com
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
      <p className="text-gray-400 mb-4 leading-relaxed">
        If you are not satisfied with our response, you have the right to lodge
        a complaint with the Information Commissioner&apos;s Office (ICO):
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Website:</strong>{" "}
          <a
            href="https://ico.org.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-amber hover:text-brand-amber-hover underline"
          >
            ico.org.uk
          </a>
        </li>
        <li>
          <strong className="text-white">Telephone:</strong> 0303 123 1113
        </li>
      </ul>
    </div>
  );
}
