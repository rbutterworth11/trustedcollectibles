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
    <header className="border-b bg-white">
      <nav className="flex items-center justify-between px-8 py-4">
        <Link href="/" className="text-xl font-bold">
          TrustedCollectibles
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/marketplace"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Marketplace
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
            <NotificationBell userId={user.id} />
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white">
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
                  <div className="absolute right-0 z-20 mt-2 w-48 rounded-md border bg-white py-1 shadow-lg">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/listings"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Listings
                    </Link>
                    <Link
                      href="/dashboard/orders"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    {isAdmin && (
                      <>
                        <hr className="my-1" />
                        <Link
                          href="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-red-700 font-medium hover:bg-gray-100"
                        >
                          Admin Panel
                        </Link>
                      </>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
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
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
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
