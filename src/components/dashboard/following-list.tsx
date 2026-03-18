"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { FollowedSeller } from "@/types";

export default function FollowingList({
  sellers,
}: {
  sellers: FollowedSeller[];
}) {
  const router = useRouter();

  async function handleUnfollow(id: string) {
    const supabase = createClient();
    await supabase.from("followed_sellers").delete().eq("id", id);
    router.refresh();
  }

  if (sellers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/[0.07] p-12 text-center">
        <p className="text-sm text-gray-500">
          You&apos;re not following any sellers yet.
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Follow sellers from their profile or listing pages.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sellers.map((follow) => (
        <div
          key={follow.id}
          className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-brand-card p-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-amber text-lg font-bold text-brand-dark">
              {(follow.seller?.full_name || follow.seller?.email || "?")
                .charAt(0)
                .toUpperCase()}
            </span>
            <div>
              <p className="font-medium text-white">
                {follow.seller?.full_name || "Seller"}
              </p>
              <p className="text-xs text-gray-400">
                {follow.seller?.email}
              </p>
              <p className="text-xs text-gray-400">
                Member since{" "}
                {new Date(
                  follow.seller?.created_at ?? follow.created_at
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleUnfollow(follow.id)}
            className="rounded-md border border-white/[0.07] px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/5"
          >
            Unfollow
          </button>
        </div>
      ))}
    </div>
  );
}
