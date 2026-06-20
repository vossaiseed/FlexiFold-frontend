import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FolderKanban, ClipboardCheck, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { selectProjects, updateProject } from "../../redux/features/projects/projectsSlice";
import { selectProjectManagers } from "../../redux/features/projectManagers/projectManagersSlice";
import { findMyPm, isPendingVerification } from "../../utils/pipeline";
import PMProjectCard from "../../components/projectManager/PMProjectCard";

const StatCard = ({ label, value, Icon, tone }) => {
  const tones = {
    slate: "bg-slate-50 text-slate-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone] || tones.slate}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
};

export default function PMDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projects = useSelector(selectProjects);
  const projectManagers = useSelector(selectProjectManagers);
  const measurements = useSelector((s) => s.measurements.items);
  const models = useSelector((s) => s.models.items);
  const { user } = useSelector((s) => s.auth);
  const [busy, setBusy] = useState(false);

  const role = user?.user_metadata?.role;
  const myPm = useMemo(() => findMyPm(projectManagers, user), [projectManagers, user]);

  const mine = useMemo(() => {
    const list = projects || [];
    if (role === "admin") return list;
    if (myPm) return list.filter((p) => p.project_manager_id === (myPm.id ?? myPm._id));
    return [];
  }, [projects, role, myPm]);

  const active = mine.filter((p) => p.status !== "Completed");

  const toVerify =
    (measurements || []).filter(isPendingVerification).length +
    (models || []).filter(isPendingVerification).length;

  const counts = {
    total: mine.length,
    inProgress: mine.filter((p) => p.status === "In Progress").length,
    completed: mine.filter((p) => p.status === "Completed").length,
  };

  const onStatus = async (id, status) => {
    setBusy(true);
    try { await dispatch(updateProject({ id, changes: { status } })).unwrap(); }
    catch { /* surfaced via slice error */ }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="flex flex-col gap-4 overflow-hidden rounded-3xl bg-linear-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">Project Manager</p>
          <h1 className="mt-1 text-2xl font-bold">Welcome back, {user?.user_metadata?.name || "Manager"}</h1>
          <p className="mt-1 text-sm text-emerald-100">
            {active.length} active project{active.length === 1 ? "" : "s"}
            {toVerify > 0 ? ` · ${toVerify} item${toVerify === 1 ? "" : "s"} to verify` : ""}
          </p>
        </div>
        {toVerify > 0 && (
          <button
            onClick={() => navigate("/project-manager/verifications")}
            className="inline-flex items-center gap-2 self-start rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25 sm:self-auto"
          >
            Review {toVerify} upload{toVerify === 1 ? "" : "s"} <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="My Projects" value={counts.total} Icon={FolderKanban} tone="blue" />
        <StatCard label="To Verify" value={toVerify} Icon={ClipboardCheck} tone="amber" />
        <StatCard label="In Progress" value={counts.inProgress} Icon={Loader2} tone="amber" />
        <StatCard label="Completed" value={counts.completed} Icon={CheckCircle2} tone="emerald" />
      </div>

      {/* Active projects */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Active Projects</h2>
          {counts.completed > 0 && (
            <button onClick={() => navigate("/project-manager/completed")} className="text-sm font-semibold text-emerald-600 hover:underline">
              View completed →
            </button>
          )}
        </div>
        {active.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <FolderKanban className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-semibold text-slate-500">No active projects</p>
            <p className="text-sm text-slate-400">Projects assigned to you will show up here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {active.map((p) => (
              <PMProjectCard key={p.id ?? p._id} project={p} onStatus={onStatus} busy={busy} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
