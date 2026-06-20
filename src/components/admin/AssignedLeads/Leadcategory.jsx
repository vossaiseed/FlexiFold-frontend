import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { leadsData as defaultLeadsData } from "./LeadsCard";
import LeadCard from "./LeadsCard";
import LeadModal from "./LeadModal";

// Canonical display order for the status tabs; only statuses actually present
// in the data get a tab, so this component stays correct whatever it's fed.
const STATUS_ORDER = ["New", "Pending", "Discussion", "Follow-up", "In Progress", "Converted", "Failed", "Rejected"];

export default function Leadcategory({ leadsData = defaultLeadsData, onDelete, onSelect }) {
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");
  const [leads, setLeads] = useState(Array.isArray(leadsData) ? leadsData : []);
  const [selectedLead, setSelectedLead] = useState(null);

  // Keep local state in sync when the source data changes (e.g. leads loaded
  // from Redux after the initial render, or a lead is approved/rejected).
  useEffect(() => {
    setLeads(Array.isArray(leadsData) ? leadsData : []);
  }, [leadsData]);

  // When a parent owns the data (Redux), delegate deletes to it so they persist;
  // otherwise fall back to a local-only removal (e.g. static mock lists).
  const handleDelete = (id) => {
    if (onDelete) onDelete(id);
    else setLeads(prev => prev.filter(Boolean).filter(l => l.id !== id));
  };
  const closeModal = () => setSelectedLead(null);

  const present = leads.filter(Boolean);
  const counts = present.reduce(
    (acc, l) => {
      if (l?.status) acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    },
    { All: present.length }
  );

  const tabList = ["All", ...STATUS_ORDER.filter((status) => counts[status])];

  const filtered = leads
    .filter(Boolean)
    .filter(l => activeTab === "All" || l?.status === activeTab)
    .filter(l => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        l?.name?.toLowerCase().includes(q) ||
        l?.location?.toLowerCase().includes(q) ||
        l?.phone?.toLowerCase().includes(q) ||
        l?.assignee?.toLowerCase().includes(q)
      );
    });

  return (
    <div className="font-sans">

      {/* Header */}
      {/* <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Leads</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Assigned Leads</h1>
      </div> */}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, location, phone or partner"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {tabList.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${activeTab === tab
                ? "bg-green-500 text-white border-green-500 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
          >
            {tab}
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"
              }`}>
              {counts[tab] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <p className="font-semibold text-slate-500">No leads found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-3">
          {filtered.map(lead => (
            lead ? <LeadCard key={lead.id} lead={lead} onDelete={handleDelete} onClick={() => (onSelect ? onSelect(lead) : setSelectedLead(lead))} /> : null
          ))}
        </div>
      )}
      {!onSelect && selectedLead ? <LeadModal lead={selectedLead} onClose={closeModal} /> : null}
    </div>
  );
}