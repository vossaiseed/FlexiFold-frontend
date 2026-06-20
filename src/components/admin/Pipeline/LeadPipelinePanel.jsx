import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Upload, MapPin, Phone, FileText, CheckCircle2 } from "lucide-react";
import { updateLead } from "../../../redux/features/leads/leadsSlice";
import { fetchSalesTeam, selectSalesTeam } from "../../../redux/features/salesTeam/salesTeamSlice";
import { fetchSiteVisits, createSiteVisit } from "../../../redux/features/siteVisits/siteVisitsSlice";
import { fetchMeasurements, createMeasurement } from "../../../redux/features/measurements/measurementsSlice";
import { fetchModels, createModel } from "../../../redux/features/models/modelsSlice";
import { fetchProjects, createProject, updateProject } from "../../../redux/features/projects/projectsSlice";
import { fetchProjectManagers, selectProjectManagers } from "../../../redux/features/projectManagers/projectManagersSlice";
import { fetchTelecallers, selectTelecallers } from "../../../redux/features/telecallers/telecallersSlice";
import { getLeadId, formatLeadDate, isConverted } from "../../../utils/leadHelpers";
import { uploadFiles, computeStages, PROJECT_STATUSES, SITE_VISIT_STATUSES } from "../../../utils/pipeline";
import StatusTimeline from "./StatusTimeline";

const inputClass = "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100";
const labelClass = "text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400";
const sectionClass = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm";

export default function LeadPipelinePanel({ leadId, onClose }) {
  const dispatch = useDispatch();
  const leads = useSelector((s) => s.leads.leads);
  const salesTeam = useSelector(selectSalesTeam);
  const projectManagers = useSelector(selectProjectManagers);
  const telecallers = useSelector(selectTelecallers);
  const allVisits = useSelector((s) => s.siteVisits.items);
  const allMeasurements = useSelector((s) => s.measurements.items);
  const allModels = useSelector((s) => s.models.items);
  const allProjects = useSelector((s) => s.projects.items);

  const lead = useMemo(() => (leads || []).find((l) => getLeadId(l) === leadId), [leads, leadId]);

  const siteVisits = useMemo(() => (allVisits || []).filter((v) => v.lead_id === leadId), [allVisits, leadId]);
  const measurements = useMemo(() => (allMeasurements || []).filter((m) => m.lead_id === leadId), [allMeasurements, leadId]);
  const models = useMemo(() => (allModels || []).filter((m) => m.lead_id === leadId), [allModels, leadId]);
  const project = useMemo(() => (allProjects || []).find((p) => p.lead_id === leadId), [allProjects, leadId]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [salesId, setSalesId] = useState("");
  const [changingSales, setChangingSales] = useState(false);
  const [visit, setVisit] = useState({ visit_date: "", location: "", notes: "", status: "Scheduled" });
  const [measure, setMeasure] = useState({ details: "" });
  const [measureFiles, setMeasureFiles] = useState([]);
  const [model, setModel] = useState({ title: "", notes: "" });
  const [modelFiles, setModelFiles] = useState([]);
  const [pmId, setPmId] = useState("");
  const [telecallerId, setTelecallerId] = useState("");
  const [changingTelecaller, setChangingTelecaller] = useState(false);

  useEffect(() => {
    if (!salesTeam?.length) dispatch(fetchSalesTeam());
    if (!projectManagers?.length) dispatch(fetchProjectManagers());
    if (!telecallers?.length) dispatch(fetchTelecallers());
    dispatch(fetchSiteVisits());
    dispatch(fetchMeasurements());
    dispatch(fetchModels());
    dispatch(fetchProjects());
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const stages = useMemo(
    () => computeStages(lead, { siteVisits, measurements, models, project }),
    [lead, siteVisits, measurements, models, project]
  );

  const run = async (fn) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      return true;
    } catch (e) {
      setError(typeof e === "string" ? e : e?.message || "Action failed. Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const assignSales = () =>
    run(async () => {
      const staff = salesTeam.find((s) => String(getLeadId(s)) === String(salesId));
      if (!staff) return;
      await dispatch(
        updateLead({
          leadId,
          changes: { assigned_sales_id: String(getLeadId(staff)), assigned_sales_name: staff.name },
        })
      ).unwrap();
    });

  const assignTelecaller = () =>
    run(async () => {
      const tc = (telecallers || []).find((t) => String(getLeadId(t)) === String(telecallerId));
      if (!tc) return;
      await dispatch(
        updateLead({
          leadId,
          changes: { assigned_telecaller_id: String(getLeadId(tc)), assigned_telecaller_name: tc.name },
        })
      ).unwrap();
      setChangingTelecaller(false);
      setTelecallerId("");
    });

  const addVisit = () =>
    run(async () => {
      await dispatch(
        createSiteVisit({
          lead_id: leadId,
          visit_date: visit.visit_date || null,
          location: visit.location || lead?.location || null,
          notes: visit.notes || null,
          status: visit.status,
        })
      ).unwrap();
      setVisit({ visit_date: "", location: "", notes: "", status: "Scheduled" });
    });

  const addMeasurement = () =>
    run(async () => {
      const urls = measureFiles.length ? await uploadFiles(measureFiles) : [];
      await dispatch(
        createMeasurement({ lead_id: leadId, details: measure.details || null, file_urls: urls, status: "Uploaded" })
      ).unwrap();
      setMeasure({ details: "" });
      setMeasureFiles([]);
    });

  const addModel = () =>
    run(async () => {
      const urls = modelFiles.length ? await uploadFiles(modelFiles) : [];
      await dispatch(
        createModel({ lead_id: leadId, title: model.title || null, notes: model.notes || null, file_urls: urls, status: "Uploaded" })
      ).unwrap();
      setModel({ title: "", notes: "" });
      setModelFiles([]);
    });

  const assignPM = () =>
    run(async () => {
      if (!pmId) return;
      // Omit status so a brand-new project uses the DB default ("Pending") and
      // re-assigning a PM to an existing project keeps its current status.
      await dispatch(createProject({ lead_id: leadId, project_manager_id: pmId })).unwrap();
    });

  const setProjectStatus = (status) =>
    run(async () => {
      if (!project) return;
      await dispatch(updateProject({ id: getLeadId(project), changes: { status } })).unwrap();
    });

  if (!lead) return null;

  // The assigned sales member (from the panel's assignment), with their record
  // for showing contact details. Note: assigned_name is the partner, not sales.
  const assignedStaff = (salesTeam || []).find((s) => String(getLeadId(s)) === String(lead.assigned_sales_id));
  const salesName = lead.assigned_sales_name || assignedStaff?.name || null;
  const salesDetails = [assignedStaff?.phone, assignedStaff?.city || assignedStaff?.state].filter(Boolean).join(" · ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-2 sm:p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">Lead pipeline</p>
            <h2 className="truncate text-lg font-semibold text-slate-900">{lead.name}</h2>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>
              {lead.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{lead.location}</span>}
              <span className="rounded-full bg-slate-200 px-2 py-0.5 font-medium text-slate-600">{lead.status}</span>
              {lead.conversion_amount !== null && lead.conversion_amount !== undefined && lead.conversion_amount !== "" && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">₹{lead.conversion_amount}</span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="border-b border-red-100 bg-red-50 px-5 py-2 text-sm text-red-700">{error}</div>
        )}

        {/* Body */}
        <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-5 lg:grid-cols-[260px_1fr]">
          {/* Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-600">Status timeline</p>
            <StatusTimeline stages={stages} />
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {/* Project Manager (pinned to top for quick assignment) */}
            <div className={sectionClass}>
              <p className="text-sm font-semibold text-slate-900">Project Manager</p>
              {project ? (
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-slate-500">
                    Manager: <span className="font-medium text-slate-700">{project.project_manager_name || "—"}</span> ·
                    Status: <span className="font-medium text-slate-700">{project.status}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PROJECT_STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setProjectStatus(s)}
                        disabled={busy || project.status === s}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                          project.status === s ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <select className={inputClass} value={pmId} onChange={(e) => setPmId(e.target.value)}>
                    <option value="">Select a project manager…</option>
                    {(projectManagers || []).map((p) => (
                      <option key={getLeadId(p)} value={getLeadId(p)}>{p.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={assignPM}
                    disabled={busy || !pmId}
                    className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                  >
                    Assign PM
                  </button>
                </div>
              )}
            </div>

            {/* Assign Telecaller */}
            <div className={sectionClass}>
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                Telecaller
                {lead.assigned_telecaller_name && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Assigned</span>
                )}
              </p>
              {lead.assigned_telecaller_name && !changingTelecaller ? (
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      {lead.assigned_telecaller_name[0]?.toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{lead.assigned_telecaller_name}</p>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">Telecaller</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setTelecallerId(""); setChangingTelecaller(true); }}
                    className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <>
                  {lead.assigned_telecaller_name && <p className="mt-0.5 text-xs text-slate-500">Currently assigned to {lead.assigned_telecaller_name}</p>}
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <select className={inputClass} value={telecallerId} onChange={(e) => setTelecallerId(e.target.value)}>
                      <option value="">Select a telecaller…</option>
                      {(telecallers || []).map((t) => (
                        <option key={getLeadId(t)} value={getLeadId(t)}>{t.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={assignTelecaller}
                      disabled={busy || !telecallerId}
                      className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                    >
                      Assign
                    </button>
                    {lead.assigned_telecaller_name && (
                      <button onClick={() => setChangingTelecaller(false)} className="shrink-0 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                        Cancel
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Assign Sales Team */}
            <div className={sectionClass}>
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                Sales Team
                {salesName && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Assigned</span>
                )}
              </p>
              {salesName && !changingSales ? (
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      {salesName[0]?.toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{salesName}</p>
                      <p className="truncate text-[11px] text-slate-400">{salesDetails || "Sales Team"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSalesId(""); setChangingSales(true); }}
                    className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <>
                  {salesName && <p className="mt-0.5 text-xs text-slate-500">Currently assigned to {salesName}</p>}
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <select className={inputClass} value={salesId} onChange={(e) => setSalesId(e.target.value)}>
                      <option value="">Select a sales member…</option>
                      {(salesTeam || []).map((s) => (
                        <option key={getLeadId(s)} value={getLeadId(s)}>{s.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={async () => { if (await assignSales()) setChangingSales(false); }}
                      disabled={busy || !salesId}
                      className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                    >
                      Assign
                    </button>
                    {salesName && (
                      <button
                        onClick={() => setChangingSales(false)}
                        className="shrink-0 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {project?.status === "Completed" ? (
              <div className={sectionClass}>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> Completed
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  This project has been completed by the Project Manager.
                </p>
              </div>
            ) : !isConverted(lead) ? (
              <div className={sectionClass}>
                <p className="text-sm font-semibold text-slate-900">Site Visit · Measurement · Model</p>
                <p className="mt-1 text-xs text-slate-500">
                  These steps unlock once this lead is marked{" "}
                  <span className="font-semibold text-emerald-700">Converted</span>.
                </p>
              </div>
            ) : (
              <>
            {/* Site Visit */}
            <div className={sectionClass}>
              <p className="text-sm font-semibold text-slate-900">Site Visit</p>
              {siteVisits.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {siteVisits.map((v) => (
                    <li key={getLeadId(v)} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                      <span>{formatLeadDate(v.visit_date) || "—"} · {v.location || "—"}</span>
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 font-medium">{v.status}</span>
                    </li>
                  ))}
                </ul>
              )}
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
                  <input className={inputClass} value={visit.location} onChange={(e) => setVisit({ ...visit, location: e.target.value })} placeholder={lead.location || "Site location"} />
                </label>
                <label className="sm:col-span-2">
                  <span className={labelClass}>Notes</span>
                  <textarea rows={2} className={inputClass} value={visit.notes} onChange={(e) => setVisit({ ...visit, notes: e.target.value })} />
                </label>
              </div>
              <button onClick={addVisit} disabled={busy} className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50">
                Add Site Visit
              </button>
            </div>

            {/* Measurement */}
            <div className={sectionClass}>
              <p className="text-sm font-semibold text-slate-900">Measurement</p>
              {measurements.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {measurements.map((m) => (
                    <li key={getLeadId(m)} className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                      <p>{m.details || "Measurement"}</p>
                      <FileLinks urls={m.file_urls} />
                    </li>
                  ))}
                </ul>
              )}
              <label className="mt-3 block">
                <span className={labelClass}>Details</span>
                <textarea rows={2} className={inputClass} value={measure.details} onChange={(e) => setMeasure({ details: e.target.value })} />
              </label>
              <FileInput files={measureFiles} setFiles={setMeasureFiles} />
              <button onClick={addMeasurement} disabled={busy} className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50">
                Upload Measurement
              </button>
            </div>

            {/* Model */}
            <div className={sectionClass}>
              <p className="text-sm font-semibold text-slate-900">Model / Design</p>
              {models.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {models.map((m) => (
                    <li key={getLeadId(m)} className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                      <p className="font-medium text-slate-700">{m.title || "Model"}</p>
                      {m.notes && <p>{m.notes}</p>}
                      <FileLinks urls={m.file_urls} />
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3 grid gap-2">
                <label>
                  <span className={labelClass}>Title</span>
                  <input className={inputClass} value={model.title} onChange={(e) => setModel({ ...model, title: e.target.value })} />
                </label>
                <label>
                  <span className={labelClass}>Notes</span>
                  <textarea rows={2} className={inputClass} value={model.notes} onChange={(e) => setModel({ ...model, notes: e.target.value })} />
                </label>
              </div>
              <FileInput files={modelFiles} setFiles={setModelFiles} />
              <button onClick={addModel} disabled={busy} className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50">
                Upload Model
              </button>
            </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FileInput({ files, setFiles }) {
  return (
    <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500 transition hover:border-emerald-300">
      <Upload className="h-4 w-4" />
      <span>{files.length ? `${files.length} file(s) selected` : "Choose files / images"}</span>
      <input type="file" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
    </label>
  );
}

function FileLinks({ urls }) {
  if (!urls?.length) return null;
  return (
    <div className="mt-1 flex flex-wrap gap-2">
      {urls.map((u, i) => (
        <a key={i} href={u} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-emerald-600 hover:underline">
          <FileText className="h-3 w-3" /> File {i + 1}
        </a>
      ))}
    </div>
  );
}
