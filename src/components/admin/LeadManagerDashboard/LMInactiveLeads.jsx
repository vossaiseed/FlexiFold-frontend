import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateLead } from "../../../redux/features/leads/leadsSlice";

const CLOSED = ["Converted", "Failed", "Rejected"];

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

export default function LMInactiveLeads() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const leads = useSelector((s) => s.leads.leads) || [];
  const [busyId, setBusyId] = useState(null);

  const inactive = leads.filter(isInactive48);

  // Reassign = send the lead back to the pool by clearing its assignee.
  const reassign = async (id) => {
    setBusyId(id);
    try { await dispatch(updateLead({ leadId: id, changes: { assigned_to: null } })).unwrap(); }
    catch { /* surfaced via slice */ }
    finally { setBusyId(null); }
  };

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-base">⚠️</span>
        <span className="text-[13px] font-bold text-slate-800">
          {inactive.length} leads inactive for 48h+
        </span>
      </div>

      {inactive.length === 0 ? (
        <p className="text-[13px] text-slate-400">No inactive leads — all caught up!</p>
      ) : (
        <div className="flex flex-col gap-2">
          {inactive.map((lead) => (
            <div
              key={lead.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-gray-50 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-[13px] font-semibold text-slate-800">{lead.name}</p>
                <p className="mt-0.5 text-[11px] text-red-500">
                  {lead.assigned_name || "Unassigned"} · {hoursAgo(lead.created_at)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/lead-manager/leads")}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  View
                </button>
                <button
                  onClick={() => reassign(lead.id)}
                  disabled={busyId === lead.id}
                  className="rounded-lg bg-red-500 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                >
                  Reassign
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
