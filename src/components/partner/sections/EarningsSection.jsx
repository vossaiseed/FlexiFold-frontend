import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversions, selectConversions } from "../../../redux/features/conversions/conversionsSlice";
import { formatLeadDate } from "../../../utils/leadHelpers";

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const statusStyle = {
  Approved: "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  Rejected: "bg-red-50 text-red-600",
};

export default function EarningsSection() {
  const dispatch = useDispatch();
  const leads = useSelector((s) => s.leads.leads);
  const conversions = useSelector(selectConversions);

  useEffect(() => {
    dispatch(fetchConversions());
  }, [dispatch]);

  // Earnings come from conversions on this partner's leads (store is scoped to
  // the partner's leads, so we match conversions by those lead ids).
  const myConversions = useMemo(() => {
    const myLeadIds = new Set((leads || []).map((l) => l.id));
    return (conversions || []).filter((c) => myLeadIds.has(c.lead_id));
  }, [leads, conversions]);

  const now = new Date();
  const amt = (c) => Number(c.amount) || 0;
  const approved = myConversions.filter((c) => c.status === "Approved");
  const totalEarnings = approved.reduce((s, c) => s + amt(c), 0);
  const pending = myConversions
    .filter((c) => c.status === "Pending")
    .reduce((s, c) => s + amt(c), 0);
  const thisMonth = approved
    .filter((c) => {
      const d = new Date(c.created_at);
      return !isNaN(d.getTime()) && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, c) => s + amt(c), 0);

  const summary = [
    { label: "Total Earnings", value: inr(totalEarnings), color: "text-slate-900" },
    { label: "This Month", value: inr(thisMonth), color: "text-emerald-600" },
    { label: "Pending", value: inr(pending), color: "text-amber-600" },
    { label: "Paid Out", value: inr(totalEarnings), color: "text-violet-600" },
  ];

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
        {myConversions.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No earnings yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {myConversions.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{c.lead_name || c.customer_name || "Lead"}</p>
                  <p className="text-xs text-slate-400">{formatLeadDate(c.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-900">{inr(c.amount)}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle[c.status] || "bg-slate-100 text-slate-600"}`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
