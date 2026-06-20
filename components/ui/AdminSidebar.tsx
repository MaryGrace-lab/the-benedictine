"use client";

// ──────────────────────────────────────────────
// Admin Sidebar — Client Component
// Fixed position, scrollable nav, logout at bottom.
// ──────────────────────────────────────────────

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  LayoutDashboard, Users, UserPlus, Upload, Edit3,
  Calendar, UserCog, Settings, ChevronLeft, Menu,
} from "lucide-react";
import LogoutButton from "@/components/ui/LogoutButton";

const links = [
  { href: "/admin-portal/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin-portal/students", icon: Users, label: "Students" },
  { href: "/admin-portal/students/create", icon: UserPlus, label: "Add Student" },
  { href: "/admin-portal/results/upload", icon: Upload, label: "Upload Results" },
  { href: "/admin-portal/results/edit", icon: Edit3, label: "Edit Results" },
  { href: "/admin-portal/results/bulk-upload", icon: Upload, label: "Bulk Upload" },
  { href: "/admin-portal/sessions", icon: Calendar, label: "Sessions" },
  { href: "/admin-portal/teachers", icon: UserCog, label: "Teachers" },
  { href: "/admin-portal/settings", icon: Settings, label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white border-r border-[#8B5E3C]/10 h-screen transition-all duration-300 flex flex-col fixed left-0 top-0 z-30`}
    >
      {/* Logo — fixed at top */}
      <div className="p-4 border-b border-[#8B5E3C]/10 flex items-center gap-3">
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={36}
          height={36}
          className="rounded-lg flex-shrink-0"
        />
        {!collapsed && (
          <span className="font-bold text-[#3D1902] text-sm">Administrative Portal</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-[#8B5E3C] hover:bg-[#8B5E3C]/10 p-1.5 rounded-lg"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Links — scrollable */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#8B5E3C] text-white shadow-md"
                  : "text-[#8B5E3C] hover:bg-[#8B5E3C]/10"
              }`}
            >
              <link.icon size={18} />
              {!collapsed && link.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout — fixed at bottom */}
      <div className="p-3 border-t border-[#8B5E3C]/10">
        <LogoutButton type="admin" showIcon />
      </div>
    </aside>
  );
}