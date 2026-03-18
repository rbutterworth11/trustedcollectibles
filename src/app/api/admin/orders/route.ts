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

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  if (!(await verifyAdmin(supabase)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { orderId, status } = await request.json();
  if (!orderId || !status)
    return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
