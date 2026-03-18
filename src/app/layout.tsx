import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CurrencyProvider } from "@/lib/currency";
import AnnouncementBar from "@/components/layout/announcement-bar";
import MaintenanceNotice from "@/components/layout/maintenance-notice";
import { createClient } from "@/lib/supabase/server";
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch announcement bar and maintenance notice
  type AnnouncementData = { text: string; link?: string; bg_color?: string; text_color?: string };
  type MaintenanceData = { text: string; type?: "info" | "warning" | "error" };
  let announcement: AnnouncementData | null = null;
  let maintenance: MaintenanceData | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_content")
      .select("key, value, enabled")
      .in("key", ["announcement_bar", "maintenance_notice"]);

    for (const row of data ?? []) {
      if (!row.enabled) continue;
      const v = row.value as Record<string, unknown>;
      if (row.key === "announcement_bar" && v.text) {
        announcement = v as unknown as AnnouncementData;
      }
      if (row.key === "maintenance_notice" && v.text) {
        maintenance = v as unknown as MaintenanceData;
      }
    }
  } catch {
    // Silently fail if table doesn't exist
  }
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
        <CurrencyProvider>
          {announcement && (
            <AnnouncementBar
              text={announcement.text}
              link={announcement.link}
              bgColor={announcement.bg_color}
              textColor={announcement.text_color}
            />
          )}
          {maintenance && (
            <MaintenanceNotice
              text={maintenance.text}
              type={maintenance.type}
            />
          )}
          <Header />
          {children}
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
