"use client";

import Link from "next/link";
import type { Profile, Listing } from "@/types";

interface ConversationItem {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  updated_at: string;
  listing: Pick<Listing, "id" | "title" | "images"> | null;
  buyer: Pick<Profile, "id" | "full_name" | "email"> | null;
  seller: Pick<Profile, "id" | "full_name" | "email"> | null;
}

export default function ConversationList({
  conversations,
  currentUserId,
}: {
  conversations: ConversationItem[];
  currentUserId: string;
}) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/[0.07] p-12 text-center">
        <p className="text-sm text-gray-500">No conversations yet.</p>
        <p className="mt-1 text-xs text-gray-400">
          Start a conversation from a listing page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => {
        const otherParty =
          currentUserId === conv.buyer_id ? conv.seller : conv.buyer;
        return (
          <Link
            key={conv.id}
            href={`/dashboard/messages/${conv.id}`}
            className="flex items-center gap-4 rounded-lg border border-white/[0.07] bg-brand-card p-4 transition-colors hover:bg-white/5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-amber text-sm font-bold text-brand-dark">
              {(otherParty?.full_name || otherParty?.email || "?")
                .charAt(0)
                .toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-medium text-white">
                  {otherParty?.full_name || otherParty?.email || "User"}
                </p>
                <span className="shrink-0 text-xs text-gray-400">
                  {new Date(conv.updated_at).toLocaleDateString()}
                </span>
              </div>
              <p className="truncate text-xs text-gray-400">
                Re: {conv.listing?.title || "Listing"}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
