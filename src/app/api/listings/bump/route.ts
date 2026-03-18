import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId } = await request.json();
  if (!listingId) return NextResponse.json({ error: "Missing listingId" }, { status: 400 });

  // Verify ownership
  const { data: listing } = await supabase.from("listings").select("seller_id, bumped_at, status").eq("id", listingId).single();
  if (!listing || listing.seller_id !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (listing.status !== "listed") return NextResponse.json({ error: "Only listed items can be bumped" }, { status: 400 });

  // Check if already bumped today
  if (listing.bumped_at) {
    const lastBump = new Date(listing.bumped_at);
    const now = new Date();
    const hoursSince = (now.getTime() - lastBump.getTime()) / (1000 * 60 * 60);
    if (hoursSince < 24) {
      const hoursLeft = Math.ceil(24 - hoursSince);
      return NextResponse.json({ error: `You can bump again in ${hoursLeft} hours` }, { status: 429 });
    }
  }

  const { error } = await supabase.from("listings").update({ bumped_at: new Date().toISOString(), bump_count: (listing as any).bump_count ? (listing as any).bump_count + 1 : 1 }).eq("id", listingId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
