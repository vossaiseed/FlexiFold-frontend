import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { PENDING_STATUSES, ASSIGNED_STATUSES, isToday } from "../../../utils/leadHelpers";

const icons = {
  calendar: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-6 8h6m-8 4h10M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
};

export default function PendingReviewStats() {
  const { leads, isLoading } = useSelector((store) => store.leads);

  const stats = useMemo(() => {
    const list = leads || [];
    const pending = list.filter((l) => PENDING_STATUSES.includes(l?.status));
    const pendingToday = pending.filter((l) => isToday(l?.created_at));
    const urgent = pending.filter((l) => String(l?.urgency).toLowerCase() === "high");
    const approved = list.filter((l) => ASSIGNED_STATUSES.includes(l?.status));

    return [
      { title: "Total Pending Reviews", value: pending.length, description: "Active requests awaiting action", icon: icons.calendar },
      { title: "Pending Today", value: pendingToday.length, description: "Arrived today, needs attention", icon: icons.clock },
      { title: "Urgent Reviews", value: urgent.length, description: "High priority escalations", icon: icons.alert },
      { title: "Approved", value: approved.length, description: "Moved to Assigned Leads", icon: icons.check },
    ];
  }, [leads]);

  const showSkeleton = isLoading && !(leads && leads.length);

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Review metrics
        </p>
        <h2 className="text-3xl font-semibold text-slate-950">Pending review insights</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                {showSkeleton ? (
                  <span className="mt-4 block h-8 w-12 animate-pulse rounded-lg bg-slate-200" />
                ) : (
                  <p className="mt-4 text-3xl font-semibold text-slate-950">{item.value}</p>
                )}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
                {item.icon}
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
