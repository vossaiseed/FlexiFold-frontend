import api from "../redux/services/api";
import { ASSIGNED_STATUSES, PENDING_STATUSES } from "./leadHelpers";

// Upload files/images to Supabase Storage via the backend; returns public URLs.
export async function uploadFiles(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return [];
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  // Let the browser set multipart/form-data WITH the boundary (don't override).
  const { data } = await api.post("/upload", form);
  return data?.data?.urls || [];
}

export const normalizePhone = (p) => String(p ?? "").replace(/\D/g, "");

// Match the logged-in user to their project_managers row (by phone, email, or name).
export function findMyPm(projectManagers, user) {
  const phone = normalizePhone(user?.user_metadata?.phoneNumber);
  const email = (user?.email || "").toLowerCase();
  const name = (user?.user_metadata?.name || "").trim().toLowerCase();
  return (
    (projectManagers || []).find(
      (p) =>
        (phone && normalizePhone(p.phone) === phone) ||
        (email && (p.email || "").toLowerCase() === email) ||
        (name && (p.name || "").trim().toLowerCase() === name)
    ) || null
  );
}

export const PROJECT_STATUSES = ["Pending", "In Progress", "Completed", "On Hold"];
export const SITE_VISIT_STATUSES = ["Scheduled", "Completed", "Cancelled", "Rescheduled"];

// A measurement/model is awaiting PM verification when it's freshly uploaded.
// Treat a missing status as pending too (tolerates rows created without a
// default), so sales-team uploads always reach the PM queue.
export const isPendingVerification = (item) =>
  !item?.status || item.status === "Uploaded" || item.status === "Pending";

// Per-task fulfilment status for a lead. States:
//   Pending   - nothing yet
//   Scheduled - a site visit exists but isn't marked Completed
//   Uploaded  - measurement/model uploaded, awaiting PM verification
//   Completed - site visit Completed, or measurement/model Verified (Approved)
//   Rejected  - all uploads were rejected by the PM
export function leadTaskStatuses({ siteVisits = [], measurements = [], models = [] }) {
  const siteVisit = siteVisits.some((v) => v.status === "Completed")
    ? "Completed"
    : siteVisits.length ? "Scheduled" : "Pending";
  const verifyState = (arr) => {
    if (!arr.length) return "Pending";
    if (arr.some((x) => x.status === "Approved")) return "Completed";
    if (arr.some((x) => isPendingVerification(x))) return "Uploaded";
    return "Rejected";
  };
  return { siteVisit, measurement: verifyState(measurements), model: verifyState(models) };
}

// Compute the full lifecycle timeline for a lead from its related records.
// ctx: { siteVisits, measurements, models, project } already filtered to the lead.
export function computeStages(lead, ctx = {}) {
  const status = lead?.status;
  const { siteVisits = [], measurements = [], models = [], project = null } = ctx;

  const approved = !!status && !PENDING_STATUSES.includes(status) && status !== "Rejected";
  const assigned = ASSIGNED_STATUSES.includes(status);
  // assigned_to is auto-set at lead creation for partner leads, so it is NOT a
  // sales-assignment signal — use the dedicated sales fields only.
  const salesAssigned = !!(lead?.assigned_sales_id || lead?.assigned_sales_name);
  const hasSiteVisit = siteVisits.length > 0;
  const hasMeasurement = measurements.length > 0;
  const hasModel = models.length > 0;
  const pmAssigned = !!project?.project_manager_id;
  const inProgress = project?.status === "In Progress" || project?.status === "Completed";
  const completed = project?.status === "Completed";

  return [
    { key: "pending", label: "Pending Review", done: approved },
    { key: "approved", label: "Approved", done: approved },
    { key: "assigned", label: "Assigned Lead", done: assigned || salesAssigned },
    { key: "sales", label: "Sales Team Assigned", done: salesAssigned },
    { key: "visit", label: "Site Visit", done: hasSiteVisit },
    { key: "measurement", label: "Measurement Uploaded", done: hasMeasurement },
    { key: "model", label: "Model Uploaded", done: hasModel },
    { key: "pm", label: "Project Manager Assigned", done: pmAssigned },
    { key: "inprogress", label: "In Progress", done: inProgress },
    { key: "completed", label: "Completed", done: completed },
  ];
}

// Index of the first not-yet-done stage (the "current" stage).
export function currentStageIndex(stages) {
  const i = stages.findIndex((s) => !s.done);
  return i === -1 ? stages.length - 1 : i;
}
