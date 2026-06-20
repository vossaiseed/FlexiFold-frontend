import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, MapPin, Phone, User } from "lucide-react";
import { fetchProjects, selectProjects } from "../../redux/features/projects/projectsSlice";
import { formatLeadDate } from "../../utils/leadHelpers";

export default function CompletedProjects() {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const completed = useMemo(
    () => (projects || []).filter((p) => p.status === "Completed"),
    [projects]
  );

  return (
    <div className="font-sans">
      <div className="mb-4 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        <h1 className="text-xl font-bold text-slate-900">Completed Projects</h1>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">{completed.length}</span>
      </div>

      {completed.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center text-sm text-slate-400">
          No completed projects yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {completed.map((p) => (
            <div key={p.id ?? p._id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="truncate text-base font-bold text-slate-900">{p.lead_name || "Project"}</p>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Completed</span>
              </div>
              <div className="flex flex-col gap-1 text-xs text-slate-500">
                {p.lead_phone && <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{p.lead_phone}</span>}
                {p.lead_location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{p.lead_location}</span>}
                <span className="inline-flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{p.project_manager_name || "—"}</span>
              </div>
              <p className="mt-1 border-t border-slate-100 pt-2 text-xs text-slate-400">
                Completed {p.completed_at ? formatLeadDate(p.completed_at) : "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
