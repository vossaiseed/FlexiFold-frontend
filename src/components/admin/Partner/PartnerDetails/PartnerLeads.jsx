import React, { useState } from "react";
import { Search, Plus, MapPin, Clock, Eye } from "lucide-react";
import AddLead from "./AddLead";

// Section 3 — Leads search, status filters and lead cards
const leadsData = [
  { id: 101, name: "Toji Joseph & Brothers", location: "Munnar, Kerala", requirement: "Looking for a 4 BHK villa interior package with modular kitchen.", status: "Converted", createdAt: "09 May 2026 · 10:07 am" },
  { id: 102, name: "Sidharth Roy", location: "Hosur, Tamil Nadu", requirement: "Office space renovation, needs a quote for 2400 sq ft.", status: "Discussion", createdAt: "07 May 2026 · 06:19 pm" },
  { id: 103, name: "Arun Public RV", location: "Srirangapatna, Karnataka", requirement: "Enquiry about foldable furniture for a compact apartment.", status: "New", createdAt: "25 Apr 2026 · 09:20 am" },
  { id: 104, name: "Hashir Ali", location: "Calicut, Kerala", requirement: "Wants a full home automation consultation.", status: "Not Interested", createdAt: "13 Apr 2026 · 05:45 am" },
  { id: 105, name: "Tony Joseph", location: "Alappuzha, Kerala", requirement: "Budget furniture for a rental flat, flexible timeline.", status: "New", createdAt: "13 Apr 2026 · 05:44 am" },
  { id: 106, name: "Saheer Galaxy", location: "Kakkadampoil, Kerala", requirement: "Premium living room makeover with custom shelving.", status: "Discussion", createdAt: "12 Apr 2026 · 04:14 pm" },
];

const statusConfig = {
  New: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-l-emerald-400" },
  Discussion: { bg: "bg-blue-50", text: "text-blue-700", border: "border-l-blue-400" },
  Converted: { bg: "bg-violet-50", text: "text-violet-700", border: "border-l-violet-400" },
  "Not Interested": { bg: "bg-rose-50", text: "text-rose-700", border: "border-l-rose-400" },
};

const filters = ["All", "New", "Discussion", "Converted", "Not Interested"];

export default function PartnerLeads() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [showAddLead, setShowAddLead] = useState(false);

  const filtered = leadsData.filter((lead) => {
    const matchesFilter = activeFilter === "All" || lead.status === activeFilter;
    const matchesQuery =
      lead.name.toLowerCase().includes(query.toLowerCase()) ||
      lead.location.toLowerCase().includes(query.toLowerCase()) ||
      lead.requirement.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header + Add Lead */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">Leads</h2>
        <button
          type="button"
          onClick={() => setShowAddLead(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-green-500 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-green-200 transition hover:bg-green-600"
        >
          <Plus className="h-4 w-4" /> Add Lead
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search leads by name, location or requirement"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Status filters */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              activeFilter === f
                ? "border-green-500 bg-green-500 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Leads list */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm font-medium text-slate-400">No leads found</div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((lead) => {
            const cfg = statusConfig[lead.status] || statusConfig.New;
            return (
              <article
                key={lead.id}
                className={`rounded-xl border border-slate-200 border-l-4 ${cfg.border} bg-white p-4 shadow-sm transition hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold capitalize text-slate-800">{lead.name}</h3>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
                    {lead.status}
                  </span>
                </div>

                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> {lead.location}
                </p>

                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">{lead.requirement}</p>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="h-3.5 w-3.5" /> {lead.createdAt}
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700 transition hover:bg-violet-100"
                  >
                    <Eye className="h-3.5 w-3.5" /> View Details
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {showAddLead && <AddLead onClose={() => setShowAddLead(false)} />}
    </section>
  );
}
