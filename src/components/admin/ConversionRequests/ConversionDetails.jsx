import React from "react";
import { formatLeadDate } from "../../../utils/leadHelpers";

export default function ConversionDetails({ conversion, onBack, onApprove, onReject }) {
  const c = conversion || {};
  const data = {
    leadName: c.lead_name || "—",
    customerName: c.customer_name || c.lead_name || "—",
    salesStaff: c.sales_staff_name || "Unassigned",
    amount: c.amount === null || c.amount === undefined || c.amount === "" ? "—" : `₹${c.amount}`,
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
        <div className="flex flex-wrap gap-3">
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
            onClick={onApprove}
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
