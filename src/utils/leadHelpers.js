// Shared helpers for working with lead records coming from the backend.
// Supabase rows use `id`; we tolerate a legacy `_id` just in case.

export const getLeadId = (lead) => lead?.id ?? lead?._id;

// Leads waiting for an admin decision in the Pending Review queue.
export const PENDING_STATUSES = ["New", "Pending"];

// Approved / active leads shown in the Assigned Leads section.
export const ASSIGNED_STATUSES = ["Discussion", "Follow-up", "In Progress", "Converted", "Failed"];

// Rejected leads live in Trash.
export const REJECTED_STATUS = "Rejected";

export const isPending = (lead) => PENDING_STATUSES.includes(lead?.status);

// A lead is "converted" once its status is Converted (admin approves a
// conversion) — or its computed effectiveStatus is Converted (telecaller view).
// Site Visit / Measurement / Model steps only unlock after this point.
export const isConverted = (lead) =>
  lead?.status === "Converted" || lead?.effectiveStatus === "Converted";

// Date + time, e.g. "16 Jun 2026, 10:07 am"
export const formatLeadTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// Date only, e.g. "16 Jun 2026"
export const formatLeadDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

// True when the timestamp falls on the current calendar day (local time).
export const isToday = (value) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

// Resolve a human owner/partner name from the derived fields the API adds.
export const leadOwnerName = (lead) =>
  lead?.assigned_name || lead?.partner_name || lead?.partner || "Unassigned";
