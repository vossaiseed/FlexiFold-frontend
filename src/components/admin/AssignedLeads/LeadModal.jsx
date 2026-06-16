import React from "react";

export default function LeadModal({ lead, onClose }) {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-2 py-2 sm:px-4 sm:py-4">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[calc(100vh-2.5rem)] overflow-y-auto rounded-[20px] bg-white shadow-2xl border border-slate-200"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-3 rounded-full bg-white p-3 text-slate-500 shadow-sm transition hover:bg-slate-100"
        >
          ✕
        </button>
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 pt-5 pb-3 px-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-100 text-base font-semibold text-emerald-700">
              {lead.name
                .split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">Lead</p>
              <h2 className="mt-1 text-base sm:text-lg font-semibold text-slate-900 break-words">{lead.name}</h2>
              <p className="mt-1 text-sm text-slate-500">Assigned to {lead.assignee}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="rounded-[20px] border border-slate-200 bg-white p-2 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <span className="text-lg">📞</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="mt-1 font-semibold text-slate-900">{lead.phone}</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {lead.status}
              </span>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-2">
                <p className="text-xs text-slate-400">Location</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{lead.location}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2">
                <p className="text-xs text-slate-400">Time</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{lead.time}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs  uppercase  text-slate-400">Sales Assignment</p>
                  <p className="mt-2 font-semibold text-slate-900">{lead.team || "MI"}</p>
                </div>
                <button className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 w-full sm:w-auto">
                  Change
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <p className="text-xs uppercase  text-slate-400">Partner</p>
              <p className="mt-2 font-semibold text-slate-900">{lead.assignee}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 w-full">
              Convert Lead
            </button>
            <button className="rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 w-full">
              Reject Lead
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Add Report</p>
            <textarea
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              placeholder="What happened? (e.g. called, interested, follow-up needed...)"
            />
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <select className="rounded-3xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100">
                <option>In Progress</option>
                <option>Converted</option>
                <option>Failed</option>
              </select>
              <input
                type="date"
                className="rounded-3xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <button className="mt-3 w-full rounded-3xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition">
              Add Report
            </button>
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Activity Timeline</p>
                <p className="mt-2 text-sm text-slate-500">Lead claimed by {lead.team || "MI"}</p>
                <p className="mt-1 text-xs text-slate-400">{lead.time}</p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">in progress</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-950 px-3 py-2 text-center text-sm text-slate-200">
          Download all lead reports as PDF
        </div>
      </div>
    </div>
  );
}
