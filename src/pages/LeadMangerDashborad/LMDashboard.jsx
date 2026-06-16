import React from "react";
import LMStats from "../../components/admin/LeadManagerDashboard/LMStats";
import LMPipeline from "../../components/admin/LeadManagerDashboard/LMPipeline";
import LMInactiveLeads from "../../components/admin/LeadManagerDashboard/LMInactiveLeads";
import LMStaffLoad from "../../components/admin/LeadManagerDashboard/LMStaffLoad";
import LMTopPerformers from "../../components/admin/LeadManagerDashboard/LMTopPerformers";
import LMRecentActivity from "../../components/admin/LeadManagerDashboard/LMRecentActivity";
import LMQuickActions from "../../components/admin/LeadManagerDashboard/LMQuickActions";

export default function LeadManagerDashboard() {
  return (
    <div className="min-w-0">
      {/* Header */}
      {/* <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">Lead Manager</p>
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
      </div> */}

      <LMStats />

      <div className="mt-4">
        <LMPipeline />
      </div>

      {/* Two-column body */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <LMInactiveLeads />
          <LMStaffLoad />
          <LMTopPerformers />
        </div>
        <div className="space-y-4">
          <LMRecentActivity />
          <LMQuickActions />
        </div>
      </div>
    </div>
  );
}
