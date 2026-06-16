import React, { useState } from "react";
import { Search, MapPin, Clock, Phone, UserPlus, Inbox } from "lucide-react";

const poolLeads = [
  { id: 1, name: "Rahul Menon", phone: "9846012345", location: "Kochi", requirement: "Looking for a 3 BHK modular kitchen and wardrobe package.", posted: "2h ago" },
  { id: 2, name: "Sneha Pillai", phone: "9846098765", location: "Trivandrum", requirement: "Office interior renovation, ~1800 sq ft.", posted: "5h ago" },
  { id: 3, name: "Imran Ali", phone: "9846055555", location: "Calicut", requirement: "Foldable furniture for a compact studio apartment.", posted: "8h ago" },
  { id: 4, name: "Devika Raj", phone: "9846077777", location: "Thrissur", requirement: "Full villa interior consultation needed.", posted: "1d ago" },
  { id: 5, name: "Anwar Sadath", phone: "9846088888", location: "Malappuram", requirement: "Premium living room makeover with custom shelving.", posted: "1d ago" },
  { id: 6, name: "Priya Thomas", phone: "9846099999", location: "Kottayam", requirement: "Budget furniture for a rental flat, flexible timeline.", posted: "2d ago" },
];

const initial = (name) => name?.trim()?.[0]?.toUpperCase() || "?";

export default function LeadPool() {
  const [query, setQuery] = useState("");
  const [leads, setLeads] = useState(poolLeads);

  const claim = (id) => setLeads((prev) => prev.filter((l) => l.id !== id));

  const filtered = leads.filter((l) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      l.name.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q) ||
      l.requirement.toLowerCase().includes(q) ||
      l.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="font-sans mt-3">
      {/* Header row */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          <span className="font-bold text-slate-900">{leads.length}</span> leads available to claim
        </p>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the lead pool"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
          <Inbox className="h-8 w-8 text-slate-300" />
          <p className="font-semibold text-slate-500">No leads in the pool</p>
          <p className="text-sm text-slate-400">New unassigned leads will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((lead) => (
            <div key={lead.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              {/* Header */}
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {initial(lead.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">{lead.name}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <Phone className="h-3 w-3" /> {lead.phone}
                  </p>
                </div>
              </div>

              {/* Meta */}
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-slate-400" /> {lead.location}
              </p>
              <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">{lead.requirement}</p>

              {/* Footer */}
              <div className="mt-1 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="h-3.5 w-3.5" /> {lead.posted}
                </span>
                <button
                  onClick={() => claim(lead.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600"
                >
                  <UserPlus className="h-3.5 w-3.5" /> Claim
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
