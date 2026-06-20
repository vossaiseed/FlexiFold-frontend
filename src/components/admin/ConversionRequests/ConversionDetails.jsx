import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesTeam, selectSalesTeam } from "../../../redux/features/salesTeam/salesTeamSlice";
import { getLeadId, formatLeadDate } from "../../../utils/leadHelpers";

export default function ConversionDetails({ conversion, onBack, onApprove, onReject }) {
  const c = conversion || {};
  const dispatch = useDispatch();
  const salesTeam = useSelector(selectSalesTeam) || [];
  const leads = useSelector((s) => s.leads.leads) || [];
  const [salesId, setSalesId] = useState("");
  const isPending = (c.status || "Pending") === "Pending";

  useEffect(() => { dispatch(fetchSalesTeam()); }, [dispatch]);

  const handleApprove = () => {
    const member = salesTeam.find((s) => String(getLeadId(s)) === String(salesId)) || null;
    onApprove(member);
  };

  // Prefer the lead's current conversion_amount (latest, from Telecaller OR Sales)
  // read straight from the store so it's always fresh; fall back to the request.
  const hasVal = (v) => v !== null && v !== undefined && v !== "";
  const leadRow = leads.find((l) => getLeadId(l) === c.lead_id);
  const effAmount = hasVal(leadRow?.conversion_amount)
    ? leadRow.conversion_amount
    : (c.effective_amount ?? c.lead_conversion_amount ?? c.amount);

  const data = {
    leadName: c.lead_name || "—",
    customerName: c.customer_name || c.lead_name || "—",
    salesStaff: c.sales_staff_name || "Unassigned",
    amount: hasVal(effAmount) ? `₹${effAmount}` : "—",
    date: formatLeadDate(c.created_at),
    status: c.status || "Pending",
    notes: c.notes || "No notes.",
    leadEmail: c.lead_email || "—",
    customerPhone: c.lead_phone || "—",
    staffEmail: c.sales_staff_email || "—",
    staffPhone: c.sales_staff_phone || "—",
  };

  return (
    <div className="rounded-4xl bg-slate-50 p-6 shadow-2xl ring-1 ring-slate-200 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Conversion details</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">Lead and conversion overview</h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isPending && (
            <select
              value={salesId}
              onChange={(e) => setSalesId(e.target.value)}
              className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Assign to Sales Team… (optional)</option>
              {salesTeam.map((s) => (
                <option key={getLeadId(s)} value={getLeadId(s)}>{s.name}</option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onReject}
            className="rounded-full bg-red-100 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-200"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Approve
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Lead name</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{data.leadName}</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{data.status}</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Lead email</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{data.leadEmail}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Lead phone</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{data.customerPhone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-900">Customer details</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Customer name</p>
                <p className="mt-1 text-sm text-slate-700">{data.customerName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Customer phone</p>
                <p className="mt-1 text-sm text-slate-700">{data.customerPhone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-900">Sales staff</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Staff name</p>
                <p className="mt-1 text-sm text-slate-700">{data.salesStaff}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Staff contact</p>
                <p className="mt-1 text-sm text-slate-700">{data.staffPhone}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Staff email</p>
                <p className="mt-1 text-sm text-slate-700">{data.staffEmail}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Conversion summary</p>
            <div className="mt-5 grid gap-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Amount</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{data.amount}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Requested date</p>
                <p className="mt-2 text-sm text-slate-700">{data.date}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Notes & remarks</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">{data.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
