import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLead } from "../../../redux/features/leads/leadsSlice";
import { fetchSalesTeam, selectSalesTeam } from "../../../redux/features/salesTeam/salesTeamSlice";
import { createConversion } from "../../../redux/features/conversions/conversionsSlice";

const statusBadge = {
  New: "bg-blue-100 text-blue-700",
  Pending: "bg-slate-100 text-slate-700",
  Discussion: "bg-amber-100 text-amber-700",
  "Follow-up": "bg-amber-100 text-amber-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Converted: "bg-emerald-100 text-emerald-700",
  Failed: "bg-red-100 text-red-700",
  Rejected: "bg-red-100 text-red-700",
};

// Reports are stored as appended lines in the lead's notes field:
//   [YYYY-MM-DD] Status — text
const parseReports = (notes) =>
  (notes || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export default function LeadModal({ lead, onClose }) {
  const dispatch = useDispatch();
  // Prefer the live row from the store (has notes, assigned_to, status…).
  const liveLead = useSelector((s) => s.leads.leads.find((l) => l.id === lead?.id));
  const salesTeam = useSelector(selectSalesTeam) || [];
  const data = liveLead || lead;

  const [reportText, setReportText] = useState("");
  const [reportStatus, setReportStatus] = useState("In Progress");
  const [reportDate, setReportDate] = useState("");
  const [showChange, setShowChange] = useState(false);
  const [convertAmount, setConvertAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const reports = useMemo(() => parseReports(data?.notes), [data?.notes]);

  // Ensure the sales team is available for the "Change" assignment dropdown,
  // even in areas that don't otherwise load it (e.g. admin leads).
  useEffect(() => {
    if (salesTeam.length === 0) dispatch(fetchSalesTeam());
  }, [dispatch, salesTeam.length]);

  if (!lead) return null;

  const name = data.name || "—";
  const status = data.status || "New";
  const assignee = data.assigned_name || lead.assignee || "Unassigned";
  const partnerName = data.partner_name || lead.assignee || "—";
  const phone = data.phone || lead.phone;
  const location = data.location || lead.location || "—";
  const time = lead.time || (data.created_at ? new Date(data.created_at).toLocaleString("en-IN") : "");

  const run = async (changes) => {
    setBusy(true);
    setError("");
    try {
      await dispatch(updateLead({ leadId: lead.id, changes })).unwrap();
      return true;
    } catch (err) {
      setError(typeof err === "string" ? err : "Action failed. Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  // "Convert Lead" raises a Pending conversion request for admin review and
  // moves the lead into "In Progress" (it only becomes "Converted" once the
  // admin approves the request).
  const convert = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await dispatch(createConversion({
        lead_id: lead.id,
        customer_name: name,
        sales_staff_id: data.assigned_to || null,
        amount: convertAmount ? Number(convertAmount) : null,
        status: "Pending",
        notes: data.notes || null,
      })).unwrap();
      // Move the lead into the conversion pipeline (best-effort).
      try { await dispatch(updateLead({ leadId: lead.id, changes: { status: "In Progress" } })).unwrap(); } catch { /* keep going */ }
      setNotice("Conversion request submitted for admin approval.");
      setConvertAmount("");
    } catch (err) {
      setError(typeof err === "string" ? err : "Could not submit conversion request.");
    } finally {
      setBusy(false);
    }
  };

  const reject = async () => { if (await run({ status: "Rejected" })) onClose(); };

  const reassign = async (staff) => {
    setShowChange(false);
    await run({ assigned_to: staff.id });
  };

  const addReport = async () => {
    if (!reportText.trim() && !reportStatus) return;
    const date = reportDate || new Date().toISOString().slice(0, 10);
    const entry = `[${date}] ${reportStatus}${reportText.trim() ? " — " + reportText.trim() : ""}`;
    const newNotes = data.notes ? `${data.notes}\n${entry}` : entry;
    const ok = await run({ status: reportStatus, notes: newNotes });
    if (ok) { setReportText(""); setReportDate(""); }
  };

  const downloadPdf = () => {
    const rows = reports.length ? reports.map((r) => `<li>${r}</li>`).join("") : "<li>No reports yet.</li>";
    const html = `<!doctype html><html><head><title>Lead Report — ${name}</title>
      <style>body{font-family:system-ui,Arial,sans-serif;padding:24px;color:#0f172a}
      h1{font-size:20px;margin:0 0 4px}.muted{color:#64748b;font-size:13px}
      .box{border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-top:16px}
      ul{margin:8px 0 0;padding-left:18px}li{margin:4px 0;font-size:14px}</style></head>
      <body>
        <h1>${name}</h1>
        <p class="muted">Status: ${status} · Phone: ${phone || "—"} · Location: ${location}</p>
        <p class="muted">Sales: ${assignee} · Partner: ${partnerName}</p>
        <div class="box"><strong>Lead Reports</strong><ul>${rows}</ul></div>
        <script>window.onload=function(){window.print()}</script>
      </body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-2 py-2 sm:px-4 sm:py-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[calc(100vh-2.5rem)] overflow-y-auto rounded-[20px] bg-white shadow-2xl border border-slate-200"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-3 rounded-full bg-white p-3 text-slate-500 shadow-sm transition hover:bg-slate-100"
        >
          ✕
        </button>
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 pt-5 pb-3 px-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-100 text-base font-semibold text-emerald-700">
              {name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">Lead</p>
              <h2 className="mt-1 text-base sm:text-lg font-semibold text-slate-900 break-words">{name}</h2>
              <p className="mt-1 text-sm text-slate-500">Assigned to {assignee}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="rounded-[20px] border border-slate-200 bg-white p-2 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <span className="text-lg">📞</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="mt-1 font-semibold text-slate-900">{phone}</p>
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[status] || "bg-slate-100 text-slate-700"}`}>
                {status}
              </span>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-2">
                <p className="text-xs text-slate-400">Location</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{location}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2">
                <p className="text-xs text-slate-400">Time</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{time}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase text-slate-400">Sales Assignment</p>
                  <p className="mt-2 font-semibold text-slate-900 break-words">{assignee}</p>
                </div>
                <button
                  onClick={() => setShowChange((o) => !o)}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 w-full sm:w-auto"
                >
                  Change
                </button>
              </div>
              {showChange && (
                <select
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  defaultValue=""
                  onChange={(e) => {
                    const staff = salesTeam.find((s) => s.id === e.target.value);
                    if (staff) reassign(staff);
                  }}
                >
                  <option value="" disabled>{salesTeam.length ? "Select sales staff…" : "No sales staff"}</option>
                  {salesTeam.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="text-xs uppercase text-slate-400">Partner</p>
              <p className="mt-2 font-semibold text-slate-900 break-words">{partnerName}</p>
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          {notice && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <label className="text-xs uppercase text-slate-400">Conversion Amount (₹) — optional</label>
            <input
              type="number"
              min="0"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value)}
              placeholder="e.g. 50000"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                onClick={convert}
                disabled={busy}
                className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 w-full disabled:opacity-60"
              >
                Convert Lead
              </button>
              <button
                onClick={reject}
                disabled={busy}
                className="rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 w-full disabled:opacity-60"
              >
                Reject Lead
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Add Report</p>
            <textarea
              rows={4}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              placeholder="What happened? (e.g. called, interested, follow-up needed...)"
            />
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <select
                value={reportStatus}
                onChange={(e) => setReportStatus(e.target.value)}
                className="rounded-3xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                <option>In Progress</option>
                <option>Discussion</option>
                <option>Follow-up</option>
                <option>Converted</option>
                <option>Failed</option>
              </select>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="rounded-3xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <button
              onClick={addReport}
              disabled={busy}
              className="mt-3 w-full rounded-3xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition disabled:opacity-60"
            >
              {busy ? "Saving…" : "Add Report"}
            </button>
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Activity Timeline</p>
            {reports.length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">No reports yet.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {[...reports].reverse().map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span className="break-words">{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={downloadPdf}
          className="block w-full border-t border-slate-200 bg-slate-950 px-3 py-3 text-center text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
        >
          Download all lead reports as PDF
        </button>
      </div>
    </div>
  );
}
