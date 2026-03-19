"use client";

import Link from "next/link";
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

    // After approve or reject, go back to queue
    if (action === "approved" || action === "rejected") {
      router.push("/admin");
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
    <section className="rounded-lg border border-white/[0.07] bg-brand-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Actions
        </h2>
        <Link href="/admin" className="text-xs text-brand-amber hover:text-brand-amber-hover">
          &larr; Back to Queue
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-900/40 p-2 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Admin Notes */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">
          Internal Notes
        </label>
        <textarea
          rows={2}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Optional notes (saved with any action)..."
          className="block w-full rounded-md border border-white/[0.07] bg-brand-card px-2 py-1.5 text-sm text-white placeholder:text-gray-500 focus:border-brand-amber focus:outline-none focus:ring-1 focus:ring-brand-amber"
        />
      </div>

      {/* Approve */}
      {isPending && (
        <button
          onClick={() => submitAction("approved", undefined, adminNotes)}
          disabled={!!loading}
          className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading === "approved" ? "Approving..." : "Approve & List"}
        </button>
      )}

      {/* Reject */}
      {isPending && !showReject && (
        <button
          onClick={() => setShowReject(true)}
          className="w-full rounded-md border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20"
        >
          Reject
        </button>
      )}
      {showReject && (
        <div className="space-y-2 rounded-md border border-red-500/30 bg-red-900/20 p-3">
          <label className="block text-xs font-medium text-red-400">
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Explain why this listing is being rejected..."
            className="block w-full rounded-md border border-white/[0.07] bg-brand-card px-2 py-1.5 text-sm text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() =>
                submitAction("rejected", rejectReason, adminNotes)
              }
              disabled={!rejectReason.trim() || !!loading}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading === "rejected" ? "Rejecting..." : "Confirm Reject"}
            </button>
            <button
              onClick={() => setShowReject(false)}
              className="rounded-md border border-white/[0.07] px-3 py-1.5 text-sm text-gray-300 hover:bg-white/5"
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
          className="w-full rounded-md border border-blue-500/30 px-4 py-2 text-sm font-medium text-blue-400 hover:bg-blue-900/20"
        >
          Request More Photos
        </button>
      )}
      {showPhotos && (
        <div className="space-y-2 rounded-md border border-blue-500/30 bg-blue-900/20 p-3">
          <label className="block text-xs font-medium text-blue-400">
            What photos are needed? <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            value={photosNote}
            onChange={(e) => setPhotosNote(e.target.value)}
            placeholder="e.g. Please provide a clearer photo of the hologram sticker..."
            className="block w-full rounded-md border border-white/[0.07] bg-brand-card px-2 py-1.5 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              onClick={() =>
                submitAction("request_photos", photosNote, adminNotes)
              }
              disabled={!photosNote.trim() || !!loading}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading === "request_photos" ? "Sending..." : "Send Request"}
            </button>
            <button
              onClick={() => setShowPhotos(false)}
              className="rounded-md border border-white/[0.07] px-3 py-1.5 text-sm text-gray-300 hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <hr className="border-white/[0.07]" />

      {/* Flag / Unflag */}
      {!isFlagged && !showFlag && (
        <button
          onClick={() => setShowFlag(true)}
          className="w-full rounded-md border border-orange-500/30 px-4 py-2 text-sm font-medium text-orange-400 hover:bg-orange-900/20"
        >
          Flag as Suspicious
        </button>
      )}
      {showFlag && (
        <div className="space-y-2 rounded-md border border-orange-500/30 bg-orange-900/20 p-3">
          <label className="block text-xs font-medium text-orange-400">
            Flag Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            value={flagInput}
            onChange={(e) => setFlagInput(e.target.value)}
            placeholder="Why is this listing suspicious?"
            className="block w-full rounded-md border border-white/[0.07] bg-brand-card px-2 py-1.5 text-sm text-white placeholder:text-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
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
              className="rounded-md border border-white/[0.07] px-3 py-1.5 text-sm text-gray-300 hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {isFlagged && (
        <div className="space-y-2">
          {initialFlagReason && (
            <p className="text-sm text-orange-400 bg-orange-900/20 rounded-md p-2">
              <span className="font-medium">Flag reason:</span>{" "}
              {initialFlagReason}
            </p>
          )}
          <button
            onClick={() => submitAction("unflagged", undefined, adminNotes)}
            disabled={!!loading}
            className="w-full rounded-md border border-white/[0.07] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 disabled:opacity-50"
          >
            {loading === "unflagged" ? "Removing flag..." : "Remove Flag"}
          </button>
        </div>
      )}

      <hr className="border-white/[0.07]" />

      {/* Delete Listing */}
      <button
        onClick={async () => {
          if (!window.confirm("Are you sure you want to permanently delete this listing? This cannot be undone.")) return;
          setLoading("delete");
          setError("");
          const res = await fetch("/api/admin/listings", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ listingId }),
          });
          if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Delete failed.");
            setLoading("");
            return;
          }
          router.push("/admin/listings");
        }}
        disabled={!!loading}
        className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
      >
        {loading === "delete" ? "Deleting..." : "Delete Listing"}
      </button>
    </section>
  );
}
