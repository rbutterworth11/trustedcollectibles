"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface AdminReviewActionsProps {
  listingId: string;
  currentStatus: string;
  isFlagged: boolean;
  flagReason: string | null;
}

export default function AdminReviewActions({
  listingId,
  currentStatus,
  isFlagged,
  flagReason: initialFlagReason,
}: AdminReviewActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [photosNote, setPhotosNote] = useState("");
  const [flagInput, setFlagInput] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [showFlag, setShowFlag] = useState(false);
  const [error, setError] = useState("");

  async function submitAction(
    action: string,
    reason?: string,
    notes?: string
  ) {
    setLoading(action);
    setError("");

    const res = await fetch("/api/admin/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, action, reason, notes }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Action failed.");
      setLoading("");
      return;
    }

    router.refresh();
    setLoading("");
    setShowReject(false);
    setShowPhotos(false);
    setShowFlag(false);
  }

  const isPending = currentStatus === "pending_verification";

  return (
    <section className="rounded-lg border bg-white p-5 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        Actions
      </h2>

      {error && (
        <div className="rounded-md bg-red-50 p-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Admin Notes */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Internal Notes
        </label>
        <textarea
          rows={2}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Optional notes (saved with any action)..."
          className="block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      {/* Approve */}
      {isPending && (
        <button
          onClick={() => submitAction("approved", undefined, adminNotes)}
          disabled={!!loading}
          className="w-full rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
        >
          {loading === "approved" ? "Approving..." : "Approve & List"}
        </button>
      )}

      {/* Reject */}
      {isPending && !showReject && (
        <button
          onClick={() => setShowReject(true)}
          className="w-full rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          Reject
        </button>
      )}
      {showReject && (
        <div className="space-y-2 rounded-md border border-red-200 bg-red-50 p-3">
          <label className="block text-xs font-medium text-red-700">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Explain why this listing is being rejected..."
            className="block w-full rounded-md border border-red-300 px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() =>
                submitAction("rejected", rejectReason, adminNotes)
              }
              disabled={!rejectReason.trim() || !!loading}
              className="rounded-md bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
            >
              {loading === "rejected" ? "Rejecting..." : "Confirm Reject"}
            </button>
            <button
              onClick={() => setShowReject(false)}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Request More Photos */}
      {isPending && !showPhotos && (
        <button
          onClick={() => setShowPhotos(true)}
          className="w-full rounded-md border border-blue-300 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
        >
          Request More Photos
        </button>
      )}
      {showPhotos && (
        <div className="space-y-2 rounded-md border border-blue-200 bg-blue-50 p-3">
          <label className="block text-xs font-medium text-blue-700">
            What photos are needed? <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            value={photosNote}
            onChange={(e) => setPhotosNote(e.target.value)}
            placeholder="e.g. Please provide a clearer photo of the hologram sticker..."
            className="block w-full rounded-md border border-blue-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() =>
                submitAction("request_photos", photosNote, adminNotes)
              }
              disabled={!photosNote.trim() || !!loading}
              className="rounded-md bg-blue-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {loading === "request_photos" ? "Sending..." : "Send Request"}
            </button>
            <button
              onClick={() => setShowPhotos(false)}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <hr />

      {/* Flag / Unflag */}
      {!isFlagged && !showFlag && (
        <button
          onClick={() => setShowFlag(true)}
          className="w-full rounded-md border border-orange-300 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"
        >
          Flag as Suspicious
        </button>
      )}
      {showFlag && (
        <div className="space-y-2 rounded-md border border-orange-200 bg-orange-50 p-3">
          <label className="block text-xs font-medium text-orange-700">
            Flag Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            value={flagInput}
            onChange={(e) => setFlagInput(e.target.value)}
            placeholder="Why is this listing suspicious?"
            className="block w-full rounded-md border border-orange-300 px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() =>
                submitAction("flagged", flagInput, adminNotes)
              }
              disabled={!flagInput.trim() || !!loading}
              className="rounded-md bg-orange-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {loading === "flagged" ? "Flagging..." : "Confirm Flag"}
            </button>
            <button
              onClick={() => setShowFlag(false)}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {isFlagged && (
        <div className="space-y-2">
          {initialFlagReason && (
            <p className="text-sm text-orange-700 bg-orange-50 rounded-md p-2">
              <span className="font-medium">Flag reason:</span>{" "}
              {initialFlagReason}
            </p>
          )}
          <button
            onClick={() => submitAction("unflagged", undefined, adminNotes)}
            disabled={!!loading}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {loading === "unflagged" ? "Removing flag..." : "Remove Flag"}
          </button>
        </div>
      )}
    </section>
  );
}
