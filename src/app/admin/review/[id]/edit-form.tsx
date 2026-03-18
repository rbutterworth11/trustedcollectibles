"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditableField {
  key: string;
  label: string;
  original: string;
  type: "text" | "textarea" | "select";
  options?: string[];
}

interface AdminEditFormProps {
  listingId: string;
  fields: EditableField[];
}

export default function AdminEditForm({
  listingId,
  fields,
}: AdminEditFormProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, f.original]))
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const hasChanges = fields.some((f) => values[f.key] !== f.original);

  async function handleSave() {
    if (!hasChanges) return;
    setSaving(true);
    setMessage("");

    // Only send changed fields
    const changedFields: Record<string, string> = {};
    for (const f of fields) {
      if (values[f.key] !== f.original) {
        changedFields[f.key] = values[f.key];
      }
    }

    const res = await fetch("/api/admin/edit-listing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, fields: changedFields }),
    });

    if (res.ok) {
      const data = await res.json();
      setMessage(
        `Updated ${data.updatedFields.length} field(s). Seller notified.`
      );
      setEditing(false);
      router.refresh();
    } else {
      const data = await res.json();
      setMessage(data.error || "Save failed.");
    }
    setSaving(false);
  }

  function handleReset() {
    setValues(Object.fromEntries(fields.map((f) => [f.key, f.original])));
    setEditing(false);
    setMessage("");
  }

  if (!editing) {
    return (
      <section className="rounded-lg border border-white/[0.07] bg-brand-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Edit Listing
          </h2>
          <button
            onClick={() => setEditing(true)}
            className="rounded-md bg-brand-amber px-3 py-1.5 text-xs font-semibold text-brand-dark hover:bg-brand-amber-hover"
          >
            Edit Fields
          </button>
        </div>
        {message && (
          <p className="text-sm text-green-400">{message}</p>
        )}
        <p className="text-xs text-gray-500">
          Edit title, description, player name, and other text fields.
          The seller will be notified of any changes.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-brand-amber/30 bg-brand-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-amber">
          Editing Listing
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="rounded-md bg-brand-amber px-3 py-1.5 text-xs font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleReset}
            className="rounded-md border border-white/[0.07] px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5"
          >
            Cancel
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-md bg-green-900/20 border border-green-500/20 p-2 text-sm text-green-400">
          {message}
        </div>
      )}

      <div className="space-y-5">
        {fields.map((field) => {
          const isChanged = values[field.key] !== field.original;
          return (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                {field.label}
                {isChanged && (
                  <span className="ml-2 text-brand-amber">changed</span>
                )}
              </label>

              {/* Original value */}
              <div className="mb-2 rounded-md bg-brand-dark border border-white/[0.07] p-2.5">
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 mb-1">
                  Original
                </p>
                <p className="text-sm text-gray-400 whitespace-pre-wrap">
                  {field.original || "(empty)"}
                </p>
              </div>

              {/* Editable field */}
              {field.type === "textarea" ? (
                <textarea
                  rows={4}
                  value={values[field.key]}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  className={`block w-full rounded-md border px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 ${
                    isChanged
                      ? "border-brand-amber/50 bg-brand-amber/5 focus:border-brand-amber focus:ring-brand-amber"
                      : "border-white/[0.07] bg-brand-card focus:border-brand-amber focus:ring-brand-amber"
                  }`}
                />
              ) : field.type === "select" && field.options ? (
                <select
                  value={values[field.key]}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  className={`block w-full rounded-md border px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 ${
                    isChanged
                      ? "border-brand-amber/50 bg-brand-amber/5 focus:border-brand-amber focus:ring-brand-amber"
                      : "border-white/[0.07] bg-brand-card focus:border-brand-amber focus:ring-brand-amber"
                  }`}
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={values[field.key]}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  className={`block w-full rounded-md border px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 ${
                    isChanged
                      ? "border-brand-amber/50 bg-brand-amber/5 focus:border-brand-amber focus:ring-brand-amber"
                      : "border-white/[0.07] bg-brand-card focus:border-brand-amber focus:ring-brand-amber"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
        <p className="text-xs text-gray-500">
          {hasChanges
            ? `${fields.filter((f) => values[f.key] !== f.original).length} field(s) changed`
            : "No changes"}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="rounded-md border border-white/[0.07] px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="rounded-md bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save & Notify Seller"}
          </button>
        </div>
      </div>
    </section>
  );
}
