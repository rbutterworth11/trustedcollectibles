import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with TrustedCollectibles. Contact our team for questions about authentication, orders, selling, or general enquiries.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Contact Us</h1>
        <p className="text-gray-400 text-lg">
          Have a question or need help? We&apos;d love to hear from you.
        </p>
      </div>

      <ContactForm />
    </div>
  );
}
