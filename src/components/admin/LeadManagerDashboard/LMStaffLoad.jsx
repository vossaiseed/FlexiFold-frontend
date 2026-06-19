import React from "react";
import { useSelector } from "react-redux";
import { selectSalesTeam } from "../../../redux/features/salesTeam/salesTeamSlice";
import { leadsForStaff } from "../../../utils/staffLeads";

const CLOSED = ["Converted", "Failed", "Rejected"];

export default function LMStaffLoad() {
  const staff = useSelector(selectSalesTeam) || [];
  const leads = useSelector((s) => s.leads.leads) || [];

  const staffLoad = staff.map((s) => ({
    name: s.name,
    used: s.active_count != null ? s.active_count : leadsForStaff(leads, s).filter((l) => !CLOSED.includes(l.status)).length,
    total: s.max_lead_capacity ?? 10,
  }));

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-base">📊</span>
        <span className="text-[13px] font-bold text-slate-800">Sales Staff Load</span>
      </div>

      {staffLoad.length === 0 ? (
        <p className="text-[13px] text-slate-400">No sales staff yet.</p>
      ) : (
        <div className="flex flex-col gap-3.5">
          {staffLoad.map((item) => {
            const pct = item.total > 0 ? (item.used / item.total) * 100 : 0;
            return (
              <div key={item.name}>
                <div className="mb-1.5 flex justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-500">{item.name}</span>
                  <span className="text-[11px] font-bold text-gray-500">{item.used}/{item.total}</span>
                </div>
                <div className="h-[7px] overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${pct > 0 ? "bg-emerald-500 min-w-[8px]" : "bg-gray-200"}`}
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
