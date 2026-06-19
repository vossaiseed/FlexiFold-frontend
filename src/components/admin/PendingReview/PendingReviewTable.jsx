import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateLead, fetchLeads } from "../../../redux/features/leads/leadsSlice";
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

const pageSize = 5;

export default function PendingReviewTable() {
  const dispatch = useDispatch();
  const { leads, isLoading, error } = useSelector((store) => store.leads);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(null); // { id, action } of the in-flight action
  const [actionError, setActionError] = useState(null);

  // Normalize raw lead rows into exactly what this table renders.
  const pendingLeads = useMemo(
    () =>
      (leads || [])
        .filter((l) => PENDING_STATUSES.includes(l?.status))
        .map((l) => ({
          id: getLeadId(l),
          name: l.name || "—",
          partner: leadOwnerName(l),
          phone: l.phone || "—",
          location: l.location || "—",
          submitted: formatLeadDate(l.created_at),
          priority: l.urgency || "Medium",
          status: l.status,
        })),
    [leads]
  );

  const hasSearch = search.trim().length > 0;

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return pendingLeads;
    return pendingLeads.filter((row) =>
      [row.name, row.partner, row.phone, row.location]
        .some((field) => field.toLowerCase().includes(query))
    );
  }, [pendingLeads, search]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  // Keep the current page in range when the list shrinks (e.g. after approving
  // the last item on the last page).
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const visibleRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const runAction = async (leadId, status, action) => {
    if (!leadId) return;
    setBusy({ id: leadId, action });
    setActionError(null);
    try {
      await dispatch(updateLead({ leadId, changes: { status } })).unwrap();
    } catch (err) {
      setActionError(typeof err === "string" ? err : "Could not update the lead. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  // Approve -> lead becomes active and shows up in Assigned Leads.
  const handleApprove = (leadId) => runAction(leadId, "Discussion", "approve");
  // Reject -> lead is sent to Trash (restorable / permanently deletable there).
  const handleReject = (leadId) => runAction(leadId, "Rejected", "reject");

  const handlePrev = () => setPage((value) => Math.max(1, value - 1));
  const handleNext = () => setPage((value) => Math.min(pageCount, value + 1));

  const showLoading = isLoading && pendingLeads.length === 0;
  const showFetchError = !!error && pendingLeads.length === 0 && !isLoading;
  const emptyMessage = hasSearch
    ? "No matching records found."
    : "No leads are awaiting review.";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Data review queue
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Pending review table</h2>
        </div>

        <label className="relative block">
          <span className="sr-only">Search</span>
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search name, partner, phone or location..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 sm:w-80"
          />
        </label>
      </div>

      {actionError && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{actionError}</span>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="shrink-0 rounded-full px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading / fetch-error states */}
      {showLoading ? (
        <p className="mt-6 rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
          Loading pending leads...
        </p>
      ) : showFetchError ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-10 text-center">
          <p className="text-sm font-semibold text-red-700">Couldn&apos;t load leads.</p>
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => dispatch(fetchLeads())}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Mobile / tablet card view */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:hidden">
            {visibleRows.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                {emptyMessage}
              </p>
            ) : (
              visibleRows.map((row) => (
                <div key={row.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-slate-900">{row.name}</p>
                      <p className="mt-0.5 truncate text-sm text-slate-500">{row.location}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.status] || STATUS_FALLBACK}`}>
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
                      <dd className="mt-0.5 font-medium text-slate-700">{row.submitted}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-400">Priority</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[row.priority] || PRIORITY_FALLBACK}`}>
                          {row.priority}
                        </span>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleApprove(row.id)}
                      disabled={busy?.id === row.id}
                      className="rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busy?.id === row.id && busy.action === "approve" ? "Working..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(row.id)}
                      disabled={busy?.id === row.id}
                      className="rounded-full bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busy?.id === row.id && busy.action === "reject" ? "Working..." : "Reject"}
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
                    "Location",
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
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((row) => (
                    <tr key={row.id} className="bg-slate-50 rounded-3xl shadow-sm">
                      <td className="px-4 py-4 align-top text-slate-900">{row.name}</td>
                      <td className="px-4 py-4 align-top text-slate-700">{row.location}</td>
                      <td className="px-4 py-4 align-top text-slate-700">{row.partner}</td>
                      <td className="px-4 py-4 align-top text-slate-700">{row.phone}</td>
                      <td className="px-4 py-4 align-top text-slate-700">{row.submitted}</td>
                      <td className="px-4 py-4 align-top">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[row.priority] || PRIORITY_FALLBACK}`}>
                          {row.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.status] || STATUS_FALLBACK}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleApprove(row.id)}
                            disabled={busy?.id === row.id}
                            className="rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {busy?.id === row.id && busy.action === "approve" ? "Working..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleReject(row.id)}
                            disabled={busy?.id === row.id}
                            className="rounded-full bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {busy?.id === row.id && busy.action === "reject" ? "Working..." : "Reject"}
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
        </>
      )}
    </section>
  );
}
