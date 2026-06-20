import React from "react";
import { useSelector } from "react-redux";

const Row = ({ label, value, color }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-sm text-slate-500">{label}</span>
    <span className={`text-sm font-bold ${color || "text-slate-900"}`}>{value}</span>
  </div>
);

export default function PipelineStatsCard() {
  const siteVisits = useSelector((s) => s.siteVisits.items);
  const measurements = useSelector((s) => s.measurements.items);
  const models = useSelector((s) => s.models.items);
  const projects = useSelector((s) => s.projects.items);

  const inProgress = (projects || []).filter((p) => p.status === "In Progress").length;
  const completed = (projects || []).filter((p) => p.status === "Completed").length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-900">Fulfilment Pipeline</p>
      <div className="mt-3 divide-y divide-slate-100">
        <Row label="Site Visits" value={(siteVisits || []).length} />
        <Row label="Measurements" value={(measurements || []).length} />
        <Row label="Models" value={(models || []).length} />
        <Row label="Projects In Progress" value={inProgress} color="text-amber-600" />
        <Row label="Projects Completed" value={completed} color="text-emerald-600" />
      </div>
    </div>
  );
}
