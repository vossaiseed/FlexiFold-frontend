import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2 } from "lucide-react";
import { selectProjects, updateProject } from "../../redux/features/projects/projectsSlice";
import { selectProjectManagers } from "../../redux/features/projectManagers/projectManagersSlice";
import { findMyPm } from "../../utils/pipeline";
import PMProjectCard from "../../components/projectManager/PMProjectCard";

export default function PMCompleted() {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const projectManagers = useSelector(selectProjectManagers);
  const { user } = useSelector((s) => s.auth);
  const [busy, setBusy] = useState(false);

  const role = user?.user_metadata?.role;
  const myPm = useMemo(() => findMyPm(projectManagers, user), [projectManagers, user]);

  const completed = useMemo(() => {
    let list = (projects || []).filter((p) => p.status === "Completed");
    if (role !== "admin" && myPm) list = list.filter((p) => p.project_manager_id === (myPm.id ?? myPm._id));
    return list;
  }, [projects, role, myPm]);

  const onStatus = async (id, status) => {
    setBusy(true);
    try {
      await dispatch(updateProject({ id, changes: { status } })).unwrap();
    } catch { /* surfaced via slice error */ }
    finally { setBusy(false); }
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        <h1 className="text-lg font-bold text-slate-900">Completed Projects</h1>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">{completed.length}</span>
      </div>

      {completed.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <CheckCircle2 className="h-8 w-8 text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">No completed projects yet</p>
          <p className="text-sm text-slate-400">Projects you mark completed will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {completed.map((p) => (
            <PMProjectCard key={p.id ?? p._id} project={p} onStatus={onStatus} busy={busy} />
          ))}
        </div>
      )}
    </div>
  );
}
