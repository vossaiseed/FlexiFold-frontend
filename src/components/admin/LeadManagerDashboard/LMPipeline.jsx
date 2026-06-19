import React from "react";
import { useSelector } from "react-redux";

const STAGES = [
  { label: "Pending", status: "Pending", color: "#f59e0b" },
  { label: "New", status: "New", color: "#3b82f6" },
  { label: "Discussion", status: "Discussion", color: "#8b5cf6" },
  { label: "Follow-up", status: "Follow-up", color: "#f97316" },
  { label: "Converted", status: "Converted", color: "#10b981" },
  { label: "Failed", status: "Failed", color: "#ef4444" },
];

export default function LMPipeline() {
  const leads = useSelector((s) => s.leads.leads) || [];
  const pipeline = STAGES.map((s) => ({
    ...s,
    value: leads.filter((l) => l.status === s.status).length,
  }));

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
