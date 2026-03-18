import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase.from("saved_searches").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  return NextResponse.json({ searches: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, filters } = await request.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const { error } = await supabase.from("saved_searches").insert({
    user_id: user.id,
    name: name.trim(),
    filters: filters || {},
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchId } = await request.json();
  if (!searchId) return NextResponse.json({ error: "Missing searchId" }, { status: 400 });

  await supabase.from("saved_searches").delete().eq("id", searchId).eq("user_id", user.id);
  return NextResponse.json({ success: true });
}
