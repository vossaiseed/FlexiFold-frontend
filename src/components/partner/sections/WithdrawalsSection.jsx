import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wallet, Clock, IndianRupee, ArrowUpRight } from "lucide-react";
import { fetchConversions, selectConversions } from "../../../redux/features/conversions/conversionsSlice";

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function WithdrawalsSection() {
  const dispatch = useDispatch();
  const leads = useSelector((s) => s.leads.leads);
  const conversions = useSelector(selectConversions);

  useEffect(() => {
    dispatch(fetchConversions());
  }, [dispatch]);

  // Balance is derived from the partner's conversions (same source as Earnings).
  const { available, pending } = useMemo(() => {
    const myLeadIds = new Set((leads || []).map((l) => l.id));
    const mine = (conversions || []).filter((c) => myLeadIds.has(c.lead_id));
    const amt = (c) => Number(c.amount) || 0;
    return {
      available: mine.filter((c) => c.status === "Approved").reduce((s, c) => s + amt(c), 0),
      pending: mine.filter((c) => c.status === "Pending").reduce((s, c) => s + amt(c), 0),
    };
  }, [leads, conversions]);

  const summary = [
    { label: "Available Balance", value: inr(available), icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending", value: inr(pending), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Payout", value: inr(0), icon: IndianRupee, color: "text-violet-600", bg: "bg-violet-50" },
  ];

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
          <p className="text-xs text-slate-400">Online payouts aren’t enabled yet — contact admin to withdraw.</p>
        </div>
        <button
          disabled
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
        >
          <ArrowUpRight className="h-4 w-4" /> Withdraw
        </button>
      </div>

      {/* History */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-slate-800">Withdrawal History</h2>
        <p className="py-8 text-center text-sm text-slate-400">No withdrawals yet.</p>
      </section>
    </div>
  );
}
