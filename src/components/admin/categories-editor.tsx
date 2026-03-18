"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminImageUpload from "./admin-image-upload";

interface Category {
  id?: string;
  name: string;
  image_url?: string | null;
  enabled: boolean;
  sort_order: number;
  type: "sport" | "item_type" | "condition" | "coa_source";
}

export default function CategoriesEditor({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  type TabType = "sport" | "item_type" | "condition" | "coa_source";
  const [activeTab, setActiveTab] = useState<TabType>("sport");
  const [sports, setSports] = useState<Category[]>(
    categories.filter((c) => c.type === "sport")
  );
  const [itemTypes, setItemTypes] = useState<Category[]>(
    categories.filter((c) => c.type === "item_type")
  );
  const [conditions, setConditions] = useState<Category[]>(
    categories.filter((c) => c.type === "condition")
  );
  const [coaSources, setCoaSources] = useState<Category[]>(
    categories.filter((c) => c.type === "coa_source")
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const tabMap: Record<TabType, { list: Category[]; set: (v: Category[]) => void }> = {
    sport: { list: sports, set: setSports },
    item_type: { list: itemTypes, set: setItemTypes },
    condition: { list: conditions, set: setConditions },
    coa_source: { list: coaSources, set: setCoaSources },
  };
  const currentList = tabMap[activeTab].list;
  const setCurrentList = tabMap[activeTab].set;

  const moveItem = useCallback(
    (index: number, direction: "up" | "down") => {
      const list = [...currentList];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return;
      [list[index], list[targetIndex]] = [list[targetIndex], list[index]];
      list.forEach((item, i) => (item.sort_order = i));
      setCurrentList(list);
    },
    [currentList, setCurrentList]
  );

  const updateField = useCallback(
    (index: number, field: keyof Category, value: string | boolean) => {
      const list = [...currentList];
      (list[index] as unknown as Record<string, unknown>)[field] = value;
      setCurrentList(list);
    },
    [currentList, setCurrentList]
  );

  const addCategory = useCallback(() => {
    setCurrentList([
      ...currentList,
      {
        name: "",
        image_url: "",
        enabled: true,
        sort_order: currentList.length,
        type: activeTab,
      },
    ]);
  }, [currentList, setCurrentList, activeTab]);

  const deleteCategory = useCallback(
    (index: number) => {
      const list = currentList.filter((_, i) => i !== index);
      list.forEach((item, i) => (item.sort_order = i));
      setCurrentList(list);
      setConfirmDelete(null);
    },
    [currentList, setCurrentList]
  );

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: activeTab,
        categories: currentList.map((c, i) => ({
          id: c.id,
          name: c.name,
          image_url: c.image_url || null,
          enabled: c.enabled,
          sort_order: i,
        })),
      }),
    });
    if (res.ok) {
      setMessage("Saved successfully!");
      router.refresh();
    } else {
      setMessage("Failed to save.");
    }
    setSaving(false);
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {([
          { key: "sport" as TabType, label: "Sports" },
          { key: "item_type" as TabType, label: "Item Types" },
          { key: "condition" as TabType, label: "Conditions" },
          { key: "coa_source" as TabType, label: "COA Sources" },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setMessage("");
              setConfirmDelete(null);
            }}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-brand-amber text-brand-dark"
                : "text-gray-400 hover:text-white hover:bg-white/5 border border-white/[0.07]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category list */}
      <div className="space-y-2">
        {currentList.map((cat, index) => (
          <div
            key={`${activeTab}-${index}`}
            className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-brand-card p-3"
          >
            {/* Reorder arrows */}
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => moveItem(index, "up")}
                disabled={index === 0}
                className="text-gray-500 hover:text-white disabled:opacity-20 text-xs leading-none"
                title="Move up"
              >
                &#9650;
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, "down")}
                disabled={index === currentList.length - 1}
                className="text-gray-500 hover:text-white disabled:opacity-20 text-xs leading-none"
                title="Move down"
              >
                &#9660;
              </button>
            </div>

            {/* Name */}
            <input
              type="text"
              value={cat.name}
              onChange={(e) => updateField(index, "name", e.target.value)}
              placeholder="Category name"
              className="flex-1 min-w-0 rounded-md border border-white/[0.07] bg-brand-dark px-3 py-1.5 text-sm text-white placeholder:text-gray-500 focus:border-brand-amber focus:ring-brand-amber"
            />

            {/* Image */}
            <div className="w-48 hidden sm:block">
              {cat.image_url ? (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded overflow-hidden bg-white/5 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cat.image_url} alt={cat.name} className="h-full w-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField(index, "image_url", "")}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-500 hover:text-gray-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("folder", "categories");
                      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                      if (res.ok) {
                        const { url } = await res.json();
                        updateField(index, "image_url", url);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* Toggle */}
            <button
              type="button"
              onClick={() => updateField(index, "enabled", !cat.enabled)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                cat.enabled
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {cat.enabled ? "ON" : "OFF"}
            </button>

            {/* Delete */}
            {confirmDelete === index ? (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => deleteCategory(index)}
                  className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="rounded-md border border-white/[0.07] px-2 py-1 text-xs text-gray-400 hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(index)}
                className="rounded-md border border-white/[0.07] px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                title="Delete category"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={addCategory}
        className="mt-3 rounded-md border border-dashed border-white/[0.12] px-4 py-2 text-sm text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 w-full"
      >
        + Add {activeTab === "sport" ? "Sport" : "Item Type"}
      </button>

      {/* Save */}
      {message && (
        <p
          className={`mt-4 text-sm ${
            message.includes("Failed") ? "text-red-400" : "text-green-400"
          }`}
        >
          {message}
        </p>
      )}

      <div className="mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-brand-amber px-6 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-amber-hover disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : `Save ${({ sport: "Sports", item_type: "Item Types", condition: "Conditions", coa_source: "COA Sources" })[activeTab]}`}
        </button>
      </div>
    </div>
  );
}
