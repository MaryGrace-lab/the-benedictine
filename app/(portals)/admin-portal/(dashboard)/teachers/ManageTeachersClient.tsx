"use client";

// ──────────────────────────────────────────────
// Manage Teachers Client — Client Component
// Handles create, edit, delete, and UI.
// Receives teachers as props from server.
// ──────────────────────────────────────────────

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import LogoutButton from "@/components/ui/LogoutButton";

// ── Types ──
type Teacher = {
  id: string;
  name: string;
  email: string;
  role: string;
  assignedClass: string | null;
  createdAt: Date;
};

const CLASSES = ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];

interface Props {
  initialTeachers: Teacher[];
}

export default function ManageTeachersClient({ initialTeachers }: Props) {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Create form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [assignedClass, setAssignedClass] = useState("");
  const [creating, setCreating] = useState(false);

  // Edit state
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editClass, setEditClass] = useState("");
  const [saving, setSaving] = useState(false);

  // Password info
  const [passwordReveal, setPasswordReveal] = useState<string | null>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      setTeachers(data.teachers || []);
    } catch {
      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !assignedClass) {
      toast.error("All fields are required");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/teachers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, assignedClass }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Teacher created: ${name}`);
        setName(""); setEmail(""); setPassword(""); setAssignedClass("");
        fetchTeachers();
      } else {
        toast.error(data.error || "Failed to create teacher");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (teacherId: string) => {
    setDeletingId(teacherId);
    try {
      const res = await fetch("/api/teachers/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Teacher removed");
        fetchTeachers();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setEditName(teacher.name);
    setEditEmail(teacher.email);
    setEditPassword("");
    setEditClass(teacher.assignedClass || "");
  };

  const handleEdit = async () => {
    if (!editingTeacher) return;
    setSaving(true);
    try {
      const res = await fetch("/api/teachers/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: editingTeacher.id,
          name: editName,
          email: editEmail,
          password: editPassword || undefined,
          assignedClass: editClass,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Teacher updated successfully");
        setEditingTeacher(null);
        fetchTeachers();
      } else {
        toast.error(data.error || "Failed to update teacher");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 md:p-8">
      <Toaster position="top-center" />

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#3D1902]">👨‍🏫 Manage Teachers</h1>
            <p className="text-xs text-[#8B5E3C]/70 mt-1">Create and manage teacher accounts with class assignments</p>
          </div>
          <LogoutButton type="admin" />
        </div>

        {/* Create Form */}
        <div className="bg-white p-6 rounded-2xl border border-[#8B5E3C]/10 shadow-sm mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#3D1902] mb-4">Add New Teacher</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label htmlFor="t-name" className="block text-[10px] font-extrabold uppercase text-[#8B5E3C] mb-1.5">Full Name *</label>
              <input id="t-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Grace Okonkwo" className="w-full p-2.5 border rounded-xl text-sm" required />
            </div>
            <div>
              <label htmlFor="t-email" className="block text-[10px] font-extrabold uppercase text-[#8B5E3C] mb-1.5">Email *</label>
              <input id="t-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@school.com" className="w-full p-2.5 border rounded-xl text-sm" required />
            </div>
            <div>
              <label htmlFor="t-password" className="block text-[10px] font-extrabold uppercase text-[#8B5E3C] mb-1.5">Password *</label>
              <input id="t-password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full p-2.5 border rounded-xl text-sm font-mono" required />
            </div>
            <div>
              <label htmlFor="t-class" className="block text-[10px] font-extrabold uppercase text-[#8B5E3C] mb-1.5">Class *</label>
              <select id="t-class" aria-label="Assigned Class" value={assignedClass} onChange={(e) => setAssignedClass(e.target.value)} className="w-full p-2.5 border rounded-xl text-sm cursor-pointer" required>
                <option value="">Select Class</option>
                {CLASSES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <button type="submit" disabled={creating} className="py-2.5 bg-[#8B5E3C] text-white rounded-xl font-bold disabled:opacity-50 transition-all text-sm">
              {creating ? "Adding..." : "+ Add Teacher"}
            </button>
          </form>
        </div>

        {/* Teachers List */}
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border text-center">
            <div className="w-6 h-6 border-2 border-[#8B5E3C] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-[#8B5E3C] animate-pulse">Loading teachers...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border text-center">
            <p className="text-sm text-slate-400">No teachers found. Add one above.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left" aria-label="Teachers List">
                <thead>
                  <tr className="bg-[#FAF7F2] text-[10px] font-extrabold uppercase text-[#8B5E3C] border-b">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Class</th>
                    <th className="p-4 hidden md:table-cell">Created</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {teachers.map((t) => (
                    <tr key={t.id} className="hover:bg-[#FAF7F2]/30">
                      <td className="p-4 font-bold text-[#3D1902]">{t.name}</td>
                      <td className="p-4 text-[#8B5E3C] font-mono text-xs">{t.email}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-[#8B5E3C]/10 text-[#8B5E3C] rounded-lg text-[11px] font-black border border-[#8B5E3C]/5">
                          {t.assignedClass || "—"}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-400 hidden md:table-cell">
                        {new Date(t.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 justify-center">
                          <button onClick={() => setPasswordReveal(t.email)} className="p-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-bold transition-all active:scale-95" title="Password Info" aria-label={`View password info for ${t.name}`}>🔑</button>
                          <button onClick={() => openEdit(t)} className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all active:scale-95" title="Edit Teacher" aria-label={`Edit ${t.name}`}>✏️</button>
                          <button onClick={() => { if (window.confirm(`Delete ${t.name}?`)) handleDelete(t.id); }} disabled={deletingId === t.id} className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all disabled:opacity-40 active:scale-95" title="Delete Teacher" aria-label={`Delete ${t.name}`}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button onClick={() => router.push("/admin-portal/dashboard")} className="w-full mt-6 py-3 text-xs font-bold uppercase text-[#8B5E3C] hover:text-[#3D1902] transition-colors">
          ← Back to Dashboard
        </button>
      </div>

      {/* Password Info Modal */}
      {passwordReveal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setPasswordReveal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-lg mb-4">🔒</div>
            <h3 className="font-bold text-sm text-[#3D1902] mb-2">Password Not Retrievable</h3>
            <p className="text-xs text-[#8B5E3C] mb-3">The password for <strong className="font-mono">{passwordReveal}</strong> is encrypted and cannot be viewed.</p>
            <div className="bg-slate-50 rounded-xl p-3 mb-4 text-[11px] text-slate-500">⚠️ To reset it, click <strong>✏️ Edit</strong> and enter a new password.</div>
            <button onClick={() => setPasswordReveal(null)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-xs uppercase transition-colors" aria-label="Close password info">Close</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setEditingTeacher(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-sm text-[#3D1902] mb-4">✏️ Edit Teacher</h3>
            <div className="space-y-4">
              <div><label htmlFor="edit-name" className="block text-[10px] font-extrabold uppercase text-[#8B5E3C] mb-1.5">Name</label><input id="edit-name" type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full p-2.5 border rounded-xl text-sm" /></div>
              <div><label htmlFor="edit-email" className="block text-[10px] font-extrabold uppercase text-[#8B5E3C] mb-1.5">Email</label><input id="edit-email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full p-2.5 border rounded-xl text-sm font-mono" /></div>
              <div><label htmlFor="edit-password" className="block text-[10px] font-extrabold uppercase text-[#8B5E3C] mb-1.5">New Password (leave blank to keep current)</label><input id="edit-password" type="text" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="Enter new password" className="w-full p-2.5 border rounded-xl text-sm font-mono" /></div>
              <div><label htmlFor="edit-class" className="block text-[10px] font-extrabold uppercase text-[#8B5E3C] mb-1.5">Assigned Class</label><select id="edit-class" aria-label="Edit Assigned Class" value={editClass} onChange={(e) => setEditClass(e.target.value)} className="w-full p-2.5 border rounded-xl text-sm cursor-pointer"><option value="">Select Class</option>{CLASSES.map((c) => (<option key={c} value={c}>{c}</option>))}</select></div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditingTeacher(null)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-xs uppercase transition-colors">Cancel</button>
                <button onClick={handleEdit} disabled={saving} className="flex-1 py-2.5 bg-[#8B5E3C] hover:bg-[#6B3F2C] text-white font-bold rounded-xl text-xs uppercase transition-all disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}