import React from "react";
import { useSelector } from "react-redux";
import { selectSalesTeam } from "../../../redux/features/salesTeam/salesTeamSlice";

const CLOSED = ["Converted", "Failed", "Rejected"];
const norm = (s) => (s || "").trim().toLowerCase();
const initial = (name) => name?.trim()?.[0]?.toUpperCase() || "?";

export default function LMSalesStaff() {
  const team = useSelector(selectSalesTeam) || [];
  const leads = useSelector((s) => s.leads.leads) || [];

  const staff = team.map((s) => {
    // Prefer backend-computed counts; fall back to a client name match.
    const assignedLeads = leads.filter((l) => norm(l.assigned_name) === norm(s.name));
    const active = assignedLeads.filter((l) => !CLOSED.includes(l.status));
    return {
      id: s.id,
      name: s.name,
      phone: s.phone,
      status: (s.full_access ?? true) ? "Available" : "Limited",
      languages: s.language ? [{ name: s.language, level: s.proficiency || 0 }] : [],
      assigned: s.leads_count != null ? s.leads_count : assignedLeads.length,
      active: s.active_count != null ? s.active_count : active.length,
      capacity: s.max_lead_capacity ?? 10,
      converted: s.converted_count != null ? s.converted_count : assignedLeads.filter((l) => l.status === "Converted").length,
      vip: s.vip_count != null ? s.vip_count : active.filter((l) => l.urgency === "High").length,
    };
  });

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">All Sales Staff</p>

      {staff.length === 0 ? (
        <p className="text-[13px] text-slate-400">No sales staff yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {staff.map((s) => {
            const pct = s.capacity > 0 ? (s.active / s.capacity) * 100 : 0;
            const stats = [
              { label: "Assigned", value: s.assigned, color: "text-slate-900" },
              { label: "Active", value: `${s.active}/${s.capacity}`, color: "text-slate-900" },
              { label: "Converted", value: s.converted, color: "text-emerald-600" },
              { label: "VIP", value: s.vip, color: "text-violet-600" },
            ];
            return (
              <div key={s.id} className="rounded-2xl border border-slate-100 bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      {initial(s.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.phone}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                    {s.status}
                  </span>
                </div>

                {s.languages.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.languages.map((l) => (
                      <span key={l.name} className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                        {l.name} {l.level}/10
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 grid grid-cols-4 gap-2">
                  {stats.map((st) => (
                    <div key={st.label} className="rounded-xl border border-slate-100 bg-white p-2.5 text-center">
                      <p className={`text-base font-bold ${st.color}`}>{st.value}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{st.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${pct > 0 ? "bg-emerald-500" : "bg-slate-200"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
