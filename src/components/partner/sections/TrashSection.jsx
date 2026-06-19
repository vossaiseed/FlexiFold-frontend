import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RotateCcw, Trash2, MapPin } from "lucide-react";
import { updateLead, deleteLead } from "../../../redux/features/leads/leadsSlice";
import { formatLeadDate } from "../../../utils/leadHelpers";

const initial = (name) => name?.trim()?.[0]?.toUpperCase() || "?";

export default function TrashSection() {
  const dispatch = useDispatch();
  const leads = useSelector((s) => s.leads.leads);
  const [busyId, setBusyId] = useState(null);

  // Trash = this partner's rejected leads (the store is already partner-scoped).
  const items = useMemo(
    () => (leads || []).filter((l) => l?.status === "Rejected"),
    [leads]
  );

  const restore = async (id) => {
    setBusyId(id);
    try { await dispatch(updateLead({ leadId: id, changes: { status: "New" } })).unwrap(); }
    catch { /* surfaced via slice */ }
    finally { setBusyId(null); }
  };

  const destroy = async (item) => {
    if (!window.confirm(`Permanently delete "${item.name}"? This cannot be undone.`)) return;
    setBusyId(item.id);
    try { await dispatch(deleteLead(item.id)).unwrap(); }
    catch { /* surfaced via slice */ }
    finally { setBusyId(null); }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
        <Trash2 className="h-8 w-8 text-slate-300" />
        <p className="font-semibold text-slate-500">Trash is empty</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
              {initial(item.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-800">{item.name}</p>
              <p className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="h-3 w-3" /> {item.location || "—"}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Added {formatLeadDate(item.created_at)}</p>
          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
            <button
              onClick={() => restore(item.id)}
              disabled={busyId === item.id}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Restore
            </button>
            <button
              onClick={() => destroy(item)}
              disabled={busyId === item.id}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
