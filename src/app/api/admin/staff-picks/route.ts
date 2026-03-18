import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function verifyAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

// Set staff picks (replace all)
export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  if (!(await verifyAdmin(supabase))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { listingIds } = await request.json();
  if (!Array.isArray(listingIds)) {
    return NextResponse.json({ error: "Invalid listingIds" }, { status: 400 });
  }

  // Delete all existing picks
  await supabase.from("staff_picks").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  // Insert new picks with order
  if (listingIds.length > 0) {
    const inserts = listingIds.map((id: string, i: number) => ({
      listing_id: id,
      sort_order: i,
    }));
    const { error } = await supabase.from("staff_picks").insert(inserts);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
