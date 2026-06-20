import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, FileText } from "lucide-react";
import { createMeasurement } from "../../redux/features/measurements/measurementsSlice";
import { createModel } from "../../redux/features/models/modelsSlice";
import { getLeadId } from "../../utils/leadHelpers";
import { uploadFiles } from "../../utils/pipeline";

const inputClass = "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100";
const labelClass = "text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400";

const statusChip = {
  Uploaded: "bg-amber-100 text-amber-700",
  Pending: "bg-slate-100 text-slate-600",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

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
        <a key={i} href={u} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline">
          <FileText className="h-3 w-3" /> File {i + 1}
        </a>
      ))}
    </div>
  );
}

const Item = ({ row }) => (
  <li className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
    <div className="flex items-center justify-between gap-2">
      <span className="font-medium text-slate-700">{row.title || row.details || "Upload"}</span>
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusChip[row.status] || "bg-slate-100 text-slate-600"}`}>
        {row.status === "Approved" ? "Verified" : row.status}
      </span>
    </div>
    {row.notes && <p className="mt-0.5">{row.notes}</p>}
    <FileLinks urls={row.file_urls} />
  </li>
);

// Per-lead measurement + model upload. The parent is responsible for fetching
// measurements/models into the store; this component reads + creates them.
export default function MeasurementModelUploader({ leadId }) {
  const dispatch = useDispatch();
  const allMeasurements = useSelector((s) => s.measurements.items);
  const allModels = useSelector((s) => s.models.items);

  const measurements = useMemo(() => (allMeasurements || []).filter((m) => m.lead_id === leadId), [allMeasurements, leadId]);
  const models = useMemo(() => (allModels || []).filter((m) => m.lead_id === leadId), [allModels, leadId]);

  const [measure, setMeasure] = useState({ details: "" });
  const [measureFiles, setMeasureFiles] = useState([]);
  const [model, setModel] = useState({ title: "", notes: "" });
  const [modelFiles, setModelFiles] = useState([]);
  const [busy, setBusy] = useState(null); // "measurement" | "model" | null
  const [error, setError] = useState(null);

  const run = async (action, fn) => {
    setBusy(action);
    setError(null);
    try { await fn(); } catch (e) { setError(typeof e === "string" ? e : e?.message || "Upload failed."); }
    finally { setBusy(null); }
  };

  const addMeasurement = () => run("measurement", async () => {
    const urls = measureFiles.length ? await uploadFiles(measureFiles) : [];
    await dispatch(createMeasurement({ lead_id: leadId, details: measure.details || null, file_urls: urls, status: "Uploaded" })).unwrap();
    setMeasure({ details: "" });
    setMeasureFiles([]);
  });

  const addModel = () => run("model", async () => {
    const urls = modelFiles.length ? await uploadFiles(modelFiles) : [];
    await dispatch(createModel({ lead_id: leadId, title: model.title || null, notes: model.notes || null, file_urls: urls, status: "Uploaded" })).unwrap();
    setModel({ title: "", notes: "" });
    setModelFiles([]);
  });

  return (
    <div className="space-y-4">
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {/* Measurement */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Measurement</p>
        {measurements.length > 0 && (
          <ul className="mt-2 space-y-1.5">{measurements.map((m) => <Item key={getLeadId(m)} row={m} />)}</ul>
        )}
        <label className="mt-3 block">
          <span className={labelClass}>Details</span>
          <textarea rows={2} className={inputClass} value={measure.details} onChange={(e) => setMeasure({ details: e.target.value })} placeholder="Measurement notes / dimensions" />
        </label>
        <FileInput files={measureFiles} setFiles={setMeasureFiles} />
        <button onClick={addMeasurement} disabled={!!busy} className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50">
          {busy === "measurement" ? "Uploading…" : "Upload Measurement"}
        </button>
      </div>

      {/* Model */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Model / Design</p>
        {models.length > 0 && (
          <ul className="mt-2 space-y-1.5">{models.map((m) => <Item key={getLeadId(m)} row={m} />)}</ul>
        )}
        <div className="mt-3 grid gap-2">
          <label><span className={labelClass}>Title</span><input className={inputClass} value={model.title} onChange={(e) => setModel({ ...model, title: e.target.value })} /></label>
          <label><span className={labelClass}>Notes</span><textarea rows={2} className={inputClass} value={model.notes} onChange={(e) => setModel({ ...model, notes: e.target.value })} /></label>
        </div>
        <FileInput files={modelFiles} setFiles={setModelFiles} />
        <button onClick={addModel} disabled={!!busy} className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50">
          {busy === "model" ? "Uploading…" : "Upload Model"}
        </button>
      </div>
    </div>
  );
}
