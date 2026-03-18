import Link from "next/link";

const marketplaceLinks = [
  { label: "Browse All", href: "/marketplace" },
  { label: "Football", href: "/marketplace?category=football" },
  { label: "Boxing", href: "/marketplace?category=boxing" },
  { label: "Rugby", href: "/marketplace?category=rugby" },
  { label: "Cricket", href: "/marketplace?category=cricket" },
  { label: "Sell an Item", href: "/dashboard/listings/new" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

const legalLinks = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-brand-card">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-brand-amber text-sm font-bold text-brand-amber">
                TC
              </span>
              <span className="text-lg font-bold text-white">
                Trusted<span className="text-brand-amber">Collectibles</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              The trusted marketplace for authenticated sports memorabilia.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Marketplace
            </h3>
            <ul className="space-y-3">
              {marketplaceLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-brand-amber"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-brand-amber"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-brand-amber"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            &copy; 2024 TrustedCollectibles. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
