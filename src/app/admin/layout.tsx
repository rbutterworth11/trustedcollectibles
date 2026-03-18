import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-65px)] bg-brand-dark">
      <div className="border-b border-white/[0.07] bg-brand-card">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-amber">
            Admin
          </span>
          <nav className="flex gap-4 text-sm">
            <Link
              href="/admin"
              className="text-gray-300 hover:text-white font-medium"
            >
              Review Queue
            </Link>
            <Link
              href="/admin?filter=flagged"
              className="text-gray-300 hover:text-white font-medium"
            >
              Flagged
            </Link>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
