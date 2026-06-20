import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Search, Phone, MapPin, Upload, CheckCircle2 } from "lucide-react";
import useMyLeads from "../../../utils/useMyLeads";
import { getLeadId, formatLeadTime, isConverted } from "../../../utils/leadHelpers";
import LeadUploadsModal from "../../pipeline/LeadUploadsModal";
import LeadTaskProgress from "../../pipeline/LeadTaskProgress";

const statusStyle = {
  Converted: "bg-violet-100 text-violet-700",
  Discussion: "bg-blue-50 text-blue-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
};
const projectChip = {
  Pending: "bg-slate-100 text-slate-600",
  "In Progress": "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
  "On Hold": "bg-red-100 text-red-700",
};

export default function SalesLeadsSection() {
  const myLeads = useMyLeads();
  const projects = useSelector((s) => s.projects.items);
  const [query, setQuery] = useState("");
  const [uploadsLead, setUploadsLead] = useState(null);

  const projectByLead = useMemo(() => {
    const m = {};
    (projects || []).forEach((p) => { if (p.lead_id) m[p.lead_id] = p; });
    return m;
  }, [projects]);

  const leads = myLeads.filter((l) => {
    const q = query.trim().toLowerCase();
    return `${l.name || ""} ${l.phone || ""} ${l.location || ""}`.toLowerCase().includes(q);
  });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-slate-800">Assigned Leads</h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, phone or location"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {leads.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">No leads assigned to you yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {leads.map((lead) => {
            const project = projectByLead[getLeadId(lead)];
            const completed = project?.status === "Completed";
            return (
              <div key={getLeadId(lead)} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      {lead.name?.[0]?.toUpperCase() || "?"}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">{lead.name}</p>
                      <p className="text-xs text-slate-400">{lead.phone}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusStyle[lead.effectiveStatus] || "bg-slate-100 text-slate-600"}`}>
                    {lead.effectiveStatus}
                  </span>
                </div>

                {lead.location && (
                  <p className="flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {lead.location}</p>
                )}

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>Assigned {formatLeadTime(lead.created_at)}</span>
                  {project && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${projectChip[project.status] || "bg-slate-100 text-slate-600"}`}>
                      Project: {project.status}
                    </span>
                  )}
                </div>

                {isConverted(lead) && <LeadTaskProgress leadId={getLeadId(lead)} />}

                {completed ? (
                  <span className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                  </span>
                ) : isConverted(lead) ? (
                  <button
                    onClick={() => setUploadsLead(lead)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                  >
                    <Upload className="h-3.5 w-3.5" /> Site Visit &amp; Uploads
                  </button>
                ) : (
                  <span className="text-center text-[11px] text-slate-400">Available once the lead is Converted.</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {uploadsLead && (
        <LeadUploadsModal
          leadId={getLeadId(uploadsLead)}
          leadName={uploadsLead.name}
          location={uploadsLead.location}
          onClose={() => setUploadsLead(null)}
        />
      )}
    </section>
  );
}
