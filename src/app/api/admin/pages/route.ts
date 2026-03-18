import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { slug, content, meta_description } = await request.json();
  if (!slug)
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const update: Record<string, string> = {};
  if (content !== undefined) update.content = content;
  if (meta_description !== undefined) update.meta_description = meta_description;

  const { error } = await supabase
    .from("content_pages")
    .update(update)
    .eq("slug", slug);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
