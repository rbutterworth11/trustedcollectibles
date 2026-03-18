import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function verifyAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return profile?.role === "admin" ? user : null;
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  if (!(await verifyAdmin(supabase)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { settings } = (await request.json()) as {
    settings: Record<string, string>;
  };

  if (!settings || typeof settings !== "object")
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const errors: string[] = [];

  for (const [key, value] of Object.entries(settings)) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) errors.push(`${key}: ${error.message}`);
  }

  if (errors.length > 0)
    return NextResponse.json(
      { error: `Failed to save: ${errors.join(", ")}` },
      { status: 500 }
    );

  return NextResponse.json({ success: true });
}
