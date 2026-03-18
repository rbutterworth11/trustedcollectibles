"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface User {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  created_at: string;
}

const ROLE_OPTIONS = ["all", "buyer", "seller", "admin"] as const;

const ROLE_LABELS: Record<string, string> = {
  all: "All",
  buyer: "Buyer",
  seller: "Seller",
  admin: "Admin",
};

const ROLE_BADGE: Record<string, string> = {
  admin: "bg-brand-amber/20 text-brand-amber",
  seller: "bg-blue-900/40 text-blue-400",
  buyer: "bg-gray-800 text-gray-400",
};

export default function AdminUsersTable({ users }: { users: User[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered =
    filter === "all" ? users : users.filter((u) => u.role === filter);

  const counts: Record<string, number> = { all: users.length };
  for (const u of users) {
    counts[u.role] = (counts[u.role] || 0) + 1;
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setChangingRole(userId);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Role change failed.");
    }

    setChangingRole(null);
    router.refresh();
  }

  async function handleDelete(userId: string) {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this user? This cannot be undone."
      )
    )
      return;

    setDeleting(userId);
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Delete failed.");
    }

    setDeleting(null);
    router.refresh();
  }

  return (
    <div>
      {/* Filter pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {ROLE_OPTIONS.map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === r
                ? "bg-brand-amber text-brand-dark"
                : "bg-white/[0.07] text-gray-400 hover:bg-white/10"
            }`}
          >
            {ROLE_LABELS[r]} ({counts[r] || 0})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-white/[0.07]">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="bg-brand-card text-left text-xs font-medium uppercase text-gray-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Member Since</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.07]">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-3 text-white font-medium">
                    {user.full_name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        ROLE_BADGE[user.role] || "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        disabled={changingRole === user.id}
                        className="rounded-md border border-white/[0.07] bg-brand-card px-2 py-1 text-xs text-gray-300 focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber disabled:opacity-50"
                      >
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deleting === user.id}
                        className="text-red-400 hover:text-red-300 text-xs font-medium disabled:opacity-50"
                      >
                        {deleting === user.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
