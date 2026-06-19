import React from "react";
import { useSelector } from "react-redux";
import { formatLeadTime } from "../../../utils/leadHelpers";

const STATUS_COLOR = {
  New: "#3b82f6",
  Pending: "#f59e0b",
  Discussion: "#8b5cf6",
  "Follow-up": "#f97316",
  Converted: "#10b981",
  Failed: "#ef4444",
  Rejected: "#ef4444",
};

export default function LMRecentActivity() {
  const leads = useSelector((s) => s.leads.leads) || [];

  const recentActivity = [...leads]
    .filter((l) => l?.created_at)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 6)
    .map((l) => ({
      id: l.id,
      text: `${l.assigned_name || l.partner_name || "Lead"} · ${l.name} (${l.status})`,
      time: formatLeadTime(l.created_at),
      color: STATUS_COLOR[l.status] || "#94a3b8",
    }));

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-base">🕒</span>
        <span className="text-[13px] font-bold text-slate-800">Recent Activity</span>
      </div>

      {recentActivity.length === 0 ? (
        <p className="text-[13px] text-slate-400">No recent activity.</p>
      ) : (
        <ul className="flex flex-col gap-3.5">
          {recentActivity.map((a) => (
            <li key={a.id} className="flex gap-2.5">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: a.color }} />
              <div className="min-w-0">
                <p className="text-[13px] text-slate-700">{a.text}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{a.time}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
