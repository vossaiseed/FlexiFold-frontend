import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { getLeadId, PENDING_STATUSES, formatLeadDate, leadOwnerName } from "../../../utils/leadHelpers";

const statusStyles = {
  New: "bg-blue-100 text-blue-700",
  Pending: "bg-slate-100 text-slate-700",
  Discussion: "bg-indigo-100 text-indigo-700",
  "Follow-up": "bg-amber-100 text-amber-700",
  Converted: "bg-emerald-100 text-emerald-700",
  Failed: "bg-red-100 text-red-700",
  Rejected: "bg-red-100 text-red-700",
};
const STATUS_FALLBACK = "bg-slate-100 text-slate-700";

const priorityStyles = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-700",
};
const PRIORITY_FALLBACK = "bg-slate-100 text-slate-700";

export default function ApprovalRequests() {
  const leads = useSelector((store) => store.leads.leads);

  // Show the most recent leads awaiting approval (API already orders by newest).
  const requests = useMemo(
    () =>
      (leads || [])
        .filter((l) => PENDING_STATUSES.includes(l?.status))
        .slice(0, 4)
        .map((l) => ({
          id: getLeadId(l),
          name: l.name || "Unnamed lead",
          user: leadOwnerName(l),
          date: formatLeadDate(l.created_at),
          priority: l.urgency || "Medium",
          status: l.status,
        })),
    [leads]
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Approval requests
          </p>
          <h2 className="text-2xl font-semibold text-slate-950">Recent request activity</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-500">
          The latest leads submitted by partners that are waiting for your approval.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No approval requests right now.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-slate-950">{request.name}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    New lead approval &middot; Submitted by {request.user}
                  </p>
                </div>
                <span
                  className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status] || STATUS_FALLBACK}`}
                >
                  {request.status}
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-slate-500">{request.date}</span>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[request.priority] || PRIORITY_FALLBACK}`}
                >
                  {request.priority} Priority
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
