import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { orderId, trackingNumber } = body;

  if (!orderId || !trackingNumber?.trim()) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Verify the user is the seller
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order || order.seller_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (order.status !== "payment_held") {
    return NextResponse.json(
      { error: "Order cannot be shipped in its current status" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("orders")
    .update({
      status: "shipped",
      tracking_number: trackingNumber.trim(),
    })
    .eq("id", orderId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
