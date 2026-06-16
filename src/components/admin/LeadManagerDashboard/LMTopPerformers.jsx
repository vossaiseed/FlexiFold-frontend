import React from "react";

const topPerformers = [
  { name: "MI", detail: "0/2 · 0% conversion", score: 28 },
  { name: "MUHAMMED MISVAR NISHAD", detail: "0/0 · 0% conversion", score: 0 },
  { name: "abdullah", detail: "0/0 · 0% conversion", score: 0 },
];

const AVATAR_COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#f97316", "#06b6d4"];

function getAvatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
const getInitial = (name) => name.trim()[0].toUpperCase();

export default function LMTopPerformers() {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-base">🏆</span>
        <span className="text-[13px] font-bold text-slate-800">Top Performers</span>
      </div>

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
    </section>
  );
}
