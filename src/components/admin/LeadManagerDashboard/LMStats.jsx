import React from "react";
import { useSelector } from "react-redux";
import { selectSalesTeam } from "../../../redux/features/salesTeam/salesTeamSlice";

const CLOSED = ["Converted", "Failed", "Rejected"];

const isInactive48 = (l) => {
  if (CLOSED.includes(l?.status)) return false;
  const d = new Date(l?.created_at);
  return !isNaN(d.getTime()) && Date.now() - d.getTime() > 48 * 3600 * 1000;
};
const isToday = (l) => {
  const d = new Date(l?.created_at);
  if (isNaN(d.getTime())) return false;
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
};

export default function LMStats() {
  const leads = useSelector((s) => s.leads.leads) || [];
  const staff = useSelector(selectSalesTeam) || [];

  const stats = [
    { label: "Pending Review", value: leads.filter((l) => l.status === "Pending").length, color: "#f59e0b" },
    { label: "VIP Leads", value: leads.filter((l) => l.urgency === "High" && !CLOSED.includes(l.status)).length, color: "#8b5cf6" },
    { label: "Assigned Today", value: leads.filter((l) => l.assigned_to && isToday(l)).length, color: "#3b82f6" },
    { label: "Inactive 48h+", value: leads.filter(isInactive48).length, color: "#ef4444" },
    { label: "Converted", value: leads.filter((l) => l.status === "Converted").length, color: "#10b981" },
    { label: "Active Staff", value: staff.length, color: "#14b8a6" },
  ];

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
