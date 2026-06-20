import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Phone, MapPin, MessageCircle, StickyNote, CalendarClock, CheckCircle2, Clock, X, UserPlus } from "lucide-react";
import { createConversion, fetchConversions, selectConversions } from "../../../redux/features/conversions/conversionsSlice";
import { fetchSalesTeam, selectSalesTeam } from "../../../redux/features/salesTeam/salesTeamSlice";
import { updateLead } from "../../../redux/features/leads/leadsSlice";
import { formatLeadTime, formatLeadDate, getLeadId } from "../../../utils/leadHelpers";
import useMyLeads from "../../../utils/useMyLeads";

const statusStyle = {
  New: "bg-emerald-50 text-emerald-700",
  Discussion: "bg-blue-50 text-blue-700",
  "Follow-up": "bg-amber-50 text-amber-700",
  "Conversion Pending": "bg-violet-50 text-violet-700",
  Converted: "bg-violet-100 text-violet-700",
  "Not Interested": "bg-rose-50 text-rose-700",
  "No Response": "bg-slate-100 text-slate-600",
  Pending: "bg-slate-100 text-slate-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Failed: "bg-red-50 text-red-700",
  Rejected: "bg-red-50 text-red-700",
};

// Filter tabs + the stages a telecaller can set manually.
const FILTERS = ["All", "New", "Discussion", "Follow-up", "Conversion Pending", "Converted", "Not Interested", "No Response"];
const MANUAL_STATUSES = ["New", "Discussion", "Follow-up", "Not Interested", "No Response"];
// Statuses that lock the lead from manual status edits / re-conversion.
const LOCKED = ["Conversion Pending", "Converted", "Rejected", "Failed"];

const convChip = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const initial = (name) => name?.trim()?.[0]?.toUpperCase() || "?";

export default function LeadsSection() {
  const dispatch = useDispatch();
  const conversions = useSelector(selectConversions) || [];
  const salesTeam = useSelector(selectSalesTeam) || [];
  const { user } = useSelector((s) => s.auth);
  const myLeads = useMyLeads();

  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");
  const [action, setAction] = useState(null); // { type: 'convert'|'note'|'followup'|'assignSales', lead }
  const [amount, setAmount] = useState("");
  const [noteText, setNoteText] = useState("");
  const [followupDate, setFollowupDate] = useState("");
  const [salesId, setSalesId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    dispatch(fetchConversions());
    dispatch(fetchSalesTeam());
  }, [dispatch]);

  const conversionByLead = useMemo(() => {
    const m = {};
    conversions.forEach((c) => {
      if (!c.lead_id) return;
      const existing = m[c.lead_id];
      if (!existing || (existing.status === "Rejected" && c.status !== "Rejected")) m[c.lead_id] = c;
    });
    return m;
  }, [conversions]);

  const filtered = myLeads.filter((l) => {
    const mf = active === "All" || l.effectiveStatus === active;
    const q = query.toLowerCase();
    const haystack = `${l.name || ""} ${l.phone || ""} ${l.location || ""}`.toLowerCase();
    return mf && haystack.includes(q);
  });

  // ---- actions ----
  const flash = (msg) => { setNotice(msg); };

  const recordCall = async (lead) => {
    // Log the call (count + timestamp), then open the dialer.
    dispatch(updateLead({ leadId: lead.id, changes: {
      call_count: (lead.call_count || 0) + 1,
      last_call_at: new Date().toISOString(),
    }}));
    window.location.href = `tel:${lead.phone || ""}`;
  };

  const openWhatsApp = (lead) => {
    const num = String(lead.whatsapp || lead.phone || "").replace(/\D/g, "");
    if (num) window.open(`https://wa.me/${num}`, "_blank");
  };

  const changeStatus = (lead, status) => {
    if (status && status !== lead.status) dispatch(updateLead({ leadId: lead.id, changes: { status } }));
  };

  const openAction = (type, lead) => {
    setError("");
    setNotice("");
    setAmount("");
    setNoteText("");
    setFollowupDate("");
    setSalesId("");
    setAction({ type, lead });
  };

  const submit = async () => {
    if (!action) return;
    const { type, lead } = action;
    setSubmitting(true);
    setError("");
    try {
      if (type === "convert") {
        await dispatch(createConversion({
          lead_id: lead.id,
          customer_name: lead.name,
          sales_staff_id: user?.id || null,
          amount: amount ? Number(amount) : null,
          status: "Pending",
          notes: lead.notes || null,
        })).unwrap();
        // Mirror the amount onto the lead so it's the single latest source
        // (Sales may overwrite it later). Conversion is allowed without an amount.
        const convChanges = { status: "Conversion Pending" };
        if (amount) convChanges.conversion_amount = Number(amount);
        try { await dispatch(updateLead({ leadId: lead.id, changes: convChanges })).unwrap(); } catch { /* keep going */ }
        flash(`Conversion request submitted for "${lead.name}".`);
      } else if (type === "note") {
        if (!noteText.trim()) { setError("Enter a note."); setSubmitting(false); return; }
        const entry = `[${new Date().toISOString().slice(0, 10)}] ${noteText.trim()}`;
        const newNotes = lead.notes ? `${lead.notes}\n${entry}` : entry;
        await dispatch(updateLead({ leadId: lead.id, changes: { notes: newNotes } })).unwrap();
        flash("Note added.");
      } else if (type === "followup") {
        if (!followupDate) { setError("Pick a date."); setSubmitting(false); return; }
        await dispatch(updateLead({ leadId: lead.id, changes: { next_follow_up: followupDate, status: "Follow-up" } })).unwrap();
        flash("Follow-up scheduled.");
      } else if (type === "assignSales") {
        const staff = salesTeam.find((s) => String(getLeadId(s)) === String(salesId));
        if (!staff) { setError("Select a Sales Team member."); setSubmitting(false); return; }
        await dispatch(updateLead({ leadId: lead.id, changes: {
          assigned_sales_id: String(getLeadId(staff)),
          assigned_sales_name: staff.name,
        } })).unwrap();
        flash(`Assigned to ${staff.name}.`);
      }
      setAction(null);
    } catch (err) {
      setError(typeof err === "string" ? err : "Action failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle =
    action?.type === "convert" ? "Convert Lead"
    : action?.type === "note" ? "Add Note"
    : action?.type === "assignSales" ? "Assign to Sales Team"
    : "Schedule Follow-up";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-slate-800">My Leads</h2>

      {notice && (
        <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">{notice}</p>
      )}

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, phone or location"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const count = f === "All" ? myLeads.length : myLeads.filter((l) => l.effectiveStatus === f).length;
          return (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                active === f ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {f}
              <span className={`rounded-full px-1.5 text-[10px] font-bold ${active === f ? "bg-white/25" : "bg-slate-100 text-slate-500"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">No leads found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((lead) => {
            const conv = conversionByLead[lead.id];
            const activeRequest = conv && conv.status !== "Rejected";
            const locked = LOCKED.includes(lead.effectiveStatus) || activeRequest;
            const statusOptions = Array.from(new Set([lead.effectiveStatus, lead.status, ...MANUAL_STATUSES]));
            return (
              <div key={lead.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      {initial(lead.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">{lead.name}</p>
                      <p className="text-xs text-slate-400">{lead.phone}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusStyle[lead.effectiveStatus] || "bg-slate-100 text-slate-600"}`}>{lead.effectiveStatus}</span>
                </div>

                {lead.location && (
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> {lead.location}
                  </p>
                )}

                {/* Tracking info */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
                  <span>📞 Calls: <b className="text-slate-700">{lead.call_count || 0}</b></span>
                  <span>🕐 Last call: <b className="text-slate-700">{lead.last_call_at ? formatLeadTime(lead.last_call_at) : "—"}</b></span>
                  <span>📅 Next follow-up: <b className="text-slate-700">{lead.next_follow_up ? formatLeadDate(lead.next_follow_up) : "—"}</b></span>
                </div>

                {/* Status management */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Stage</span>
                  <select
                    value={lead.effectiveStatus}
                    disabled={locked}
                    onChange={(e) => changeStatus(lead, e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => recordCall(lead)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                    <Phone className="h-3.5 w-3.5 text-emerald-600" /> Call
                  </button>
                  <button onClick={() => openWhatsApp(lead)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                    <MessageCircle className="h-3.5 w-3.5 text-green-600" /> WhatsApp
                  </button>
                  <button onClick={() => openAction("note", lead)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                    <StickyNote className="h-3.5 w-3.5 text-amber-600" /> Add Note
                  </button>
                  <button onClick={() => openAction("followup", lead)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                    <CalendarClock className="h-3.5 w-3.5 text-blue-600" /> Follow-up
                  </button>
                </div>

                {/* Convert / conversion status */}
                {activeRequest ? (
                  <span className={`inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${convChip[conv.status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                    <Clock className="h-3 w-3" />
                    {conv.status === "Approved" ? "Conversion approved" : "Conversion pending approval"}
                  </span>
                ) : LOCKED.includes(lead.effectiveStatus) ? null : (
                  <button
                    onClick={() => openAction("convert", lead)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Convert
                  </button>
                )}

                {/* Once converted, the telecaller assigns the lead to a Sales member */}
                {lead.effectiveStatus === "Converted" && (
                  <div className="flex flex-wrap items-center gap-2">
                    {lead.assigned_sales_name && (
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> Sales: {lead.assigned_sales_name}
                      </span>
                    )}
                    <button
                      onClick={() => openAction("assignSales", lead)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                    >
                      <UserPlus className="h-3.5 w-3.5" /> {lead.assigned_sales_name ? "Reassign Sales" : "Assign to Sales"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Unified action modal */}
      {action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="absolute inset-0" onClick={() => !submitting && setAction(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <button type="button" onClick={() => !submitting && setAction(null)} className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-bold text-slate-900">{modalTitle}</h3>
            <p className="mt-1 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{action.lead.name}</span>
            </p>

            {action.type === "convert" && (
              <>
                <label className="mt-4 block text-xs font-semibold text-slate-500">Conversion Amount (₹) — optional</label>
                <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 50000"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100" />
              </>
            )}
            {action.type === "note" && (
              <>
                <label className="mt-4 block text-xs font-semibold text-slate-500">Note</label>
                <textarea rows={4} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="What happened on the call?"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100" />
              </>
            )}
            {action.type === "followup" && (
              <>
                <label className="mt-4 block text-xs font-semibold text-slate-500">Follow-up date</label>
                <input type="date" value={followupDate} onChange={(e) => setFollowupDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100" />
              </>
            )}
            {action.type === "assignSales" && (
              <>
                <label className="mt-4 block text-xs font-semibold text-slate-500">Sales Team member</label>
                <select value={salesId} onChange={(e) => setSalesId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100">
                  <option value="">Select a sales member…</option>
                  {salesTeam.map((s) => (
                    <option key={getLeadId(s)} value={getLeadId(s)}>{s.name}</option>
                  ))}
                </select>
                {salesTeam.length === 0 && <p className="mt-2 text-[11px] text-slate-400">No sales members yet — ask an admin to add one.</p>}
              </>
            )}

            {error && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setAction(null)} disabled={submitting}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60">
                Cancel
              </button>
              <button type="button" onClick={submit} disabled={submitting}
                className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? "Saving…" : action.type === "convert" ? "Submit for Approval" : action.type === "note" ? "Save Note" : action.type === "assignSales" ? "Assign" : "Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
