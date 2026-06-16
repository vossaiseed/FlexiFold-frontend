import React from "react";

const pipeline = [
  { label: "Pending", value: 0, color: "#f59e0b" },
  { label: "New", value: 48, color: "#3b82f6" },
  { label: "Discussion", value: 2, color: "#8b5cf6" },
  { label: "Follow-up", value: 0, color: "#f97316" },
  { label: "Converted", value: 0, color: "#10b981" },
  { label: "Failed", value: 0, color: "#ef4444" },
];

export default function LMPipeline() {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-base">📊</span>
        <span className="text-[13px] font-bold text-slate-800">Lead Pipeline</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {pipeline.map((stage) => (
          <div key={stage.label} className="min-w-24 flex-1 rounded-xl border border-slate-100 bg-gray-50 p-3 text-center">
            <p className="text-2xl font-bold leading-none" style={{ color: stage.color }}>{stage.value}</p>
            <p className="mt-1.5 text-[11px] font-medium text-slate-500">{stage.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
