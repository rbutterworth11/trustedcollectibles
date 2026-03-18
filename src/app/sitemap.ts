import type { MetadataRoute } from "next";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://trustedcollectibles.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch all listed items for product pages
  const { data: listings } = await supabase
    .from("listings")
    .select("id, updated_at")
    .eq("status", "listed")
    .order("updated_at", { ascending: false });

  const listingEntries: MetadataRoute.Sitemap = (listings ?? []).map(
    (listing) => ({
      url: `${SITE_URL}/listing/${listing.id}`,
      lastModified: new Date(listing.updated_at),
      changeFrequency: "daily",
      priority: 0.8,
    })
  );

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/marketplace`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  return [...staticPages, ...listingEntries];
}
