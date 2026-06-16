import React from "react";
import { Users, CheckCircle2, Activity, IndianRupee } from "lucide-react";
import { useSelector } from "react-redux";

const statCards = [
  { key: "total", label: "Total Leads", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { key: "converted", label: "Converted Leads", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "active", label: "Active Leads", icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
  { key: "royalty", label: "Royalty Earned", icon: IndianRupee, color: "text-violet-600", bg: "bg-violet-50" },
];

// statuses that count as "not active anymore"
const CLOSED_STATUSES = ["Converted", "Failed", "Not Interested"];

// dot colour per lead status
const statusDot = {
  New: "bg-emerald-500",
  Discussion: "bg-blue-500",
  "Follow-up": "bg-amber-500",
  Converted: "bg-violet-500",
  "Not Interested": "bg-rose-500",
  Failed: "bg-rose-500",
};

// format the DB timestamp (created_at) for display
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

export default function DashboardSection() {
  const { leads } = useSelector((store) => store.leads);

  // derive the stat values from the real leads
  const counts = {
    total: leads.length,
    converted: leads.filter((l) => l.status === "Converted").length,
    active: leads.filter((l) => !CLOSED_STATUSES.includes(l.status)).length,
    royalty: "₹0",
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, color, bg }) => (
          <div key={key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${bg} ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{counts[key]}</p>
            <p className="mt-0.5 text-xs font-medium text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-slate-800">Recent Updates</h2>
        {leads.length === 0 ? (
          <p className="text-sm text-slate-400">No recent updates yet.</p>
        ) : (
          <ul className="space-y-4">
            {leads.slice(0, 5).map((lead) => (
              <li key={lead.id} className="flex gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${statusDot[lead.status] || "bg-slate-400"}`} />
                <div>
                  <p className="text-sm text-slate-700">
                    Lead “{lead.name}” — {lead.status}
                  </p>
                  <p className="text-xs text-slate-400">{formatDate(lead.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
