import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Menu } from "lucide-react";
import PMSidebar from "../components/common/Sidebars/PMSidebar";
import UserMenu from "../components/common/UserMenu";
import { fetchProjects } from "../redux/features/projects/projectsSlice";
import { fetchProjectManagers } from "../redux/features/projectManagers/projectManagersSlice";
import { fetchMeasurements } from "../redux/features/measurements/measurementsSlice";
import { fetchModels } from "../redux/features/models/modelsSlice";
import useRefetchOnFocus from "../utils/useRefetchOnFocus";

const sectionTitles = {
  dashboard: "My Projects",
  verifications: "Pending Verifications",
  completed: "Completed Projects",
};

export default function PMLayout() {
  const { pathname } = useLocation();
  const segment = pathname.split("/").filter(Boolean).pop();
  const title = sectionTitles[segment] || "Project Manager";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();

  const refresh = () => {
    dispatch(fetchProjects());
    dispatch(fetchProjectManagers()); // needed to map this user to their PM id
    dispatch(fetchMeasurements());
    dispatch(fetchModels());
  };
  useEffect(() => { refresh(); }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps
  useRefetchOnFocus(refresh);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans lg:flex-row">
      <PMSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base font-bold text-slate-900">{title}</h1>
          </div>
          <UserMenu />
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
