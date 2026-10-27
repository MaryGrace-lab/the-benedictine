//components/ui/LogoutButton.tsx
"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

type Props = {
  type?: "student" | "admin" | "teacher";
  showIcon?: boolean;
};

export default function LogoutButton({ type = "student", showIcon = false }: Props) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    await fetch(`/api/auth/${type}-logout`, { method: "POST" });
    router.push(`/${type}-portal/login`);
    router.refresh();
  };

  const portalName =
    type === "admin" ? "Admin Portal" : type === "teacher" ? "Teacher Portal" : "Student Portal";

  return (
    <>
      {showIcon ? (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Logout
        </button>
      )}

      {showConfirm &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={24} className="text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-[#3D1902] mb-2">Confirm Logout</h2>
              <p className="text-sm text-slate-500 mb-4">
                Are you sure you want to logout from the {portalName}?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}