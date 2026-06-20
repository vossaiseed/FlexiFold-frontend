import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserCog } from "lucide-react";
import { fetchProjectManagers, selectProjectManagers } from "../../redux/features/projectManagers/projectManagersSlice";
import { fetchProjects, selectProjects, createProject } from "../../redux/features/projects/projectsSlice";
import { getLeadId } from "../../utils/leadHelpers";

const statusStyle = {
  Pending: "bg-slate-100 text-slate-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
  "On Hold": "bg-red-100 text-red-700",
};

// Assign (or re-assign) a Project Manager to a lead's project.
// Used by both Admin and Sales Team. Self-contained: fetches its own data.
export default function AssignProjectManager({ leadId, autoFetch = true }) {
  const dispatch = useDispatch();
  const projectManagers = useSelector(selectProjectManagers);
  const projects = useSelector(selectProjects);
  const [pmId, setPmId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // When rendered in a list, the parent fetches once — pass autoFetch={false}.
  useEffect(() => {
    if (!autoFetch) return;
    if (!projectManagers?.length) dispatch(fetchProjectManagers());
    dispatch(fetchProjects());
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const project = useMemo(() => (projects || []).find((p) => p.lead_id === leadId), [projects, leadId]);

  const assign = async () => {
    if (!pmId) return;
    setBusy(true);
    setError(null);
    try {
      await dispatch(createProject({ lead_id: leadId, project_manager_id: pmId })).unwrap();
      setPmId("");
    } catch (e) {
      setError(typeof e === "string" ? e : e?.message || "Could not assign project manager.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
        <UserCog className="h-4 w-4 text-emerald-600" /> Project Manager
      </p>

      {project?.project_manager_id ? (
        <p className="mt-1 text-xs text-slate-500">
          Assigned to <span className="font-semibold text-slate-700">{project.project_manager_name || "—"}</span>
          <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyle[project.status] || "bg-slate-100 text-slate-600"}`}>
            {project.status}
          </span>
        </p>
      ) : (
        <p className="mt-1 text-xs text-slate-400">No project manager assigned yet.</p>
      )}

      {error && <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <select
          value={pmId}
          onChange={(e) => setPmId(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        >
          <option value="">{project?.project_manager_id ? "Re-assign to…" : "Select a project manager…"}</option>
          {(projectManagers || []).map((p) => (
            <option key={getLeadId(p)} value={getLeadId(p)}>{p.name}</option>
          ))}
        </select>
        <button
          onClick={assign}
          disabled={busy || !pmId}
          className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
        >
          {busy ? "Assigning…" : project?.project_manager_id ? "Re-assign" : "Assign PM"}
        </button>
      </div>
      {(projectManagers || []).length === 0 && (
        <p className="mt-2 text-xs text-slate-400">No project managers exist yet — ask an admin to add one.</p>
      )}
    </div>
  );
}
