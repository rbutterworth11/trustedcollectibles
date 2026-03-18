"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface MessageItem {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date: string) {
  const d = new Date(date);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString();
}

export default function ChatView({
  conversationId,
  currentUserId,
  otherPartyName,
  otherPartyId,
  listingTitle,
  listingId,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  otherPartyName: string;
  otherPartyId: string;
  listingTitle: string;
  listingId: string;
  initialMessages: MessageItem[];
}) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const msg = payload.new as MessageItem;
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });

          // Mark as read if from the other party
          if (msg.sender_id !== currentUserId) {
            supabase
              .from("messages")
              .update({ read: true })
              .eq("id", msg.id)
              .then();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content) return;

    setSending(true);
    setNewMessage("");

    const supabase = createClient();
    const { data } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        content,
      })
      .select()
      .single();

    if (data) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
    }

    // Update conversation timestamp
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    // Notify other party
    await supabase.from("notifications").insert({
      user_id: otherPartyId,
      type: "new_message",
      title: "New Message",
      body: `${content.slice(0, 80)}${content.length > 80 ? "..." : ""}`,
      link: `/dashboard/messages/${conversationId}`,
    });

    setSending(false);
  }

  // Group messages by date
  let lastDate = "";

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/messages"
              className="text-gray-400 hover:text-gray-300"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h2 className="text-lg font-semibold text-white">
              {otherPartyName}
            </h2>
          </div>
          <Link
            href={`/listing/${listingId}`}
            className="text-xs text-brand-amber hover:text-brand-amber-hover"
          >
            Re: {listingTitle}
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-gray-400">
            No messages yet. Start the conversation!
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isMine = msg.sender_id === currentUserId;
              const msgDate = formatDate(msg.created_at);
              let showDate = false;
              if (msgDate !== lastDate) {
                showDate = true;
                lastDate = msgDate;
              }

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="my-4 text-center text-xs text-gray-400">
                      {msgDate}
                    </div>
                  )}
                  <div
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        isMine
                          ? "bg-brand-amber text-brand-dark"
                          : "bg-white/[0.07] text-white"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <p
                        className={`mt-1 text-[10px] ${
                          isMine ? "text-brand-dark/60" : "text-gray-400"
                        }`}
                      >
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 border-t border-white/[0.07] pt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-white/[0.07] bg-brand-card px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="rounded-lg bg-brand-amber px-6 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
