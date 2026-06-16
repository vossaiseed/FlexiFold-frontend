import React from "react";

const recentActivity = [
  { id: 1, text: "Admin updated Toji joseph & brothers", time: "06 Jun 2026 6:20 am IST", color: "#3b82f6" },
  { id: 2, text: "Admin updated Toji joseph & brothers", time: "06 Jun 2026 6:19 am IST", color: "#3b82f6" },
  { id: 3, text: "MI updated Toji joseph & brothers", time: "09 May 2026 10:07 am IST", color: "#10b981" },
  { id: 4, text: "MI updated Sidharth Roy", time: "07 May 2026 6:19 pm IST", color: "#10b981" },
];

export default function LMRecentActivity() {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-base">🕒</span>
        <span className="text-[13px] font-bold text-slate-800">Recent Activity</span>
      </div>

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
    </section>
  );
}
