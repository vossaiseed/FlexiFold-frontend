import React from "react";
import { Phone, Users, CalendarClock, CheckCircle2, PhoneIncoming, PhoneMissed } from "lucide-react";

const stats = [
  { label: "Calls Today", value: "32", icon: Phone, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Assigned Leads", value: "18", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Follow-ups Due", value: "5", icon: CalendarClock, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Converted", value: "4", icon: CheckCircle2, color: "text-violet-600", bg: "bg-violet-50" },
];

const recentCalls = [
  { id: 1, name: "Toji Joseph", outcome: "Connected", time: "10:42 am", ok: true },
  { id: 2, name: "Sidharth Roy", outcome: "Not Reachable", time: "10:15 am", ok: false },
  { id: 3, name: "Arun Public RV", outcome: "Connected", time: "09:50 am", ok: true },
  { id: 4, name: "Hashir Ali", outcome: "Busy", time: "09:30 am", ok: false },
];

const followUps = [
  { id: 1, name: "Meera Nair", time: "Today · 02:00 pm" },
  { id: 2, name: "Anwar Sadath", time: "Today · 04:30 pm" },
  { id: 3, name: "Divya S", time: "Tomorrow · 11:00 am" },
];

export default function DashboardSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
        {/* Recent calls */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-800">Recent Calls</h2>
          <ul className="space-y-2">
            {recentCalls.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.ok ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                    {c.ok ? <PhoneIncoming className="h-4 w-4" /> : <PhoneMissed className="h-4 w-4" />}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.outcome}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{c.time}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Today's follow-ups */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-slate-800">Upcoming Follow-ups</h2>
          <ul className="space-y-2">
            {followUps.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <CalendarClock className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold text-slate-800">{f.name}</p>
                </div>
                <span className="text-xs text-slate-400">{f.time}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
