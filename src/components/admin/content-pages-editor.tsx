"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Lazy load the rich text editor to avoid SSR issues with Tiptap
const RichTextEditor = dynamic(() => import("./rich-text-editor"), { ssr: false });

interface ContentPage {
  slug: string;
  title: string;
  content: string;
  meta_description: string | null;
  updated_at: string;
}

export default function ContentPagesEditor({ pages }: { pages: ContentPage[] }) {
  const router = useRouter();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function startEditing(page: ContentPage) {
    setEditingSlug(page.slug);
    setContent(page.content);
    setMetaDesc(page.meta_description || "");
    setMessage("");
  }

  async function handleSave() {
    if (!editingSlug) return;
    setSaving(true);
    const res = await fetch("/api/admin/pages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: editingSlug, content, meta_description: metaDesc }),
    });
    if (res.ok) {
      setMessage("Saved successfully!");
      router.refresh();
    } else {
      setMessage("Failed to save.");
    }
    setSaving(false);
  }

  const editingPage = pages.find((p) => p.slug === editingSlug);

  return (
    <div>
      {/* Page list */}
      {!editingSlug && (
        <div className="space-y-2">
          {pages.map((page) => (
            <div
              key={page.slug}
              className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-brand-card p-4"
            >
              <div>
                <p className="font-medium text-white">{page.title}</p>
                <p className="text-xs text-gray-500">
                  /{page.slug} &middot; Last updated{" "}
                  {new Date(page.updated_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => startEditing(page)}
                className="rounded-md bg-brand-amber px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      {editingSlug && editingPage && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Editing: {editingPage.title}
              </h2>
              <p className="text-xs text-gray-500">/{editingPage.slug}</p>
            </div>
            <button
              onClick={() => {
                setEditingSlug(null);
                setMessage("");
              }}
              className="rounded-md border border-white/[0.07] px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
            >
              Back to List
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Meta Description (SEO)
            </label>
            <input
              type="text"
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              className="w-full rounded-md border border-white/[0.07] bg-brand-dark px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-amber focus:ring-brand-amber"
              placeholder="Page description for search engines..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Page Content
            </label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.includes("Failed") ? "text-red-400" : "text-green-400"
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-brand-amber px-6 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Page"}
            </button>
            <button
              onClick={() => {
                setEditingSlug(null);
                setMessage("");
              }}
              className="rounded-md border border-white/[0.07] px-6 py-2 text-sm text-gray-300 hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
