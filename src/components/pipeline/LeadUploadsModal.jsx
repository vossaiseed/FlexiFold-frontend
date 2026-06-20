import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";
import { fetchSiteVisits } from "../../redux/features/siteVisits/siteVisitsSlice";
import { fetchMeasurements } from "../../redux/features/measurements/measurementsSlice";
import { fetchModels } from "../../redux/features/models/modelsSlice";
import LeadTaskProgress from "./LeadTaskProgress";
import SiteVisitForm from "./SiteVisitForm";
import MeasurementModelUploader from "./MeasurementModelUploader";
import SaleDetailsForm from "./SaleDetailsForm";
import AssignProjectManager from "./AssignProjectManager";

// Per-lead uploads popup: Site Visit, Measurement, Model + PM assignment.
// Opened from a lead card so uploads live where the lead does.
export default function LeadUploadsModal({ leadId, leadName, location, onClose }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSiteVisits());
    dispatch(fetchMeasurements());
    dispatch(fetchModels());
  }, [dispatch]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-2 sm:p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Site Visit · Measurement · Model</p>
            <h2 className="truncate text-lg font-semibold text-slate-900">{leadName}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <LeadTaskProgress leadId={leadId} />
          <SiteVisitForm leadId={leadId} defaultLocation={location} />
          <MeasurementModelUploader leadId={leadId} />
          <SaleDetailsForm leadId={leadId} />
          <AssignProjectManager leadId={leadId} />
        </div>
      </div>
    </div>
  );
}
