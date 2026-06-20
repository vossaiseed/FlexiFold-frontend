import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Users, Ruler, Box, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import useMyLeads from "../../../utils/useMyLeads";
import { getLeadId } from "../../../utils/leadHelpers";

const StatCard = ({ label, value, Icon, color, bg }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${bg} ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    <p className="mt-0.5 text-xs font-medium text-slate-400">{label}</p>
  </div>
);

export default function SalesDashboardSection() {
  const myLeads = useMyLeads();
  const siteVisits = useSelector((s) => s.siteVisits.items);
  const measurements = useSelector((s) => s.measurements.items);
  const models = useSelector((s) => s.models.items);
  const projects = useSelector((s) => s.projects.items);

  const myLeadIds = useMemo(() => new Set(myLeads.map((l) => getLeadId(l))), [myLeads]);
  const countFor = (arr) => (arr || []).filter((x) => myLeadIds.has(x.lead_id)).length;
  const myProjects = (projects || []).filter((p) => myLeadIds.has(p.lead_id));

  const stats = [
    { label: "Assigned Leads", value: myLeads.length, Icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Site Visits", value: countFor(siteVisits), Icon: MapPin, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Measurements", value: countFor(measurements), Icon: Ruler, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Models", value: countFor(models), Icon: Box, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "In Progress", value: myProjects.filter((p) => p.status === "In Progress").length, Icon: Loader2, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Completed", value: myProjects.filter((p) => p.status === "Completed").length, Icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  const recent = [...myLeads]
    .filter((l) => l.created_at)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 6);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-slate-800">Recent Assigned Leads</h2>
        {recent.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">No leads assigned yet.</p>
        ) : (
          <ul className="space-y-2">
            {recent.map((l) => (
              <li key={getLeadId(l)} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{l.name}</p>
                  <p className="text-xs text-slate-400">{l.location || "—"}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-slate-500">{l.effectiveStatus}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
