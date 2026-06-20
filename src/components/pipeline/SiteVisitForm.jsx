import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSiteVisit } from "../../redux/features/siteVisits/siteVisitsSlice";
import { getLeadId, formatLeadDate } from "../../utils/leadHelpers";
import { SITE_VISIT_STATUSES } from "../../utils/pipeline";

const inputClass = "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100";
const labelClass = "text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400";

const statusChip = {
  Scheduled: "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
  Rescheduled: "bg-slate-100 text-slate-600",
};

// Per-lead Site Visit section. Parent fetches site visits into the store;
// this component reads + creates them.
export default function SiteVisitForm({ leadId, defaultLocation }) {
  const dispatch = useDispatch();
  const allVisits = useSelector((s) => s.siteVisits.items);
  const visits = useMemo(() => (allVisits || []).filter((v) => v.lead_id === leadId), [allVisits, leadId]);

  const [visit, setVisit] = useState({ visit_date: "", location: "", notes: "", status: "Scheduled" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const add = async () => {
    setBusy(true);
    setError(null);
    try {
      await dispatch(
        createSiteVisit({
          lead_id: leadId,
          visit_date: visit.visit_date || null,
          location: visit.location || defaultLocation || null,
          notes: visit.notes || null,
          status: visit.status,
        })
      ).unwrap();
      setVisit({ visit_date: "", location: "", notes: "", status: "Scheduled" });
    } catch (e) {
      setError(typeof e === "string" ? e : e?.message || "Could not add site visit.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Site Visit</p>

      {visits.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {visits.map((v) => (
            <li key={getLeadId(v)} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
              <span>{formatLeadDate(v.visit_date) || "—"} · {v.location || "—"}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusChip[v.status] || "bg-slate-200 text-slate-600"}`}>{v.status}</span>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <label>
          <span className={labelClass}>Visit date</span>
          <input type="datetime-local" className={inputClass} value={visit.visit_date} onChange={(e) => setVisit({ ...visit, visit_date: e.target.value })} />
        </label>
        <label>
          <span className={labelClass}>Status</span>
          <select className={inputClass} value={visit.status} onChange={(e) => setVisit({ ...visit, status: e.target.value })}>
            {SITE_VISIT_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className={labelClass}>Location</span>
          <input className={inputClass} value={visit.location} onChange={(e) => setVisit({ ...visit, location: e.target.value })} placeholder={defaultLocation || "Site location"} />
        </label>
        <label className="sm:col-span-2">
          <span className={labelClass}>Notes</span>
          <textarea rows={2} className={inputClass} value={visit.notes} onChange={(e) => setVisit({ ...visit, notes: e.target.value })} />
        </label>
      </div>

      <button onClick={add} disabled={busy} className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50">
        {busy ? "Adding…" : "Add Site Visit"}
      </button>
    </div>
  );
}
