"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import NotificationBell from "@/components/layout/notification-bell";
import CurrencySelector from "@/components/layout/currency-selector";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/marketplace?q=${encodeURIComponent(q)}`);
    setSearchQuery("");
    setMobileMenuOpen(false);
  }

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        setFullName(user.user_metadata?.full_name || user.email || "");
        supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()
          .then(({ data }) => setIsAdmin(data?.role === "admin"));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setFullName(
          currentUser.user_metadata?.full_name || currentUser.email || ""
        );
        supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single()
          .then(({ data }) => setIsAdmin(data?.role === "admin"));
      } else {
        setFullName("");
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-white/[0.07] bg-brand-dark md:sticky md:top-0 md:z-30">
      {/* ===== DESKTOP NAV (md+) ===== */}
      <nav className="hidden md:flex items-center gap-6 px-8 py-3">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-brand-amber text-sm font-bold text-brand-amber">
            TC
          </span>
          <span className="text-lg font-bold text-white">
            Trusted<span className="text-brand-amber">Collectibles</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memorabilia..."
            className="w-full rounded-full border border-white/[0.07] bg-white/5 py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-gray-500 transition-colors focus:border-brand-amber/50 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-brand-amber/50"
          />
        </form>

        <div className="flex shrink-0 items-center gap-4">
          <Link
            href="/marketplace"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            Browse
          </Link>

          <CurrencySelector />

          {user && (
            <Link
              href="/dashboard/listings/new"
              className="rounded-md bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-amber-hover"
            >
              Sell
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <NotificationBell userId={user.id} />
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 rounded-md border border-white/[0.07] px-3 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-white/20 hover:bg-white/5"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-amber text-xs font-bold text-brand-dark">
                    {fullName.charAt(0).toUpperCase()}
                  </span>
                  {fullName.split(" ")[0]}
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-white/[0.07] bg-brand-card py-1 shadow-xl">
                      <Link
                        href="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/listings"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        My Listings
                      </Link>
                      <Link
                        href="/dashboard/orders"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        Orders
                      </Link>
                      <Link
                        href="/dashboard/messages"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        Messages
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        Settings
                      </Link>
                      {isAdmin && (
                        <>
                          <hr className="my-1 border-white/[0.07]" />
                          <Link
                            href="/admin"
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-2 text-sm font-medium text-brand-amber hover:bg-white/5"
                          >
                            Admin Panel
                          </Link>
                        </>
                      )}
                      <hr className="my-1 border-white/[0.07]" />
                      <button
                        onClick={handleSignOut}
                        className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/5"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-amber-hover"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* ===== MOBILE NAV (<md) ===== */}
      <div className="md:hidden">
        {/* Top row: logo, hamburger, notification bell, avatar/sign-in */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex shrink-0 items-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-brand-amber text-sm font-bold text-brand-amber">
              TC
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {user && <NotificationBell userId={user.id} />}

            {user ? (
              <Link
                href="/dashboard"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-amber text-xs font-bold text-brand-dark"
              >
                {fullName.charAt(0).toUpperCase()}
              </Link>
            ) : (
              <Link
                href="/login"
                className="min-h-[44px] flex items-center rounded-md px-3 text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Sign In
              </Link>
            )}

            {/* Hamburger / X button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-[44px] w-[44px] items-center justify-center rounded-md text-gray-300 hover:bg-white/5 hover:text-white"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar — always visible */}
        <form onSubmit={handleSearch} className="px-4 pb-3">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memorabilia..."
              className="w-full rounded-full border border-white/[0.07] bg-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder:text-gray-500 transition-colors focus:border-brand-amber/50 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-brand-amber/50"
            />
          </div>
        </form>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="bg-brand-card border-b border-white/[0.07]">
            <nav className="flex flex-col px-4 py-2">
              <Link
                href="/marketplace"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center text-sm font-medium text-gray-300 hover:text-white"
              >
                Browse
              </Link>

              <div className="min-h-[44px] flex items-center">
                <CurrencySelector />
              </div>

              {user && (
                <Link
                  href="/dashboard/listings/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] flex items-center text-sm font-semibold text-brand-amber hover:text-brand-amber-hover"
                >
                  Sell
                </Link>
              )}

              {user && (
                <>
                  <hr className="my-1 border-white/[0.07]" />
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] flex items-center text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/listings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] flex items-center text-sm font-medium text-gray-300 hover:text-white"
                  >
                    My Listings
                  </Link>
                  <Link
                    href="/dashboard/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] flex items-center text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/dashboard/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] flex items-center text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Messages
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] flex items-center text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Settings
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <hr className="my-1 border-white/[0.07]" />
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] flex items-center text-sm font-medium text-brand-amber hover:bg-white/5"
                  >
                    Admin Panel
                  </Link>
                </>
              )}

              {user && (
                <>
                  <hr className="my-1 border-white/[0.07]" />
                  <button
                    onClick={handleSignOut}
                    className="min-h-[44px] flex items-center text-sm font-medium text-red-400 hover:bg-white/5"
                  >
                    Sign Out
                  </button>
                </>
              )}

              {!user && (
                <>
                  <hr className="my-1 border-white/[0.07]" />
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] flex items-center text-sm font-semibold text-brand-amber hover:text-brand-amber-hover"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
