import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { profiles } = await request.json();
  if (!Array.isArray(profiles))
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  // Delete all and re-insert
  await supabase
    .from("trending_profiles")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (profiles.length > 0) {
    const rows = profiles.map(
      (p: { name: string; image_url?: string; filter_type?: string; sort_order?: number; enabled?: boolean }, i: number) => ({
        name: p.name,
        image_url: p.image_url || null,
        filter_type: (p.filter_type === "team" ? "team" : "player") as "player" | "team",
        sort_order: p.sort_order ?? i,
        enabled: p.enabled !== false,
      })
    );

    const { error } = await supabase.from("trending_profiles").insert(rows);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
