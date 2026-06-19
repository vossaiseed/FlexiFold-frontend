import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { CalendarClock, Phone, Check, MapPin } from "lucide-react";
import { updateLead } from "../../../redux/features/leads/leadsSlice";
import { formatLeadDate } from "../../../utils/leadHelpers";
import useMyLeads from "../../../utils/useMyLeads";

const initial = (name) => name?.trim()?.[0]?.toUpperCase() || "?";
const dateVal = (v) => (v ? new Date(v).getTime() : Infinity); // undated → last

export default function FollowUpsSection() {
  const dispatch = useDispatch();
  const myLeads = useMyLeads();
  const [busyId, setBusyId] = useState(null);

  // The telecaller's leads currently in the Follow-up stage, soonest due first.
  const items = useMemo(
    () =>
      myLeads
        .filter((l) => l.effectiveStatus === "Follow-up")
        .sort((a, b) => dateVal(a.next_follow_up) - dateVal(b.next_follow_up)),
    [myLeads]
  );

  // Mark Done = move the lead forward to "In Progress".
  const markDone = async (id) => {
    setBusyId(id);
    try { await dispatch(updateLead({ leadId: id, changes: { status: "In Progress" } })).unwrap(); }
    catch { /* surfaced via slice */ }
    finally { setBusyId(null); }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
        <CalendarClock className="h-8 w-8 text-slate-300" />
        <p className="font-semibold text-slate-500">No follow-ups pending</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {items.map((f) => (
        <div key={f.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 border-l-4 border-l-amber-400 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                {initial(f.name)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800">{f.name}</p>
                <p className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="h-3 w-3" /> {f.location || "—"}
                </p>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
              <CalendarClock className="h-3 w-3" /> {f.next_follow_up ? formatLeadDate(f.next_follow_up) : "No date"}
            </span>
          </div>

          {f.notes && <p className="text-xs leading-relaxed text-slate-600">{f.notes}</p>}

          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
            <a
              href={`tel:${f.phone}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
            >
              <Phone className="h-3.5 w-3.5" /> Call
            </a>
            <button
              onClick={() => markDone(f.id)}
              disabled={busyId === f.id}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <Check className="h-3.5 w-3.5" /> Mark Done
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
