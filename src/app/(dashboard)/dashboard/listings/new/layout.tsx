import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create New Listing" };

export default function NewListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
