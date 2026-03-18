import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "TrustedCollectibles — Buy & Sell Authenticated Sports Memorabilia",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "The trusted marketplace for authenticated sports memorabilia. Buy signed shirts, verified autographs, game-worn items, and rare collectibles with escrow-protected payments and expert verification.",
  keywords: [
    "authenticated sports memorabilia",
    "buy signed shirts",
    "verified autographs",
    "signed jerseys",
    "sports collectibles",
    "autographed memorabilia",
    "COA authenticated",
    "buy memorabilia online",
    "signed sports cards",
    "game-worn items",
    "escrow payment",
    "trusted collectibles marketplace",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title:
      "TrustedCollectibles — Buy & Sell Authenticated Sports Memorabilia",
    description:
      "The trusted marketplace for authenticated sports memorabilia. Buy signed shirts, verified autographs, and rare collectibles with escrow-protected payments.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "TrustedCollectibles — Authenticated Sports Memorabilia Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "TrustedCollectibles — Buy & Sell Authenticated Sports Memorabilia",
    description:
      "The trusted marketplace for authenticated sports memorabilia. Expert verification, escrow payments, buyer protection.",
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "The trusted marketplace for authenticated sports memorabilia.",
    sameAs: [],
  };

  return (
    <html lang="en">
      <body
        className={`${plusJakarta.className} bg-brand-dark text-white antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
