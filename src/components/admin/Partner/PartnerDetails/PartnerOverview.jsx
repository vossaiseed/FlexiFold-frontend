import React from "react";
import { Mic, CheckCircle2, PlusCircle, Clock } from "lucide-react";

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

// Section 2 — Quick Voice Action + Recent Updates (derived from this partner's leads)
export default function PartnerOverview({ leads = [] }) {
  const updates = leads.slice(0, 5).map((lead) => {
    const converted = lead.status === "Converted";
    return {
      id: lead.id,
      text: `Lead “${lead.name || "—"}” — ${lead.status || "New"}`,
      time: formatDate(lead.created_at),
      icon: converted ? CheckCircle2 : PlusCircle,
      bg: converted ? "bg-emerald-50" : "bg-blue-50",
      color: converted ? "text-emerald-600" : "text-blue-600",
    };
  });

  return (
    <section className="space-y-4">
      {/* Quick Voice Action */}
      <button
        type="button"
        className="group flex w-full items-center justify-between gap-3 rounded-2xl bg-linear-to-r from-emerald-500 to-green-500 p-4 text-left text-white shadow-sm shadow-emerald-200 transition hover:from-emerald-600 hover:to-green-600"
      >
        <div>
          <p className="text-sm font-semibold">Quick Voice Action</p>
          <p className="text-xs text-emerald-50/90">Tap to add a lead or update by voice</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 transition group-hover:bg-white/30">
          <Mic className="h-5 w-5" />
        </span>
      </button>

      {/* Recent Updates */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Recent Updates</h2>
          <Clock className="h-4 w-4 text-slate-300" />
        </div>

        {updates.length === 0 && (
          <p className="text-sm text-slate-400">No recent updates yet.</p>
        )}

        <ul className="space-y-3">
          {updates.map(({ id, text, time, icon: Icon, bg, color }) => (
            <li key={id} className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-slate-700">{text}</p>
                <p className="text-xs text-slate-400">{time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
