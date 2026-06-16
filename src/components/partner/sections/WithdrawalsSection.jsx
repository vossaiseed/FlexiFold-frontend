import React from "react";
import { Wallet, Clock, IndianRupee, ArrowUpRight } from "lucide-react";

const summary = [
  { label: "Available Balance", value: "₹24,000", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Pending", value: "₹6,000", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Payout", value: "₹1,00,000", icon: IndianRupee, color: "text-violet-600", bg: "bg-violet-50" },
];

const history = [
  { id: 1, date: "01 Jun 2026", amount: "₹20,000", method: "Bank Transfer", status: "Completed" },
  { id: 2, date: "01 May 2026", amount: "₹15,000", method: "UPI", status: "Completed" },
  { id: 3, date: "01 Apr 2026", amount: "₹10,000", method: "Bank Transfer", status: "Processing" },
];

const statusStyle = { Completed: "bg-emerald-50 text-emerald-600", Processing: "bg-amber-50 text-amber-600" };

export default function WithdrawalsSection() {
  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {summary.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${bg} ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="mt-0.5 text-xs font-medium text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Withdraw action */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">Ready to withdraw?</p>
          <p className="text-xs text-slate-400">Transfer your available balance to your account.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600">
          <ArrowUpRight className="h-4 w-4" /> Withdraw
        </button>
      </div>

      {/* History */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-slate-800">Withdrawal History</h2>
        <div className="divide-y divide-slate-100">
          {history.map((w) => (
            <div key={w.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">{w.amount}</p>
                <p className="text-xs text-slate-400">{w.date} · {w.method}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle[w.status]}`}>{w.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
