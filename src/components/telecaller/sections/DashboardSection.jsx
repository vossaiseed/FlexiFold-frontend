import React from "react";
import { Users, CalendarClock, CheckCircle2, Sparkles, MessageSquare, Hourglass, MapPin } from "lucide-react";
import { formatLeadTime } from "../../../utils/leadHelpers";
import useMyLeads from "../../../utils/useMyLeads";

export default function DashboardSection() {
  // The telecaller's own assigned leads (matched by Auth id / salesstaff id / name).
  const myLeads = useMyLeads();

  const countBy = (status) => myLeads.filter((l) => l.effectiveStatus === status).length;
  const stats = [
    { label: "Assigned Leads", value: myLeads.length, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "New Leads", value: countBy("New"), icon: Sparkles, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Discussion Leads", value: countBy("Discussion"), icon: MessageSquare, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Follow-ups Due", value: countBy("Follow-up"), icon: CalendarClock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Conversion Pending", value: countBy("Conversion Pending"), icon: Hourglass, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Converted Leads", value: countBy("Converted"), icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  ];

  const recent = [...myLeads]
    .filter((l) => l.created_at)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  const followUps = myLeads.filter((l) => l.effectiveStatus === "Follow-up");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${bg} ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="mt-0.5 text-xs font-medium text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent leads */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-800">Recent Leads</h2>
          {recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">No leads assigned yet.</p>
          ) : (
            <ul className="space-y-2">
              {recent.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{l.name}</p>
                    <p className="text-xs text-slate-400">{l.status}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{formatLeadTime(l.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Upcoming follow-ups */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-800">Follow-ups</h2>
          {followUps.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">No follow-ups pending.</p>
          ) : (
            <ul className="space-y-2">
              {followUps.slice(0, 6).map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                      <CalendarClock className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-slate-800">{f.name}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3 w-3" /> {f.location || "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
