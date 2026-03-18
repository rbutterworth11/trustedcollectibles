import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ConversationList from "@/components/dashboard/conversation-list";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: conversations } = await supabase
    .from("conversations")
    .select(
      "*, listing:listings(id, title, images), buyer:profiles!conversations_buyer_id_fkey(id, full_name, email), seller:profiles!conversations_seller_id_fkey(id, full_name, email)"
    )
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("updated_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Messages</h1>
      <p className="mt-1 text-sm text-gray-400">
        Conversations with buyers and sellers.
      </p>
      <div className="mt-6">
        <ConversationList
          conversations={conversations ?? []}
          currentUserId={user.id}
        />
      </div>
    </div>
  );
}
