import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/content", label: "Homepage" },
  { href: "/admin/trending", label: "Trending" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/auth-requests", label: "Auth Checks" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-65px)] bg-brand-dark">
      <div className="border-b border-white/[0.07] bg-brand-card">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center gap-6 overflow-x-auto">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-amber shrink-0">
            Admin
          </span>
          <nav className="flex gap-1 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-md px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/5 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
