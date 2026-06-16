import React from "react";

const staff = [
  {
    id: 1,
    name: "MUHAMMED MISVAR NISHAD",
    phone: "9809437276",
    status: "Available",
    languages: [
      { name: "English", level: 9 },
      { name: "Hindi", level: 8 },
      { name: "Tamil", level: 9 },
      { name: "Malayalam", level: 10 },
    ],
    assigned: 0,
    active: 0,
    capacity: 10,
    converted: 0,
    vip: 0,
  },
  {
    id: 2,
    name: "MI",
    phone: "6362917761",
    status: "Available",
    languages: [],
    assigned: 2,
    active: 2,
    capacity: 10,
    converted: 0,
    vip: 0,
  },
  {
    id: 3,
    name: "abdullah",
    phone: "8606766902",
    status: "Available",
    languages: [],
    assigned: 0,
    active: 0,
    capacity: 20,
    converted: 0,
    vip: 0,
  },
];

const initial = (name) => name?.trim()?.[0]?.toUpperCase() || "?";

export default function LMSalesStaff() {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">All Sales Staff</p>

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
              {/* Header */}
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

              {/* Languages */}
              {s.languages.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.languages.map((l) => (
                    <span key={l.name} className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                      {l.name} {l.level}/10
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="mt-3 grid grid-cols-4 gap-2">
                {stats.map((st) => (
                  <div key={st.label} className="rounded-xl border border-slate-100 bg-white p-2.5 text-center">
                    <p className={`text-base font-bold ${st.color}`}>{st.value}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{st.label}</p>
                  </div>
                ))}
              </div>

              {/* Capacity bar */}
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
    </section>
  );
}
