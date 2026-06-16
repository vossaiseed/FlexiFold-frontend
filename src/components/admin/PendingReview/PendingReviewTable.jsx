import React, { useMemo, useState } from "react";

const rows = [
  {
    leadName: "Toji Joseph & Brothers",
    customerName: "Mr. Joseph",
    partner: "Indraneel Dutta",
    phone: "9972372573",
    submittedDate: "Jun 4, 2026",
    priority: "High",
    status: "Pending",
  },
  {
    leadName: "Hashir Ali",
    customerName: "Hashir Ali",
    partner: "Benazir Ameen",
    phone: "0000000000",
    submittedDate: "Jun 3, 2026",
    priority: "Medium",
    status: "Approved",
  },
  {
    leadName: "Anup Wayanad",
    customerName: "Anoop Wayanad",
    partner: "Benazir Ameen",
    phone: "9880896946",
    submittedDate: "Jun 2, 2026",
    priority: "Low",
    status: "Pending",
  },
  {
    leadName: "Sreenath",
    customerName: "Sreenath",
    partner: "Benazir Ameen",
    phone: "9447498244",
    submittedDate: "Jun 1, 2026",
    priority: "High",
    status: "Rejected",
  },
  {
    leadName: "Aslam Munnar",
    customerName: "Aslam Munnar",
    partner: "Benazir Ameen",
    phone: "8138806990",
    submittedDate: "May 31, 2026",
    priority: "Medium",
    status: "Pending",
  },
  {
    leadName: "Ratheesh",
    customerName: "Ratheesh",
    partner: "Benazir Ameen",
    phone: "0096597591895",
    submittedDate: "May 30, 2026",
    priority: "Low",
    status: "Approved",
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

export default function PendingReviewTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const query = search.toLowerCase();
        return (
          row.leadName.toLowerCase().includes(query) ||
          row.customerName.toLowerCase().includes(query) ||
          row.partner.toLowerCase().includes(query) ||
          row.phone.toLowerCase().includes(query)
        );
      }),
    [search]
  );

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const visibleRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const handlePrev = () => setPage((value) => Math.max(1, value - 1));
  const handleNext = () => setPage((value) => Math.min(pageCount, value + 1));

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Data review queue
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Pending review table</h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block">
            <span className="sr-only">Search</span>
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search leads, customers, partner..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 sm:w-80"
            />
          </label>
          <button className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
            Filter
          </button>
        </div>
      </div>

      {/* Mobile / tablet card view */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:hidden">
        {visibleRows.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No matching records found.
          </p>
        ) : (
          visibleRows.map((row, index) => (
            <div
              key={`${row.leadName}-card-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-slate-900">{row.leadName}</p>
                  <p className="mt-0.5 truncate text-sm text-slate-500">{row.customerName}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.status]}`}>
                  {row.status}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">Partner</dt>
                  <dd className="mt-0.5 font-medium text-slate-700">{row.partner}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">Phone</dt>
                  <dd className="mt-0.5 font-medium text-slate-700">{row.phone}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">Submitted</dt>
                  <dd className="mt-0.5 font-medium text-slate-700">{row.submittedDate}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">Priority</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[row.priority]}`}>
                      {row.priority}
                    </span>
                  </dd>
                </div>
              </dl>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600">
                  Approve
                </button>
                <button className="rounded-full bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200">
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table view */}
      <div className="mt-5 hidden overflow-x-auto lg:block">
        <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm">
          <thead>
            <tr>
              {[
                "Lead Name",
                "Customer Name",
                "Partner",
                "Phone Number",
                "Submitted Date",
                "Priority",
                "Status",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                  No matching records found.
                </td>
              </tr>
            ) : (
              visibleRows.map((row, index) => (
                <tr key={`${row.leadName}-${index}`} className="bg-slate-50 rounded-3xl shadow-sm">
                  <td className="px-4 py-4 align-top text-slate-900">{row.leadName}</td>
                  <td className="px-4 py-4 align-top text-slate-700">{row.customerName}</td>
                  <td className="px-4 py-4 align-top text-slate-700">{row.partner}</td>
                  <td className="px-4 py-4 align-top text-slate-700">{row.phone}</td>
                  <td className="px-4 py-4 align-top text-slate-700">{row.submittedDate}</td>
                  <td className="px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[row.priority]}`}
                    >
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.status]}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      {/* <button className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200">
                        View
                      </button> */}
                      <button className="rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600">
                        Approve
                      </button>
                      <button className="rounded-full bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Showing {visibleRows.length} of {filteredRows.length} entries
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={page === 1}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            onClick={handleNext}
            disabled={page === pageCount}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
