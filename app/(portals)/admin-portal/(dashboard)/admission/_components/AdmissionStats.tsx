"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, Clock, UserX } from "lucide-react";

interface StatsProps {
  total: number;
  admitted: number;
  pending: number;
  rejected: number;
}

export default function AdmissionStats({ total, admitted, pending, rejected }: StatsProps) {
  const stats = [
    { label: "Total Applications", value: total, icon: Users },
    { label: "Admitted", value: admitted, icon: UserCheck },
    { label: "Pending Review", value: pending, icon: Clock },
    { label: "Rejected", value: rejected, icon: UserX },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="bg-white rounded-2xl p-5 border border-[#8B5E3C]/10 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#8B5E3C]/10 text-[#8B5E3C] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-[#3D1902]">{stat.value}</p>
            <p className="text-xs text-[#8B5E3C]/50 font-medium mt-0.5">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}