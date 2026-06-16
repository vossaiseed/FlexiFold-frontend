import React from "react";

const requests = [
  {
    title: "New Lead Approval",
    user: "Sidharth Roy",
    date: "Jun 4, 2026",
    priority: "High",
    status: "Pending",
  },
  {
    title: "Conversion Request",
    user: "Anisha Patel",
    date: "Jun 3, 2026",
    priority: "Medium",
    status: "Approved",
  },
  {
    title: "Measurement Approval",
    user: "Amir Khan",
    date: "Jun 2, 2026",
    priority: "Low",
    status: "Pending",
  },
  {
    title: "Royalty Approval",
    user: "Priya Menon",
    date: "Jun 1, 2026",
    priority: "High",
    status: "Rejected",
  },
];

const statusStyles = {
  Pending: "bg-slate-100 text-slate-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

const priorityStyles = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-700",
};

export default function ApprovalRequests() {
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
          Review the latest approvals quickly with compact request cards and status insights.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {requests.map((request) => (
          <div
            key={request.title}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-950">{request.title}</p>
                <p className="mt-2 text-sm text-slate-500">Requested by {request.user}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}
              >
                {request.status}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-slate-500">{request.date}</span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[request.priority]}`}
              >
                {request.priority} Priority
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
