import React, { useState } from "react";
import { Search, Phone, MapPin } from "lucide-react";

const leadsData = [
  { id: 1, name: "Meera Nair", phone: "9846098765", location: "Trivandrum", status: "New" },
  { id: 2, name: "Anwar Sadath", phone: "9846088888", location: "Malappuram", status: "Discussion" },
  { id: 3, name: "Divya S", phone: "9846033445", location: "Alappuzha", status: "New" },
  { id: 4, name: "Imran Ali", phone: "9846055555", location: "Calicut", status: "Follow-up" },
  { id: 5, name: "Priya Thomas", phone: "9846099999", location: "Kottayam", status: "New" },
  { id: 6, name: "Rahul Menon", phone: "9846012345", location: "Kochi", status: "Discussion" },
];

const statusStyle = {
  New: "bg-emerald-50 text-emerald-700",
  Discussion: "bg-blue-50 text-blue-700",
  "Follow-up": "bg-amber-50 text-amber-700",
};
const filters = ["All", "New", "Discussion", "Follow-up"];
const initial = (name) => name?.trim()?.[0]?.toUpperCase() || "?";

export default function LeadsSection() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");

  const filtered = leadsData.filter((l) => {
    const mf = active === "All" || l.status === active;
    const q = query.toLowerCase();
    const mq = l.name.toLowerCase().includes(q) || l.phone.includes(q) || l.location.toLowerCase().includes(q);
    return mf && mq;
  });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-slate-800">My Leads</h2>

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
            onClick={() => setActive(f)}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              active === f ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((lead) => (
          <div key={lead.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {initial(lead.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">{lead.name}</p>
                  <p className="text-xs text-slate-400">{lead.phone}</p>
                </div>
              </div>
              <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusStyle[lead.status]}`}>{lead.status}</span>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-slate-400" /> {lead.location}
            </p>
            <a
              href={`tel:${lead.phone}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
            >
              <Phone className="h-3.5 w-3.5" /> Call
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
