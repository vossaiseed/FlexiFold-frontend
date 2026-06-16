import React from "react";

const actions = [
  { label: "Pending Review", count: 0, emoji: "⏳", danger: false },
  { label: "Inactive Alerts", count: 2, emoji: "⚠️", danger: true },
  { label: "Sales Team", count: 3, emoji: "👥", danger: false },
];

export default function LMQuickActions() {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-base">⚡</span>
        <span className="text-[13px] font-bold text-slate-800">Quick Actions</span>
      </div>

      <button className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-3 text-[13px] font-semibold text-white transition hover:bg-emerald-600">
        <span className="text-base leading-none">+</span> Add Lead
      </button>

      <div className="flex flex-col gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-gray-50 px-3.5 py-3 text-left transition hover:bg-slate-100"
          >
            <span className="text-base">{a.emoji}</span>
            <span className={`flex-1 text-[13px] font-semibold ${a.danger ? "text-red-600" : "text-slate-700"}`}>
              {a.label}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${a.danger ? "bg-red-100 text-red-600" : "bg-slate-200 text-slate-600"}`}>
              {a.count}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
