import React from "react";

const summary = [
  { label: "Total Earnings", value: "₹1,24,000", color: "text-slate-900" },
  { label: "This Month", value: "₹18,500", color: "text-emerald-600" },
  { label: "Pending", value: "₹6,000", color: "text-amber-600" },
  { label: "Paid Out", value: "₹1,00,000", color: "text-violet-600" },
];

const history = [
  { id: 1, lead: "Toji Joseph", date: "09 May 2026", amount: "₹12,000", status: "Paid" },
  { id: 2, lead: "Sidharth Roy", date: "02 May 2026", amount: "₹6,500", status: "Pending" },
  { id: 3, lead: "Arun Public RV", date: "25 Apr 2026", amount: "₹9,000", status: "Paid" },
  { id: 4, lead: "Hashir Ali", date: "13 Apr 2026", amount: "₹4,500", status: "Paid" },
];

const statusStyle = { Paid: "bg-emerald-50 text-emerald-600", Pending: "bg-amber-50 text-amber-600" };

export default function EarningsSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-xs font-medium text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-slate-800">Earnings History</h2>
        <div className="divide-y divide-slate-100">
          {history.map((h) => (
            <div key={h.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">{h.lead}</p>
                <p className="text-xs text-slate-400">{h.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-900">{h.amount}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle[h.status]}`}>{h.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
