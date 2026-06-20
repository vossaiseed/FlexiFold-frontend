import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { MapPin, Ruler, Box, Check, Clock, AlertCircle } from "lucide-react";
import { leadTaskStatuses } from "../../utils/pipeline";

// state -> badge label + colour + icon
const STATE = {
  Pending: { label: "Pending", cls: "bg-slate-100 text-slate-500", Icon: Clock },
  Scheduled: { label: "Scheduled", cls: "bg-amber-100 text-amber-700", Icon: Clock },
  Uploaded: { label: "In Review", cls: "bg-amber-100 text-amber-700", Icon: Clock },
  Completed: { label: "Completed", cls: "bg-emerald-100 text-emerald-700", Icon: Check },
  Rejected: { label: "Rejected", cls: "bg-red-100 text-red-700", Icon: AlertCircle },
};

// Checklist of Site Visit / Measurement / Model with status badges + a progress
// bar. Reads the records from the store (parent fetches them).
export default function LeadTaskProgress({ leadId }) {
  const allVisits = useSelector((s) => s.siteVisits.items);
  const allMeasurements = useSelector((s) => s.measurements.items);
  const allModels = useSelector((s) => s.models.items);

  const ctx = useMemo(() => ({
    siteVisits: (allVisits || []).filter((x) => x.lead_id === leadId),
    measurements: (allMeasurements || []).filter((x) => x.lead_id === leadId),
    models: (allModels || []).filter((x) => x.lead_id === leadId),
  }), [allVisits, allMeasurements, allModels, leadId]);

  const st = leadTaskStatuses(ctx);
  const rows = [
    { label: "Site Visit", Icon: MapPin, state: st.siteVisit },
    { label: "Measurement", Icon: Ruler, state: st.measurement },
    { label: "Model", Icon: Box, state: st.model },
  ];
  const done = rows.filter((r) => r.state === "Completed").length;
  const pct = Math.round((done / rows.length) * 100);

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Task Progress</p>
        <span className="text-[11px] font-semibold text-slate-500">{done}/{rows.length} completed</span>
      </div>
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="space-y-1.5">
        {rows.map((r) => {
          const meta = STATE[r.state] || STATE.Pending;
          const BadgeIcon = meta.Icon;
          return (
            <li key={r.label} className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                <r.Icon className="h-3.5 w-3.5 text-slate-400" /> {r.label}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.cls}`}>
                <BadgeIcon className="h-3 w-3" /> {meta.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
