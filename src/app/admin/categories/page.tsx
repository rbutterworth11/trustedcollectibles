import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CategoriesEditor from "@/components/admin/categories-editor";

export const metadata: Metadata = { title: "Categories — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("managed_categories")
    .select("*")
    .order("sort_order");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Categories</h1>
      <CategoriesEditor categories={categories ?? []} />
    </div>
  );
}
