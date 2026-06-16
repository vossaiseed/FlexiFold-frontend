import React from "react";

const stats = [
  {
    title: "Total Conversion Requests",
    value: "84",
    description: "Requests received this month",
    change: "+12%",
    trend: "up",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 17l4-4 4 4 4-8 4 4" />
      </svg>
    ),
  },
  {
    title: "Pending Requests",
    value: "28",
    description: "Awaiting manager review",
    change: "+4%",
    trend: "up",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Approved Requests",
    value: "42",
    description: "Completed conversions",
    change: "+18%",
    trend: "up",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    title: "Rejected Requests",
    value: "14",
    description: "Declined approvals",
    change: "-6%",
    trend: "down",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
      </svg>
    ),
  },
];

export default function ConversionStats() {
  return (
    <section className="space-y-6">
      {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">
            Conversion dashboard
          </p>
          <h2 className="text-3xl font-semibold text-slate-950">Conversion request performance</h2>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
          Last updated 2 hours ago
        </div>
      </div> */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.title}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-950">{item.value}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
                {item.icon}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">{item.description}</p>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  item.trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                }`}
              >
                {item.trend === "up" ? "▲" : "▼"} {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
