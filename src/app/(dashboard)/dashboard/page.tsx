import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SellerDashboard from "@/components/dashboard/seller-dashboard";
import BuyerDashboard from "@/components/dashboard/buyer-dashboard";

export const metadata: Metadata = { title: "Dashboard Overview" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  const isSeller = profile.role === "seller" || profile.role === "admin";

  if (isSeller) {
    // Fetch seller stats
    const [
      { count: activeListings },
      { count: pendingReview },
      { data: soldOrders },
      { data: recentOrders },
      { data: pendingOffers },
      { data: recentReviews },
    ] = await Promise.all([
      supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", user.id)
        .eq("status", "listed"),
      supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", user.id)
        .eq("status", "pending_verification"),
      supabase
        .from("orders")
        .select("amount, platform_fee")
        .eq("seller_id", user.id)
        .in("status", ["completed", "delivered", "shipped"]),
      supabase
        .from("orders")
        .select("*, listing:listings(*), buyer:profiles!orders_buyer_id_fkey(*)")
        .eq("seller_id", user.id)
        .in("status", ["payment_held", "shipped", "delivered"])
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("offers")
        .select("*, listing:listings(*), buyer:profiles!offers_buyer_id_fkey(*)")
        .eq("seller_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("seller_reviews")
        .select("*, reviewer:profiles!seller_reviews_reviewer_id_fkey(*)")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    const totalSales = (soldOrders ?? []).reduce((sum, o) => sum + o.amount, 0);
    const totalFees = (soldOrders ?? []).reduce(
      (sum, o) => sum + o.platform_fee,
      0
    );
    const balance = totalSales - totalFees;

    return (
      <SellerDashboard
        stats={{
          activeListings: activeListings ?? 0,
          pendingReview: pendingReview ?? 0,
          totalSales,
          balance,
        }}
        orders={recentOrders ?? []}
        offers={pendingOffers ?? []}
        reviews={recentReviews ?? []}
      />
    );
  }

  // Buyer dashboard
  const [
    { data: recentOrders },
    { data: wishlistItems },
    { data: followedSellers },
    { data: buyerOffers },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("*, listing:listings(*), seller:profiles!orders_seller_id_fkey(*)")
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("wishlists")
      .select("*, listing:listings(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("followed_sellers")
      .select("*, seller:profiles!followed_sellers_seller_id_fkey(*)")
      .eq("follower_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("offers")
      .select("*, listing:listings(*), seller:profiles!offers_seller_id_fkey(*)")
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <BuyerDashboard
      orders={recentOrders ?? []}
      wishlist={wishlistItems ?? []}
      followedSellers={followedSellers ?? []}
      offers={buyerOffers ?? []}
    />
  );
}
