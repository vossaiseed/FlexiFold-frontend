import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import PartnerSidebar from "../components/common/Sidebars/PartnerSidebar";
import TopNavbar from "../components/common/PartnerNavbar";
import { fetchLeads } from "../redux/features/leads/leadsSlice";

const sectionTitles = {
  dashboard: "Dashboard",
  leads: "Leads",
  earnings: "Earnings",
  withdrawals: "Withdrawals",
  notifications: "Notifications",
  trash: "Trash",
  profile: "Profile",
};

export default function PartnerLayout() {
  const { pathname } = useLocation();
  const segment = pathname.split("/").filter(Boolean).pop();
  const title = sectionTitles[segment] || "Dashboard";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();

  // Load leads from the backend whenever the partner area mounts (e.g. after login/refresh),
  // so the Redux store is repopulated and the data doesn't "disappear".
  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans lg:flex-row">
      <PartnerSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top navbar */}
        <TopNavbar title={title} role="Partner" initial="F" onMenuClick={() => setDrawerOpen(true)} />

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
