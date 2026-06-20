import React from "react";
import { MapPin, Phone, CheckCircle2, CalendarClock, Pause } from "lucide-react";
import { PROJECT_STATUSES } from "../../utils/pipeline";
import { formatLeadDate } from "../../utils/leadHelpers";

const accent = {
  Pending: "border-l-slate-300",
  "In Progress": "border-l-amber-400",
  Completed: "border-l-emerald-500",
  "On Hold": "border-l-red-400",
};
const statusStyle = {
  Pending: "bg-slate-100 text-slate-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
  "On Hold": "bg-red-100 text-red-700",
};

// 3-step progress (On Hold is shown as a separate state).
const STEPS = ["Pending", "In Progress", "Completed"];

function Stepper({ status }) {
  if (status === "On Hold") {
    return (
      <div className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
        <Pause className="h-3.5 w-3.5" /> On Hold
      </div>
    );
  }
  const current = Math.max(0, STEPS.indexOf(status));
  return (
    <div className="flex items-center">
      {STEPS.map((s, i) => {
        const done = i <= current;
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1">
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                {i + 1}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-1 h-0.5 flex-1 min-w-4.5 rounded ${i < current ? "bg-emerald-500" : "bg-slate-200"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function PMProjectCard({ project, onStatus, busy }) {
  const id = project.id ?? project._id;
  const initial = project.lead_name?.trim()?.[0]?.toUpperCase() || "P";

  return (
    <div className={`flex flex-col gap-3 rounded-2xl border border-slate-200 border-l-4 ${accent[project.status] || "border-l-slate-300"} bg-white p-4 shadow-sm transition hover:shadow-md`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-slate-900">{project.lead_name || "Project"}</p>
            {project.lead_phone && (
              <p className="flex items-center gap-1 text-xs text-slate-400"><Phone className="h-3 w-3" />{project.lead_phone}</p>
            )}
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[project.status] || "bg-slate-100 text-slate-700"}`}>
          {project.status}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1 text-xs text-slate-500">
        {project.lead_location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" />{project.lead_location}</span>}
        <span className="inline-flex items-center gap-1.5">
          <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
          {project.status === "Completed" && project.completed_at
            ? `Completed ${formatLeadDate(project.completed_at)}`
            : `Assigned ${formatLeadDate(project.assigned_at || project.created_at)}`}
        </span>
      </div>

      {project.notes && <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{project.notes}</p>}

      {/* Progress */}
      <div className="border-t border-slate-100 pt-3">
        <Stepper status={project.status} />
      </div>

      {/* Status controls */}
      <div className="flex flex-wrap gap-1.5">
        {PROJECT_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => onStatus(id, s)}
            disabled={busy || project.status === s}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed ${
              project.status === s
                ? "bg-emerald-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {project.status !== "Completed" && (
        <button
          onClick={() => onStatus(id, "Completed")}
          disabled={busy}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" /> Mark Completed
        </button>
      )}
    </div>
  );
}
