"use client";

import type { ListingFormData } from "@/types";
import { SPORTS, ITEM_TYPES, CONDITIONS } from "@/lib/constants";

interface StepDetailsProps {
  data: ListingFormData;
  onChange: (updates: Partial<ListingFormData>) => void;
  errors: Record<string, string>;
}

export default function StepDetails({ data, onChange, errors }: StepDetailsProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Item Details</h2>
        <p className="text-sm text-gray-600 mt-1">
          Describe your item accurately — this helps buyers find it and builds trust.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="e.g. Michael Jordan Signed Chicago Bulls Jersey"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Describe the item, its history, how it was obtained, and any notable details..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="sport" className="block text-sm font-medium text-gray-700">
              Sport <span className="text-red-500">*</span>
            </label>
            <select
              id="sport"
              value={data.sport}
              onChange={(e) => onChange({ sport: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">Select sport</option>
              {SPORTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.sport && <p className="mt-1 text-xs text-red-600">{errors.sport}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Item Type <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={data.category}
              onChange={(e) => onChange({ category: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">Select type</option>
              {ITEM_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="player" className="block text-sm font-medium text-gray-700">
              Player Name <span className="text-red-500">*</span>
            </label>
            <input
              id="player"
              type="text"
              value={data.player}
              onChange={(e) => onChange({ player: e.target.value })}
              placeholder="e.g. Michael Jordan"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            {errors.player && <p className="mt-1 text-xs text-red-600">{errors.player}</p>}
          </div>

          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-700">
              Team <span className="text-red-500">*</span>
            </label>
            <input
              id="team"
              type="text"
              value={data.team}
              onChange={(e) => onChange({ team: e.target.value })}
              placeholder="e.g. Chicago Bulls"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            {errors.team && <p className="mt-1 text-xs text-red-600">{errors.team}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <select
              id="year"
              value={data.year}
              onChange={(e) => onChange({ year: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">Select year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
              Condition <span className="text-red-500">*</span>
            </label>
            <select
              id="condition"
              value={data.condition}
              onChange={(e) => onChange({ condition: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">Select condition</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.condition && <p className="mt-1 text-xs text-red-600">{errors.condition}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
