"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AdmissionStats, AdmissionFilters, AdmissionsTable, AdmissionDetailModal } from "./index";
import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export function AdmissionClient() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [classFilter, setClassFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSingleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/admission/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchApplications();
      } else {
        toast.error(data.error || "Delete failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected application(s)?`)) return;

    try {
      const res = await fetch("/api/admission/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setSelectedIds([]);
        fetchApplications();
      } else {
        toast.error(data.error || "Delete failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        status,
        class: classFilter,
        search,
      });
      const res = await fetch(`/api/admission/applications?${params}`);
      const data = await res.json();
      setApplications(data.applications);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  }, [page, status, classFilter, search]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/admission/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setSelectedId(null);
      fetchApplications();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const total = pagination.total;
  const admitted = applications.filter((a) => a.status === "ADMITTED").length;
  const pending = applications.filter((a) => ["SUBMITTED", "UNDER_REVIEW", "AWAITING_TEST"].includes(a.status)).length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#3D1902]">Admission Management</h1>
          <p className="text-sm text-[#8B5E3C]/60 mt-0.5">
            Review and manage student applications.
          </p>
        </div>
      </div>

      {/* Stats */}
      <AdmissionStats total={total} admitted={admitted} pending={pending} rejected={rejected} />

      {/* Filters */}
      <div className="mt-6">
        <AdmissionFilters
          search={search}
          status={status}
          classFilter={classFilter}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onClassChange={setClassFilter}
        />
      </div>

      {/* Bulk Delete Bar */}
      {selectedIds.length > 0 && (
        <div className="mt-4 flex items-center justify-between bg-red-50 border border-red-200 p-3 rounded-xl">
          <span className="text-sm text-red-700 font-medium">
            {selectedIds.length} application(s) selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all"
          >
            <Trash2 size={16} />
            Delete Selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#8B5E3C]" />
          </div>
        ) : (
          <AdmissionsTable
            applications={applications}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onView={setSelectedId}
            onDelete={handleSingleDelete}
          />
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-xl px-3.5 py-1.5 text-sm font-bold transition-all ${
                p === page
                  ? "bg-[#8B5E3C] text-white shadow-md shadow-[#8B5E3C]/20"
                  : "bg-[#FAF7F2] text-[#8B5E3C] hover:bg-[#8B5E3C]/10"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedId && (
        <AdmissionDetailModal
          applicationId={selectedId}
          onClose={() => setSelectedId(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </motion.div>
  );
}