import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RotateCcw, Trash2, AlertCircle, MapPin, Phone } from "lucide-react";
import { updateLead, deleteLead } from "../../redux/features/leads/leadsSlice";
import { getLeadId, REJECTED_STATUS } from "../../utils/leadHelpers";

const initial = (name) => name?.trim()?.[0]?.toUpperCase() || "?";

export default function Trash() {
  const dispatch = useDispatch();
  const leads = useSelector((store) => store.leads.leads);

  // Rejected leads live in the Trash.
  const items = (leads || []).filter((lead) => lead?.status === REJECTED_STATUS);

  // Restore puts the lead back into the Pending Review queue.
  const restore = (id) => dispatch(updateLead({ leadId: id, changes: { status: "New" } }));
  // Permanently remove the lead.
  const purge = (id) => dispatch(deleteLead(id));
  const emptyTrash = () => items.forEach((item) => dispatch(deleteLead(getLeadId(item))));

  return (
    <div className="font-sans mt-3">
      {/* Info bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <AlertCircle className="h-4 w-4 text-slate-400" />
          Rejected leads land here. Restore them to the review queue or delete permanently.
        </p>
        {items.length > 0 && (
          <button
            onClick={emptyTrash}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
          >
            <Trash2 className="h-3.5 w-3.5" /> Empty Trash
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
          <Trash2 className="h-8 w-8 text-slate-300" />
          <p className="font-semibold text-slate-500">Trash is empty</p>
          <p className="text-sm text-slate-400">Rejected leads will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const id = getLeadId(item);
            return (
              <div key={id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
                    {initial(item.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">{item.name}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      <Phone className="h-3 w-3" /> {item.phone}
                    </p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                  {item.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> {item.location}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => restore(id)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Restore
                  </button>
                  <button
                    onClick={() => purge(id)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
