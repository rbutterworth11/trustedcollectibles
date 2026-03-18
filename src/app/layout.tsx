import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/layout/header";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrustedCollectibles — Authenticated Sports Memorabilia",
  description:
    "The marketplace for verified, authenticated sports memorabilia. Buy and sell with confidence through escrow-protected payments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.className} bg-brand-dark text-white antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
