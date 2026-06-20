"use client";

import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  type?: "student" | "session";
  studentName: string;
  studentId: string;
  cardId: string;
  onClose: () => void;
  onDeleted: () => void;
};

export default function DeleteConfirmModal({
  isOpen,
  type = "student",
  studentName,
  studentId,
  cardId,
  onClose,
  onDeleted,
}: Props) {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const isStudent = type === "student";
  const title = isStudent ? "Student" : "Session";
  const idLabel = isStudent ? "Card ID" : "Session";
  const endpoint = isStudent ? "/api/students/delete" : "/api/sessions/delete";
  const body = isStudent
    ? { studentId, confirmation: confirmText }
    : { sessionId: studentId, confirmation: confirmText };
  const warningText = isStudent
    ? "This will delete ALL records: results, behaviour, attendance, and summary for this student."
    : "This will delete the session. Sessions with existing results cannot be deleted.";

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      setError('You must type "DELETE" to confirm');
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        onDeleted();
        onClose();
        setConfirmText("");
      } else {
        setError(data.error || `Failed to delete ${title.toLowerCase()}`);
      }
    } catch {
      setError("Network error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-center text-slate-900 mb-2">
          ⚠️ Delete {title}
        </h2>
        <p className="text-center text-red-600 font-semibold text-sm mb-4">
          This action is permanent and cannot be undone!
        </p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-slate-700 space-y-1">
          <p><span className="font-semibold">{title}:</span> {studentName}</p>
          <p><span className="font-semibold">{idLabel}:</span> {cardId}</p>
          <p className="text-red-600 text-xs mt-2">{warningText}</p>
        </div>

        <div className="mb-4">
          <label htmlFor="confirm-delete" className="block text-sm font-medium text-slate-700 mb-1">
            Type <span className="font-bold text-red-600">DELETE</span> to confirm:
          </label>
          <input
            id="confirm-delete"
            type="text"
            value={confirmText}
            onChange={(e) => {
              setConfirmText(e.target.value);
              setError("");
            }}
            placeholder="Type DELETE here"
            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-mono"
            autoFocus
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={confirmText !== "DELETE" || deleting}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}