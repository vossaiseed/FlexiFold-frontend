import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, MapPin, Clock, Phone, UserPlus, Inbox } from "lucide-react";
import { updateLead } from "../../redux/features/leads/leadsSlice";
import { formatLeadTime } from "../../utils/leadHelpers";

const initial = (name) => name?.trim()?.[0]?.toUpperCase() || "?";

// A lead is "in the pool" if it's unassigned and still open (not closed/rejected).
const CLOSED = ["Converted", "Failed", "Rejected"];

export default function LeadPool() {
  const dispatch = useDispatch();
  const allLeads = useSelector((s) => s.leads.leads);
  const isLoading = useSelector((s) => s.leads.isLoading);
  const { user } = useSelector((s) => s.auth);

  const [query, setQuery] = useState("");
  const [claimingId, setClaimingId] = useState(null);

  const poolLeads = useMemo(
    () => (allLeads || []).filter((l) => !l?.assigned_to && !CLOSED.includes(l?.status)),
    [allLeads]
  );

  const filtered = poolLeads.filter((l) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const haystack = `${l.name || ""} ${l.location || ""} ${l.requirement || ""} ${l.phone || ""}`.toLowerCase();
    return haystack.includes(q);
  });

  // Claim = assign the lead to the current user, which removes it from the pool.
  const claim = async (lead) => {
    if (!user?.id) return;
    setClaimingId(lead.id);
    try {
      await dispatch(updateLead({ leadId: lead.id, changes: { assigned_to: user.id } })).unwrap();
    } catch { /* error surfaced via leads slice */ }
    finally { setClaimingId(null); }
  };

  return (
    <div className="font-sans mt-3">
      {/* Header row */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          <span className="font-bold text-slate-900">{poolLeads.length}</span> leads available to claim
        </p>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the lead pool"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {isLoading && poolLeads.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-500">Loading lead pool…</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
          <Inbox className="h-8 w-8 text-slate-300" />
          <p className="font-semibold text-slate-500">No leads in the pool</p>
          <p className="text-sm text-slate-400">New unassigned leads will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((lead) => (
            <div key={lead.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              {/* Header */}
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {initial(lead.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">{lead.name}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <Phone className="h-3 w-3" /> {lead.phone}
                  </p>
                </div>
              </div>

              {/* Meta */}
              {lead.location && (
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> {lead.location}
                </p>
              )}
              {lead.requirement && (
                <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">{lead.requirement}</p>
              )}

              {/* Footer */}
              <div className="mt-1 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="h-3.5 w-3.5" /> {formatLeadTime(lead.created_at)}
                </span>
                <button
                  onClick={() => claim(lead)}
                  disabled={claimingId === lead.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <UserPlus className="h-3.5 w-3.5" /> {claimingId === lead.id ? "Claiming…" : "Claim"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
