import React from "react";
import { Mail, Building2, MapPin, Users, CheckCircle2, Activity, IndianRupee } from "lucide-react";

// statuses that no longer count as "active"
const CLOSED_STATUSES = ["Converted", "Failed", "Not Interested", "Rejected"];

// Section 1 — Partner profile + statistics cards
export default function PartnerProfile({ partner = {}, leads = [] }) {
  const name = partner.name || "—";
  const initials = name.charAt(0)?.toUpperCase() || "?";
  const company = partner.companyname || "—";
  const location = [partner.city, partner.state].filter(Boolean).join(", ") || "—";
  const email = partner.email || "—";

  const stats = [
    { label: "Total Leads", value: leads.length, icon: Users, bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-100" },
    { label: "Converted Leads", value: leads.filter((l) => l.status === "Converted").length, icon: CheckCircle2, bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100" },
    { label: "Active Leads", value: leads.filter((l) => !CLOSED_STATUSES.includes(l.status)).length, icon: Activity, bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-100" },
    { label: "Royalty Earned", value: "₹0", icon: IndianRupee, bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-100" },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Profile header */}
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left sm:gap-5">
        {partner.image ? (
          <img
            src={partner.image}
            alt={name}
            className="h-20 w-20 rounded-3xl object-cover ring-4 ring-emerald-100"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-2xl font-bold text-emerald-700 ring-4 ring-emerald-50">
            {initials}
          </div>
        )}

        <div className="mt-3 min-w-0 sm:mt-0">
          <h1 className="text-xl font-bold text-slate-900">{name}</h1>
          <div className="mt-2 flex flex-col items-center gap-1.5 text-sm text-slate-500 sm:items-start">
            <span className="flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-slate-400" /> {email}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-slate-400" /> {company}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-400" /> {location}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, bg, text, ring }) => (
          <div key={label} className={`rounded-2xl ${bg} p-4 ring-1 ${ring}`}>
            <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 ${text}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-xl font-bold text-slate-900">{value}</p>
            <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
