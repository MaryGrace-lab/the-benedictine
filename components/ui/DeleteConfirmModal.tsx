"use client";

import React, { useState, useEffect } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

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

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setConfirmText("");
      setError("");
      setDeleting(false);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !deleting) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, deleting, onClose]);

  if (!isOpen) return null;

  const isStudent = type === "student";
  const title = isStudent ? "Student" : "Session";
  const endpoint = isStudent ? "/api/students/delete" : "/api/sessions/delete";
  const body = isStudent
    ? { studentId, confirmation: confirmText }
    : { sessionId: studentId, confirmation: confirmText };
  const warningText = isStudent
    ? "This will permanently delete ALL records for this student including results, behaviour reports, attendance, and summaries."
    : "This will permanently delete the session.";

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
      } else {
        setError(data.error || `Failed to delete ${title.toLowerCase()}`);
        setDeleting(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget && !deleting) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-red-600" />
        </div>

        <h2 className="text-xl font-bold text-center text-slate-900 mb-2">
          Delete {title}
        </h2>
        <p className="text-center text-red-600 font-semibold text-sm mb-4">
          This action is permanent and cannot be undone!
        </p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-slate-700 space-y-1">
          <p>
            <span className="font-semibold">{title}:</span> {studentName}
          </p>
          <p>
            <span className="font-semibold">{isStudent ? "Card ID" : "Session"}:</span> {cardId}
          </p>
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
            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
            autoFocus
            disabled={deleting}
            autoComplete="off"
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
            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Permanently"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}