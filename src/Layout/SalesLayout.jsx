import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Menu } from "lucide-react";
import SalesSidebar from "../components/common/Sidebars/SalesSidebar";
import UserMenu from "../components/common/UserMenu";
import { fetchLeads } from "../redux/features/leads/leadsSlice";
import { fetchConversions } from "../redux/features/conversions/conversionsSlice";
import { fetchSalesTeam } from "../redux/features/salesTeam/salesTeamSlice";
import { fetchProjects } from "../redux/features/projects/projectsSlice";
import { fetchSiteVisits } from "../redux/features/siteVisits/siteVisitsSlice";
import { fetchMeasurements } from "../redux/features/measurements/measurementsSlice";
import { fetchModels } from "../redux/features/models/modelsSlice";
import useRefetchOnFocus from "../utils/useRefetchOnFocus";

const sectionTitles = {
  dashboard: "Dashboard",
  leads: "My Leads",
  notifications: "Notifications",
  profile: "Profile",
};

export default function SalesLayout() {
  const { pathname } = useLocation();
  const segment = pathname.split("/").filter(Boolean).pop();
  const title = sectionTitles[segment] || "Sales Team";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();

  const refresh = () => {
    dispatch(fetchLeads());
    dispatch(fetchConversions()); // for useMyLeads effectiveStatus
    dispatch(fetchSalesTeam()); // map this user to their salesstaff id for "my leads"
    dispatch(fetchProjects());
    dispatch(fetchSiteVisits());
    dispatch(fetchMeasurements());
    dispatch(fetchModels());
  };
  useEffect(() => { refresh(); }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps
  useRefetchOnFocus(refresh);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans lg:flex-row">
      <SalesSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

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
