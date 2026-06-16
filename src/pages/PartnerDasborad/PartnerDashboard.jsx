import React, { useState } from "react";
import PartnerSidebar from "../../components/common/Sidebars/PartnerSidebar";
import DashboardSection from "../../components/partner/sections/DashboardSection";
import LeadsSection from "../../components/partner/sections/LeadsSection";
import EarningsSection from "../../components/partner/sections/EarningsSection";
import WithdrawalsSection from "../../components/partner/sections/WithdrawalsSection";
import NotificationsSection from "../../components/partner/sections/NotificationsSection";
import TrashSection from "../../components/partner/sections/TrashSection";
import ProfileSection from "../../components/partner/sections/ProfileSection";

const sections = {
  Dashboard: DashboardSection,
  Leads: LeadsSection,
  Earnings: EarningsSection,
  Withdrawals: WithdrawalsSection,
  Notifications: NotificationsSection,
  Trash: TrashSection,
  Profile: ProfileSection,
};

export default function PartnerDashboard() {
  const [active, setActive] = useState("Dashboard");
  const ActiveSection = sections[active];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans lg:flex-row">
      <PartnerSidebar active={active} onSelect={setActive} />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6">
          <ActiveSection />
        </main>
      </div>
    </div>
  );
}
