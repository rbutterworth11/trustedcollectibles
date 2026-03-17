"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Profile } from "@/types";

const sellerNav = [
  { href: "/dashboard", label: "Overview", icon: "grid" },
  { href: "/dashboard/listings", label: "My Listings", icon: "tag" },
  { href: "/dashboard/orders", label: "Orders", icon: "package" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

const buyerNav = [
  { href: "/dashboard", label: "Overview", icon: "grid" },
  { href: "/dashboard/orders", label: "My Orders", icon: "package" },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: "heart" },
  { href: "/dashboard/following", label: "Following", icon: "users" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

const icons: Record<string, React.ReactNode> = {
  grid: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  tag: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  package: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  heart: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  users: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  settings: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export default function DashboardShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSeller = profile.role === "seller" || profile.role === "admin";
  const nav = isSeller ? sellerNav : buyerNav;

  return (
    <div className="flex min-h-[calc(100vh-65px)]">
      <aside className="w-56 shrink-0 border-r bg-gray-50">
        <div className="px-4 py-6">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {isSeller ? "Seller" : "Buyer"} Dashboard
          </div>
          <p className="truncate text-sm font-medium text-gray-900">
            {profile.full_name || profile.email}
          </p>
        </div>
        <nav className="space-y-1 px-2">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {icons[item.icon]}
                {item.label}
              </Link>
            );
          })}
        </nav>
        {isSeller && (
          <div className="mt-6 px-4">
            <Link
              href="/dashboard/listings/new"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Listing
            </Link>
          </div>
        )}
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
