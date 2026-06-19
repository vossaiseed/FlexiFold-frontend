import React from "react";
import { useSelector } from "react-redux";
import { selectSalesTeam } from "../../../redux/features/salesTeam/salesTeamSlice";

const AVATAR_COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#f97316", "#06b6d4"];

function getAvatarColor(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
const getInitial = (name = "") => name.trim()?.[0]?.toUpperCase() || "?";
const norm = (s) => (s || "").trim().toLowerCase();

export default function LMTopPerformers() {
  const staff = useSelector(selectSalesTeam) || [];
  const leads = useSelector((s) => s.leads.leads) || [];

  const topPerformers = staff
    .map((s) => {
      const total = s.leads_count != null ? s.leads_count : leads.filter((l) => norm(l.assigned_name) === norm(s.name)).length;
      const converted = s.converted_count != null ? s.converted_count : leads.filter((l) => norm(l.assigned_name) === norm(s.name) && l.status === "Converted").length;
      const pct = total ? Math.round((converted / total) * 100) : 0;
      return {
        name: s.name,
        detail: `${converted}/${total} · ${pct}% conversion`,
        score: converted,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-base">🏆</span>
        <span className="text-[13px] font-bold text-slate-800">Top Performers</span>
      </div>

      {topPerformers.length === 0 ? (
        <p className="text-[13px] text-slate-400">No sales staff yet.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
          {topPerformers.map((p) => (
            <div key={p.name} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-gray-50 px-3.5 py-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: getAvatarColor(p.name) }}
              >
                {getInitial(p.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-gray-800">{p.name}</div>
                <div className="mt-0.5 text-[11px] text-gray-400">{p.detail}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[13px] font-bold text-orange-600">{p.score}</div>
                <div className="text-[11px] text-gray-400">score</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
