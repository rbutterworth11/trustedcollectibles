import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Custom Services",
  description:
    "Professional custom services for your sports memorabilia — framing, display cases, and professional photography. Coming soon to TrustedCollectibles.",
  alternates: { canonical: `${SITE_URL}/custom-services` },
};

const services = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
      </svg>
    ),
    title: "Professional Framing",
    description:
      "Museum-quality framing for signed jerseys, photos, and prints. Choose from a range of frame styles, matting options, and UV-protective glass to showcase your memorabilia.",
    features: ["UV-protective glass", "Acid-free matting", "Custom sizing", "Wall-ready mounting"],
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
      </svg>
    ),
    title: "Display Cases",
    description:
      "Premium display cases for balls, helmets, bats, gloves, and other 3D memorabilia. Protect your collection while showing it off with custom-built acrylic and wood cases.",
    features: ["Acrylic & wood options", "Built-in lighting", "Stackable designs", "Dust-proof seals"],
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
    title: "Professional Photography",
    description:
      "High-quality product photography of your memorabilia. Perfect for sellers who want their listings to stand out, or collectors who want to document their collection.",
    features: ["Studio lighting", "Multiple angles", "Detail close-ups", "Digital delivery"],
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: "Restoration & Preservation",
    description:
      "Expert restoration and preservation services for vintage memorabilia. From cleaning and flattening vintage cards to restoring faded autographs and stabilising aging materials.",
    features: ["Vintage card restoration", "Autograph preservation", "Climate-controlled storage tips", "Archival materials"],
  },
];

export default function CustomServicesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-amber/10">
          <svg className="h-8 w-8 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17l-5.657-5.657A8.018 8.018 0 013 4.5V3h3.75a8.018 8.018 0 015.01 1.763l5.657 5.657m-12.84 12.84l5.657-5.657m6.182-6.182l3.54-3.54a1.5 1.5 0 00-2.122-2.122l-3.54 3.54m0 0l3.54 3.54" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Custom Services</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Professional services to help you display, protect, and showcase your
          sports memorabilia collection.
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="mb-10 rounded-xl border border-brand-amber/20 bg-brand-amber/5 p-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-amber/10 px-4 py-1.5 text-sm font-medium text-brand-amber mb-3">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Coming Soon
        </div>
        <p className="text-gray-300">
          We&apos;re partnering with trusted professionals to bring you premium memorabilia services.
          Register your interest below to be the first to know when we launch.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 mb-12">
        {services.map((service) => (
          <div
            key={service.title}
            className="rounded-lg border border-white/[0.07] bg-brand-card p-6 opacity-90"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-amber/10 text-brand-amber">
              {service.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{service.description}</p>
            <ul className="space-y-1.5">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="h-3.5 w-3.5 text-brand-amber/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Interest Registration */}
      <div className="mb-12 rounded-lg border border-white/[0.07] bg-brand-card p-6 md:p-8 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Interested?</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-lg mx-auto">
          We&apos;re building out our custom services offering. Get in touch and let us know
          what services you&apos;d find most valuable.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-md bg-brand-amber px-6 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover"
        >
          Contact Us
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      {/* Back to marketplace */}
      <div className="text-center">
        <Link
          href="/marketplace"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          &larr; Back to Marketplace
        </Link>
      </div>
    </div>
  );
}
