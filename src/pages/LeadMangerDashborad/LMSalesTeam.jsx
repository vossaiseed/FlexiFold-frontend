import React from "react";
import LMStaffLoad from "../../components/admin/LeadManagerDashboard/LMStaffLoad";
import LMTopPerformers from "../../components/admin/LeadManagerDashboard/LMTopPerformers";
import LMSalesStaff from "../../components/admin/LeadManagerDashboard/LMSalesStaff";

export default function LMSalesTeam() {
  return (
    <div className="min-w-0 space-y-4">
      <LMStaffLoad />
      <LMTopPerformers />
      <LMSalesStaff />
    </div>
  );
}
