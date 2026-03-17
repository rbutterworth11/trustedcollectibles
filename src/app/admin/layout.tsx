import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-65px)] bg-gray-50">
      <div className="border-b bg-red-50">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-red-700">
            Admin
          </span>
          <nav className="flex gap-4 text-sm">
            <Link
              href="/admin"
              className="text-red-800 hover:text-red-900 font-medium"
            >
              Review Queue
            </Link>
            <Link
              href="/admin?filter=flagged"
              className="text-red-800 hover:text-red-900 font-medium"
            >
              Flagged
            </Link>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
