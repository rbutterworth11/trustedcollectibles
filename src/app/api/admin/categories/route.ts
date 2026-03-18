import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: NextRequest) {
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

  const { type, categories } = await request.json();
  if (!type || !["sport", "item_type", "condition", "coa_source"].includes(type))
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  if (!Array.isArray(categories))
    return NextResponse.json(
      { error: "Categories must be an array" },
      { status: 400 }
    );

  // Delete all existing categories of this type, then re-insert
  const { error: deleteError } = await supabase
    .from("managed_categories")
    .delete()
    .eq("type", type);
  if (deleteError)
    return NextResponse.json({ error: deleteError.message }, { status: 500 });

  if (categories.length > 0) {
    const rows = categories.map(
      (
        c: {
          name: string;
          image_url?: string | null;
          enabled: boolean;
          sort_order: number;
        },
        i: number
      ) => ({
        name: c.name,
        image_url: c.image_url || null,
        enabled: c.enabled,
        sort_order: c.sort_order ?? i,
        type,
      })
    );

    const { error: insertError } = await supabase
      .from("managed_categories")
      .insert(rows);
    if (insertError)
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
  }

  return NextResponse.json({ success: true });
}
