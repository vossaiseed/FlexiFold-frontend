import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Leadcategory from "../../components/admin/AssignedLeads/Leadcategory";
import { updateLead } from "../../redux/features/leads/leadsSlice";
import { REJECTED_STATUS, getLeadId, formatLeadTime, leadOwnerName } from "../../utils/leadHelpers";

// Map a Supabase lead row onto the shape LeadCard expects.
const toCard = (lead) => ({
  id: getLeadId(lead),
  status: lead.status,
  name: lead.name,
  phone: lead.phone,
  location: lead.location,
  team: lead.assigned_name ? `Sales: ${lead.assigned_name}` : "",
  time: formatLeadTime(lead.created_at),
  assignee: leadOwnerName(lead),
});

export default function LMLeads() {
  const dispatch = useDispatch();
  const leads = useSelector((s) => s.leads.leads);

  const rows = useMemo(
    () => (leads || []).filter((l) => l?.status !== REJECTED_STATUS).map(toCard),
    [leads]
  );

  // Deleting moves the lead to Trash (status Rejected) rather than hard-deleting.
  const handleDelete = (id) =>
    dispatch(updateLead({ leadId: id, changes: { status: REJECTED_STATUS } }));

  return <Leadcategory leadsData={rows} onDelete={handleDelete} />;
}
