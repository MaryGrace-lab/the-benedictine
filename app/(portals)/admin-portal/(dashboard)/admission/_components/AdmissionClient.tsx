"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AdmissionStats, AdmissionFilters, AdmissionsTable, AdmissionDetailModal } from "./index";
import { Loader2 } from "lucide-react";

export function AdmissionClient() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [classFilter, setClassFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

      {/* Table */}
      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#8B5E3C]" />
          </div>
        ) : (
          <AdmissionsTable applications={applications} onView={setSelectedId} />
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