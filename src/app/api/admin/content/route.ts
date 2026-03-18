import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function verifyAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

// Update a content section
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  if (!(await verifyAdmin(supabase))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { key, value, enabled, sort_order } = await request.json();
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (value !== undefined) update.value = value;
  if (enabled !== undefined) update.enabled = enabled;
  if (sort_order !== undefined) update.sort_order = sort_order;

  const { error } = await supabase.from("site_content").update(update).eq("key", key);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
