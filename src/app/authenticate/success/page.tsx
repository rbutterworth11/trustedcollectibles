import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Authentication Submitted", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AuthSuccessPage({ searchParams }: { searchParams: Promise<{ request_id?: string }> }) {
  const { request_id } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Mark as paid
  if (request_id) {
    await supabase.from("auth_requests").update({ status: "paid" }).eq("id", request_id).eq("user_id", user.id);
  }

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4 bg-brand-dark">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-900/40">
          <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">Submission Received!</h1>
        <p className="mt-2 text-sm text-gray-400">
          Your authentication request has been submitted and paid. Our expert team will review your item and provide a verdict within 24-48 hours.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard/authentications" className="rounded-md bg-brand-amber px-6 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover">
            View My Requests
          </Link>
          <Link href="/authenticate" className="rounded-md border border-white/[0.07] px-6 py-2 text-sm font-medium text-gray-300 hover:bg-white/5">
            Submit Another
          </Link>
        </div>
      </div>
    </div>
  );
}
