import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, X, FileText, Ruler, Box, MapPin } from "lucide-react";
import { fetchMeasurements, updateMeasurement } from "../../redux/features/measurements/measurementsSlice";
import { fetchModels, updateModel } from "../../redux/features/models/modelsSlice";
import { fetchSiteVisits } from "../../redux/features/siteVisits/siteVisitsSlice";
import { getLeadId, formatLeadDate } from "../../utils/leadHelpers";
import { isPendingVerification } from "../../utils/pipeline";

const FileLinks = ({ urls }) =>
  urls?.length ? (
    <div className="mt-1 flex flex-wrap gap-2">
      {urls.map((u, i) => (
        <a key={i} href={u} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline">
          <FileText className="h-3 w-3" /> File {i + 1}
        </a>
      ))}
    </div>
  ) : null;

const siteVisitChip = {
  Scheduled: "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
  Rescheduled: "bg-slate-100 text-slate-600",
};

export default function PMVerifications() {
  const dispatch = useDispatch();
  const measurements = useSelector((s) => s.measurements.items);
  const models = useSelector((s) => s.models.items);
  const siteVisits = useSelector((s) => s.siteVisits.items);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    dispatch(fetchSiteVisits());
    dispatch(fetchMeasurements());
    dispatch(fetchModels());
  }, [dispatch]);

  // Group all of a lead's pending items into one card.
  const groups = useMemo(() => {
    const pendingM = (measurements || []).filter(isPendingVerification);
    const pendingMd = (models || []).filter(isPendingVerification);
    const leadIds = [...new Set([...pendingM, ...pendingMd].map((x) => x.lead_id))];

    return leadIds
      .map((leadId) => {
        const ms = pendingM.filter((x) => x.lead_id === leadId);
        const md = pendingMd.filter((x) => x.lead_id === leadId);
        const visits = (siteVisits || []).filter((x) => x.lead_id === leadId);
        const leadName = ms[0]?.lead_name || md[0]?.lead_name || visits[0]?.lead_name || "Lead";
        const latest = [...ms, ...md].reduce(
          (acc, x) => (new Date(x.created_at) > acc ? new Date(x.created_at) : acc),
          new Date(0)
        );
        return { leadId, leadName, measurements: ms, models: md, visits, latest };
      })
      .sort((a, b) => b.latest - a.latest);
  }, [measurements, models, siteVisits]);

  const total = groups.reduce((n, g) => n + g.measurements.length + g.models.length, 0);

  const verify = async (kind, id, status) => {
    setBusyId(`${kind}-${id}`);
    try {
      if (kind === "measurement") await dispatch(updateMeasurement({ id, changes: { status } })).unwrap();
      else await dispatch(updateModel({ id, changes: { status } })).unwrap();
    } catch { /* surfaced via slice error */ }
    finally { setBusyId(null); }
  };

  const VerifyRow = ({ kind, row, icon: Icon, label }) => {
    const id = getLeadId(row);
    const busy = busyId === `${kind}-${id}`;
    return (
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Icon className="h-3.5 w-3.5" /> {label}
          </span>
          <span className="text-[11px] text-slate-400">{formatLeadDate(row.created_at)}</span>
        </div>
        {(row.title || row.details) && <p className="mt-1 text-sm text-slate-700">{row.title || row.details}</p>}
        {row.notes && <p className="text-xs text-slate-500">{row.notes}</p>}
        <FileLinks urls={row.file_urls} />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => verify(kind, id, "Approved")}
            disabled={busy}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" /> {busy ? "…" : "Verify"}
          </button>
          <button
            onClick={() => verify(kind, id, "Rejected")}
            disabled={busy}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" /> Reject
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-lg font-bold text-slate-900">Pending Verifications</h1>
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">{total}</span>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center text-sm text-slate-400">
          Nothing awaiting verification. Uploads from the sales team will appear here.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {groups.map((g) => (
            <div key={g.leadId} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-slate-900">{g.leadName}</p>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  {g.measurements.length + g.models.length} to verify
                </span>
              </div>

              {/* Site visits (read-only context) */}
              {g.visits.length > 0 && (
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Site Visit</p>
                  <ul className="space-y-1">
                    {g.visits.map((v) => (
                      <li key={getLeadId(v)} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {formatLeadDate(v.visit_date) || "—"} · {v.location || "—"}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${siteVisitChip[v.status] || "bg-slate-200 text-slate-600"}`}>{v.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {g.measurements.length > 0 && (
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Measurement</p>
                  <div className="space-y-2">
                    {g.measurements.map((m) => <VerifyRow key={getLeadId(m)} kind="measurement" row={m} icon={Ruler} label="Measurement" />)}
                  </div>
                </div>
              )}

              {g.models.length > 0 && (
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Model</p>
                  <div className="space-y-2">
                    {g.models.map((m) => <VerifyRow key={getLeadId(m)} kind="model" row={m} icon={Box} label="Model" />)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
