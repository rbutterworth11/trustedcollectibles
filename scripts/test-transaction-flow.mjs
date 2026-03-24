#!/usr/bin/env node
/**
 * End-to-end transaction flow test
 *
 * Tests: create seller → create listing → approve listing →
 *        create buyer → simulate purchase → ship → confirm delivery
 *
 * Run with: node scripts/test-transaction-flow.mjs
 *
 * Uses the Supabase service role key to bypass RLS.
 * All test data is cleaned up at the end.
 */

import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";

// ─── Load .env.local ───
const envFile = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}
Object.assign(process.env, env);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Helpers ───
const TEST_PREFIX = "e2e_test_";
const testId = Date.now().toString(36);
const sellerEmail = `${TEST_PREFIX}seller_${testId}@test.local`;
const buyerEmail = `${TEST_PREFIX}buyer_${testId}@test.local`;
const password = "TestPass123!";

let sellerId = null;
let buyerId = null;
let listingId = null;
let orderId = null;

const results = [];

function log(step, status, detail = "") {
  const icon = status === "PASS" ? "✅" : status === "FAIL" ? "❌" : "⏭️";
  const msg = `${icon} ${step}${detail ? ` — ${detail}` : ""}`;
  console.log(msg);
  results.push({ step, status, detail });
}

// ─── Cleanup helper ───
async function cleanup() {
  console.log("\n🧹 Cleaning up test data...");
  try {
    if (orderId) {
      await supabase.from("orders").delete().eq("id", orderId);
    }
    if (listingId) {
      await supabase.from("listings").delete().eq("id", listingId);
    }
    if (sellerId) {
      await supabase.from("profiles").delete().eq("id", sellerId);
      await supabase.auth.admin.deleteUser(sellerId);
    }
    if (buyerId) {
      await supabase.from("profiles").delete().eq("id", buyerId);
      await supabase.auth.admin.deleteUser(buyerId);
    }
    console.log("✅ Cleanup complete");
  } catch (err) {
    console.log("⚠️  Cleanup error (non-critical):", err.message);
  }
}

// ─── Main test flow ───
async function run() {
  console.log("═══════════════════════════════════════════════");
  console.log("  TrustedCollectibles — E2E Transaction Test");
  console.log("═══════════════════════════════════════════════\n");

  // ─── Step 1: Create seller user ───
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: sellerEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Test Seller" },
    });
    if (error) throw error;
    sellerId = data.user.id;

    // Ensure profile exists and set role to seller
    await supabase.from("profiles").upsert({
      id: sellerId,
      email: sellerEmail,
      full_name: "Test Seller",
      role: "seller",
      stripe_account_id: "acct_test_fake_123",
      stripe_onboarded: true,
    });

    log("1. Create seller user", "PASS", `${sellerEmail} (${sellerId.slice(0, 8)}…)`);
  } catch (err) {
    log("1. Create seller user", "FAIL", err.message);
    await cleanup();
    return printSummary();
  }

  // ─── Step 2: Create listing ───
  try {
    const listingData = {
      seller_id: sellerId,
      title: `E2E Test Signed Jersey — ${testId}`,
      description: "Automated test listing for the e2e transaction flow.",
      price: 15000, // £150.00 in pence
      category: "Signed Jersey",
      sport: "Football (Soccer)",
      player: "Test Player",
      team: "Test FC",
      year: "2025",
      condition: "Mint",
      accept_offers: false,
      images: ["https://placehold.co/400x400/15171f/c67b2f?text=TEST"],
      status: "pending_verification",
    };

    const { data, error } = await supabase
      .from("listings")
      .insert(listingData)
      .select("id")
      .single();
    if (error) throw error;
    listingId = data.id;

    log("2. Create listing", "PASS", `"${listingData.title}" (${listingId.slice(0, 8)}…)`);
  } catch (err) {
    log("2. Create listing", "FAIL", err.message);
    await cleanup();
    return printSummary();
  }

  // ─── Step 3: Approve listing (admin review → listed) ───
  try {
    // First verify → then list (matching the real flow: pending_verification → verified → listed)
    const { error: verifyErr } = await supabase
      .from("listings")
      .update({
        status: "verified",
        reviewed_at: new Date().toISOString(),
        admin_notes: "E2E test auto-approved",
      })
      .eq("id", listingId);
    if (verifyErr) throw verifyErr;

    const { error: listErr } = await supabase
      .from("listings")
      .update({ status: "listed" })
      .eq("id", listingId);
    if (listErr) throw listErr;

    // Verify the listing is now "listed"
    const { data: check } = await supabase
      .from("listings")
      .select("status")
      .eq("id", listingId)
      .single();

    if (check?.status !== "listed") throw new Error(`Expected status "listed", got "${check?.status}"`);

    log("3. Approve listing", "PASS", `Status: ${check.status}`);
  } catch (err) {
    log("3. Approve listing", "FAIL", err.message);
    await cleanup();
    return printSummary();
  }

  // ─── Step 4: Create buyer user ───
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: buyerEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Test Buyer" },
    });
    if (error) throw error;
    buyerId = data.user.id;

    await supabase.from("profiles").upsert({
      id: buyerId,
      email: buyerEmail,
      full_name: "Test Buyer",
      role: "buyer",
    });

    log("4. Create buyer user", "PASS", `${buyerEmail} (${buyerId.slice(0, 8)}…)`);
  } catch (err) {
    log("4. Create buyer user", "FAIL", err.message);
    await cleanup();
    return printSummary();
  }

  // ─── Step 5: Simulate purchase (create order + mark listing sold) ───
  try {
    const platformFee = Math.round(15000 * 0.1); // 10% = 1500

    const { data, error } = await supabase
      .from("orders")
      .insert({
        listing_id: listingId,
        buyer_id: buyerId,
        seller_id: sellerId,
        amount: 15000,
        platform_fee: platformFee,
        stripe_payment_intent_id: `pi_test_${testId}`,
        status: "payment_held",
      })
      .select("id, status, amount, platform_fee")
      .single();
    if (error) throw error;
    orderId = data.id;

    // Mark listing as sold
    await supabase
      .from("listings")
      .update({ status: "sold" })
      .eq("id", listingId);

    log(
      "5. Simulate purchase",
      "PASS",
      `Order ${orderId.slice(0, 8)}… | Amount: £${(data.amount / 100).toFixed(2)} | Fee: £${(data.platform_fee / 100).toFixed(2)} | Status: ${data.status}`
    );
  } catch (err) {
    log("5. Simulate purchase", "FAIL", err.message);
    await cleanup();
    return printSummary();
  }

  // ─── Step 6: Seller ships the order ───
  try {
    const { error } = await supabase
      .from("orders")
      .update({
        status: "shipped",
        tracking_number: `TRACK-${testId}`,
      })
      .eq("id", orderId);
    if (error) throw error;

    const { data: check } = await supabase
      .from("orders")
      .select("status, tracking_number")
      .eq("id", orderId)
      .single();

    if (check?.status !== "shipped") throw new Error(`Expected "shipped", got "${check?.status}"`);

    log("6. Seller ships order", "PASS", `Tracking: ${check.tracking_number}`);
  } catch (err) {
    log("6. Seller ships order", "FAIL", err.message);
    await cleanup();
    return printSummary();
  }

  // ─── Step 7: Mark as delivered ───
  try {
    const { error } = await supabase
      .from("orders")
      .update({ status: "delivered" })
      .eq("id", orderId);
    if (error) throw error;

    log("7. Mark as delivered", "PASS");
  } catch (err) {
    log("7. Mark as delivered", "FAIL", err.message);
    await cleanup();
    return printSummary();
  }

  // ─── Step 8: Buyer confirms delivery → order completed ───
  try {
    const { error } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", orderId);
    if (error) throw error;

    const { data: finalOrder } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .single();

    if (finalOrder?.status !== "completed")
      throw new Error(`Expected "completed", got "${finalOrder?.status}"`);

    log("8. Buyer confirms delivery", "PASS", "Order completed — funds released to seller");
  } catch (err) {
    log("8. Buyer confirms delivery", "FAIL", err.message);
    await cleanup();
    return printSummary();
  }

  // ─── Step 9: Verify final state ───
  try {
    const { data: listing } = await supabase
      .from("listings")
      .select("status")
      .eq("id", listingId)
      .single();

    const { data: order } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .single();

    const listingOk = listing?.status === "sold";
    const orderOk = order?.status === "completed";

    if (!listingOk || !orderOk)
      throw new Error(`Listing: ${listing?.status} (expected sold), Order: ${order?.status} (expected completed)`);

    log("9. Final state verification", "PASS", `Listing: ${listing.status}, Order: ${order.status}`);
  } catch (err) {
    log("9. Final state verification", "FAIL", err.message);
  }

  // ─── Cleanup & Summary ───
  await cleanup();
  printSummary();
}

function printSummary() {
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const total = results.length;

  console.log("\n═══════════════════════════════════════════════");
  console.log(`  Results: ${passed}/${total} passed${failed ? `, ${failed} failed` : ""}`);
  console.log("═══════════════════════════════════════════════");

  if (failed > 0) {
    console.log("\nFailed steps:");
    for (const r of results.filter((r) => r.status === "FAIL")) {
      console.log(`  ❌ ${r.step}: ${r.detail}`);
    }
  }

  console.log("");
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("Unhandled error:", err);
  cleanup().then(() => process.exit(1));
});
