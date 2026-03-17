import type { SupabaseClient } from "@supabase/supabase-js";

export async function createNotification(
  supabase: SupabaseClient,
  params: {
    userId: string;
    type: string;
    title: string;
    body?: string;
    link?: string;
    data?: Record<string, unknown>;
  }
) {
  await supabase.from("notifications").insert({
    user_id: params.userId,
    type: params.type,
    title: params.title,
    body: params.body ?? null,
    link: params.link ?? null,
    data: params.data ?? null,
  });
}
