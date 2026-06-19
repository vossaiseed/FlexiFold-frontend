const norm = (s) => (s || "").trim().toLowerCase();

// True when a lead belongs to a given sales-staff member. A lead's assigned_to
// may hold the salesstaff row id (admin "Change") or an Auth id, but its
// resolved assigned_name matches the staff name either way — so match on both.
export const isLeadOfStaff = (lead, staff) =>
  !!staff &&
  (((lead?.assigned_to && lead.assigned_to === staff.id)) ||
    (staff.name && norm(lead?.assigned_name) === norm(staff.name)));

// All leads belonging to a staff member.
export const leadsForStaff = (leads, staff) =>
  (leads || []).filter((l) => isLeadOfStaff(l, staff));
