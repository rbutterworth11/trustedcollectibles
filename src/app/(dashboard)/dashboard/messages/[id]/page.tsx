import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatView from "@/components/dashboard/chat-view";

export const dynamic = "force-dynamic";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: conversation } = await supabase
    .from("conversations")
    .select(
      "*, listing:listings(id, title, images), buyer:profiles!conversations_buyer_id_fkey(id, full_name, email), seller:profiles!conversations_seller_id_fkey(id, full_name, email)"
    )
    .eq("id", id)
    .single();

  if (!conversation) notFound();

  // Verify the user is a participant
  if (
    conversation.buyer_id !== user.id &&
    conversation.seller_id !== user.id
  ) {
    notFound();
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  // Mark unread messages as read
  await supabase
    .from("messages")
    .update({ read: true })
    .eq("conversation_id", id)
    .neq("sender_id", user.id)
    .eq("read", false);

  const otherParty =
    user.id === conversation.buyer_id
      ? (conversation.seller as { id: string; full_name: string; email: string })
      : (conversation.buyer as { id: string; full_name: string; email: string });

  const listing = conversation.listing as {
    id: string;
    title: string;
    images: string[];
  } | null;

  return (
    <ChatView
      conversationId={id}
      currentUserId={user.id}
      otherPartyName={otherParty?.full_name || otherParty?.email || "User"}
      otherPartyId={otherParty?.id || ""}
      listingTitle={listing?.title || "Listing"}
      listingId={listing?.id || ""}
      initialMessages={messages ?? []}
    />
  );
}
