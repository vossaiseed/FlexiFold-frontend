import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertTriangle, User, Clock, Phone } from "lucide-react";
import LeadModal from "../../components/admin/AssignedLeads/LeadModal";
import { updateLead } from "../../redux/features/leads/leadsSlice";

const CLOSED = ["Converted", "Failed", "Rejected"];
const initial = (name) => name?.trim()?.[0]?.toUpperCase() || "?";
const hoursAgo = (value) => {
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return `${Math.round((Date.now() - d.getTime()) / 3600000)}h ago`;
};
const isInactive48 = (l) => {
  if (CLOSED.includes(l?.status)) return false;
  const d = new Date(l?.created_at);
  return !isNaN(d.getTime()) && Date.now() - d.getTime() > 48 * 3600 * 1000;
};

export default function LMAlerts() {
  const dispatch = useDispatch();
  const leads = useSelector((s) => s.leads.leads) || [];
  const [detailsLead, setDetailsLead] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const inactiveLeads = leads.filter(isInactive48);

  const reassign = async (id) => {
    setBusyId(id);
    try { await dispatch(updateLead({ leadId: id, changes: { assigned_to: null } })).unwrap(); }
    catch { /* surfaced via slice */ }
    finally { setBusyId(null); }
  };

  return (
    <div className="min-w-0 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-base font-bold text-slate-900">Inactive Alerts</h1>
            <p className="text-xs text-slate-400">Leads with no activity for 48+ hours</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-600">
          {inactiveLeads.length} alerts
        </span>
      </div>

      {inactiveLeads.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-400">No inactive leads — all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inactiveLeads.map((lead) => (
            <div
              key={lead.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-100 border-l-4 border-l-rose-400 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-sm font-bold text-rose-600">
                  {initial(lead.name)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800">{lead.name}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                      <Phone className="h-3 w-3" /> {lead.phone}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600">
                      <User className="h-3 w-3" /> {lead.assigned_name || "Unassigned"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-500">
                      <Clock className="h-3 w-3" /> {hoursAgo(lead.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pl-14 sm:pl-0">
                <button
                  onClick={() => setDetailsLead(lead)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  View
                </button>
                <button
                  onClick={() => reassign(lead.id)}
                  disabled={busyId === lead.id}
                  className="rounded-lg bg-rose-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
                >
                  Reassign
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {detailsLead && (
        <LeadModal
          lead={{
            ...detailsLead,
            assignee: detailsLead.assigned_name || "Unassigned",
            time: hoursAgo(detailsLead.created_at),
            team: detailsLead.assigned_name || "",
          }}
          onClose={() => setDetailsLead(null)}
        />
      )}
    </div>
  );
}
