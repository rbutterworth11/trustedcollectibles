import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Join TrustedCollectibles — the marketplace for authenticated sports memorabilia. Create a free account to start buying or selling verified collectibles.",
  alternates: { canonical: `${SITE_URL}/register` },
  openGraph: {
    title: "Create Account | TrustedCollectibles",
    description:
      "Join the trusted marketplace for authenticated sports memorabilia. Buy and sell verified collectibles with escrow protection.",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
