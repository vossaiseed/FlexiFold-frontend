import React, { useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Leadcategory from '../../components/admin/AssignedLeads/Leadcategory'
import LeadPipelinePanel from '../../components/admin/Pipeline/LeadPipelinePanel'
import { updateLead } from '../../redux/features/leads/leadsSlice'
import { ASSIGNED_STATUSES, REJECTED_STATUS, getLeadId, formatLeadTime, leadOwnerName } from '../../utils/leadHelpers'

// Map a Supabase lead row onto the shape LeadCard expects.
const toCard = (lead) => ({
  id: getLeadId(lead),
  status: lead.status,
  name: lead.name,
  phone: lead.phone,
  location: lead.location,
  team: lead.assigned_sales_name ? `Sales: ${lead.assigned_sales_name}` : (lead.assigned_name ? `Sales: ${lead.assigned_name}` : ""),
  time: formatLeadTime(lead.created_at),
  assignee: lead.assigned_sales_name || leadOwnerName(lead),
});

export default function AssignedLeads() {
  const dispatch = useDispatch();
  const leads = useSelector((store) => store.leads.leads);
  const [openLeadId, setOpenLeadId] = useState(null);

  const assignedLeads = useMemo(
    () =>
      (leads || [])
        .filter((lead) => ASSIGNED_STATUSES.includes(lead?.status))
        .map(toCard),
    [leads]
  );

  // Deleting an assigned lead moves it to Trash (restorable there).
  const handleDelete = (id) => dispatch(updateLead({ leadId: id, changes: { status: REJECTED_STATUS } }));

  return (
    <div>
      <Leadcategory
        leadsData={assignedLeads}
        onDelete={handleDelete}
        onSelect={(card) => setOpenLeadId(card.id)}
      />
      {openLeadId && (
        <LeadPipelinePanel leadId={openLeadId} onClose={() => setOpenLeadId(null)} />
      )}
    </div>
  )
}
