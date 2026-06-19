import React, { useState } from "react";
import { Search, Plus, MapPin, Clock } from "lucide-react";
import AddLead from "../../admin/Partner/PartnerDetails/AddLead";
import { useSelector } from "react-redux";

const leadsData = [
  { id: 101, name: "Toji Joseph", location: "Munnar, Kerala", requirement: "4 BHK villa interior with modular kitchen.", status: "Converted", createdAt: "09 May 2026 · 10:07 am" },
  { id: 102, name: "Sidharth Roy", location: "Hosur, Tamil Nadu", requirement: "Office renovation, ~2400 sq ft.", status: "Discussion", createdAt: "07 May 2026 · 06:19 pm" },
  { id: 103, name: "Arun Public RV", location: "Srirangapatna, Karnataka", requirement: "Foldable furniture for a compact flat.", status: "New", createdAt: "25 Apr 2026 · 09:20 am" },
  { id: 104, name: "Hashir Ali", location: "Calicut, Kerala", requirement: "Full home automation consultation.", status: "Not Interested", createdAt: "13 Apr 2026 · 05:45 am" },
];

const statusConfig = {
  New: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-l-emerald-400" },
  Discussion: { bg: "bg-blue-50", text: "text-blue-700", border: "border-l-blue-400" },
  Converted: { bg: "bg-violet-50", text: "text-violet-700", border: "border-l-violet-400" },
  "Not Interested": { bg: "bg-rose-50", text: "text-rose-700", border: "border-l-rose-400" },
};

const filters = ["All", "New", "Discussion", "Converted", "Not Interested"];

// Format the DB timestamp (created_at) for display; leave plain strings as-is.
const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function LeadsSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [showAddLead, setShowAddLead] = useState(false);
  const {leads,isLoading}=useSelector(store=>store.leads)

  const filtered = leads.filter((l) => {
    const matchFilter = activeFilter === "All" || l.status === activeFilter;
    const q = query.toLowerCase();
    // DB leads can have null location/requirement, so guard before lowercasing.
    const haystack = `${l.name || ""} ${l.location || ""} ${l.requirement || ""}`.toLowerCase();
    const matchQuery = haystack.includes(q);
    return matchFilter && matchQuery;
  });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-slate-800">My Leads</h2>
        <button
          onClick={() => setShowAddLead(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4" /> Add Lead
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search leads"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              activeFilter === f ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">No leads found</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((lead) => {
            const cfg = statusConfig[lead.status] || statusConfig.New;
            return (
              <article key={lead.id} className={`rounded-xl border border-slate-200 border-l-4 ${cfg.border} bg-white p-4 shadow-sm`}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-800">{lead.name}</h3>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>{lead.status}</span>
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> {lead.location}
                </p>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">{lead.requirement}</p>
                <p className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                  <Clock className="h-3.5 w-3.5" /> {formatDate(lead.created_at || lead.createdAt)}
                </p>
              </article>
            );
          })}
        </div>
      )}

      {showAddLead && <AddLead onClose={() => setShowAddLead(false)} />}
    </section>
  );
}
