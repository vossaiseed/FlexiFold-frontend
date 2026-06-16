import React from "react";

export default function LMSection({ title }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">Lead Manager</p>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>

      <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-400">No {title.toLowerCase()} to show yet.</p>
      </div>
    </div>
  );
}
