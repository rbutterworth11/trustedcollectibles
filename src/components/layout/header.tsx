"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import NotificationBell from "@/components/layout/notification-bell";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-white/[0.07] bg-brand-dark">
      <nav className="flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-brand-amber text-sm font-bold text-brand-amber">
            TC
          </span>
          <span className="text-lg font-bold text-white">
            Trusted<span className="text-brand-amber">Collectibles</span>
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/marketplace"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            Browse
          </Link>

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
    </header>
  );
}
