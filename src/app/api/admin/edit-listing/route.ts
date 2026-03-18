import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createNotification } from "@/lib/notifications";

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { listingId, fields } = await request.json();

  if (!listingId || !fields || typeof fields !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Only allow editing specific text fields
  const allowedFields = [
    "title",
    "description",
    "player",
    "team",
    "year",
    "sport",
    "category",
    "condition",
    "coa_source",
    "coa_certificate_number",
  ];

  const updateData: Record<string, string> = {};
  const changedFields: string[] = [];

  for (const [key, value] of Object.entries(fields)) {
    if (allowedFields.includes(key) && typeof value === "string") {
      updateData[key] = value;
      changedFields.push(key);
    }
  }

  if (changedFields.length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  // Fetch listing to get seller_id and current title
  const { data: listing } = await supabase
    .from("listings")
    .select("seller_id, title")
    .eq("id", listingId)
    .single();

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("listings")
    .update(updateData)
    .eq("id", listingId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Notify the seller
  const fieldNames = changedFields
    .map((f) => f.replace(/_/g, " "))
    .join(", ");

  await createNotification(supabase, {
    userId: listing.seller_id,
    type: "listing_approved",
    title: "Listing Updated by TC Team",
    body: `Our team has updated the following fields on "${listing.title}": ${fieldNames}. These changes ensure consistency and accuracy across the marketplace.`,
    link: "/dashboard/listings",
  });

  return NextResponse.json({ success: true, updatedFields: changedFields });
}
