import React from "react";

const stats = [
  { label: "Pending Review", value: 0, color: "#f59e0b" },
  { label: "VIP Leads", value: 0, color: "#8b5cf6" },
  { label: "Assigned Today", value: 0, color: "#3b82f6" },
  { label: "Inactive 48h+", value: 2, color: "#ef4444" },
  { label: "Converted", value: 0, color: "#10b981" },
  { label: "Active Staff", value: 3, color: "#14b8a6" },
];

export default function LMStats() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="text-[32px] font-bold leading-none" style={{ color: s.color }}>
            {s.value}
          </div>
          <div className="mt-2 text-[13px] font-medium text-slate-400">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
