import React, { useMemo, useState } from "react";

const rows = [
  {
    leadName: "Toji Joseph & Brothers",
    customerName: "Mr. Joseph",
    salesStaff: "Priya Menon",
    amount: "$18,400",
    date: "Jun 4, 2026",
    status: "Pending",
  },
  {
    leadName: "Hashir Ali",
    customerName: "Hashir Ali",
    salesStaff: "Anisha Patel",
    amount: "$11,200",
    date: "Jun 3, 2026",
    status: "Approved",
  },
  {
    leadName: "Anup Wayanad",
    customerName: "Anoop Wayanad",
    salesStaff: "Benazir Ameen",
    amount: "$9,750",
    date: "Jun 2, 2026",
    status: "Rejected",
  },
  {
    leadName: "Sreenath",
    customerName: "Sreenath",
    salesStaff: "Vishal Kumar",
    amount: "$15,200",
    date: "Jun 1, 2026",
    status: "Pending",
  },
  {
    leadName: "Aslam Munnar",
    customerName: "Aslam Munnar",
    salesStaff: "Benazir Ameen",
    amount: "$7,900",
    date: "May 31, 2026",
    status: "Approved",
  },
];

const statusStyles = {
  Pending: "bg-slate-100 text-slate-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function ConversionRequestsTable({ onView }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const query = search.toLowerCase();
      const matchesSearch =
        row.leadName.toLowerCase().includes(query) ||
        row.customerName.toLowerCase().includes(query) ||
        row.salesStaff.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "All" || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const visibleRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const handlePrev = () => setPage((value) => Math.max(1, value - 1));
  const handleNext = () => setPage((value) => Math.min(pageCount, value + 1));

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">
            Conversion queue
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Conversion requests</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(260px,_360px)_180px] xl:items-center">
          <label className="relative block w-full">
            <span className="sr-only">Search conversions</span>
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search lead, customer, sales staff"
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="relative block w-full">
            <span className="sr-only">Filter status</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </label>
        </div>
      </div>

      {/* Mobile / tablet card view */}
      <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
        {visibleRows.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No matching results.
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
                  <dt className="text-xs uppercase tracking-wide text-slate-400">Sales Staff</dt>
                  <dd className="mt-0.5 font-medium text-slate-700">{row.salesStaff}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">Amount</dt>
                  <dd className="mt-0.5 font-semibold text-slate-900">{row.amount}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">Request Date</dt>
                  <dd className="mt-0.5 font-medium text-slate-700">{row.date}</dd>
                </div>
              </dl>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onView?.(row)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  View
                </button>
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
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm">
          <thead>
            <tr>
              {["Lead Name", "Customer Name", "Sales Staff", "Conversion Amount", "Request Date", "Status", "Actions"].map((heading) => (
                <th key={heading} className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                  No matching results.
                </td>
              </tr>
            ) : (
              visibleRows.map((row, index) => (
                <tr key={`${row.leadName}-${index}`} className="bg-slate-50 rounded-3xl shadow-sm">
                  <td className="px-4 py-4 align-top text-slate-900">{row.leadName}</td>
                  <td className="px-4 py-4 align-top text-slate-700">{row.customerName}</td>
                  <td className="px-4 py-4 align-top text-slate-700">{row.salesStaff}</td>
                  <td className="px-4 py-4 align-top text-slate-700">{row.amount}</td>
                  <td className="px-4 py-4 align-top text-slate-700">{row.date}</td>
                  <td className="px-4 py-4 align-top">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onView?.(row)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        View
                      </button>
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

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-500">
          Showing {visibleRows.length} of {filteredRows.length} conversion requests
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={page === 1}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">Page {page} of {pageCount}</span>
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
