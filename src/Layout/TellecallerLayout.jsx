import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import TellecallerSidebar from "../components/common/Sidebars/TellecallerSidebar";
import UserMenu from "../components/common/UserMenu";

const sectionTitles = {
  dashboard: "Dashboard",
  leads: "My Leads",
  "call-logs": "Call Logs",
  "follow-ups": "Follow-ups",
  notifications: "Notifications",
  profile: "Profile",
};

export default function TellecallerLayout() {
  const { pathname } = useLocation();
  const segment = pathname.split("/").filter(Boolean).pop();
  const title = sectionTitles[segment] || "Dashboard";
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans lg:flex-row">
      <TellecallerSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top navbar */}
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
          <UserMenu name="Anjana Krishnan" role="Telecaller" email="anjana.k@flexifold.com" initial="A" />
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
