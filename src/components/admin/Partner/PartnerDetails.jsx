import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import PartnerProfile from "./PartnerDetails/PartnerProfile";
import PartnerOverview from "./PartnerDetails/PartnerOverview";
import PartnerLeads from "./PartnerDetails/PartnerLeads";
import {
  fetchPartnerById,
  fetchPartnerLeads,
  clearSelectedPartner,
  selectSelectedPartner,
  selectPartnerLeads,
  selectPartnersLoading,
  selectPartnersError,
} from "../../../redux/features/partners/partnersSlice";

export default function PartnerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const partner = useSelector(selectSelectedPartner);
  const leads = useSelector(selectPartnerLeads);
  const isLoading = useSelector(selectPartnersLoading);
  const error = useSelector(selectPartnersError);

  // Load this partner + their leads; clear on unmount so the next partner
  // doesn't briefly show stale data.
  useEffect(() => {
    if (id) {
      dispatch(fetchPartnerById(id));
      dispatch(fetchPartnerLeads(id));
    }
    return () => dispatch(clearSelectedPartner());
  }, [dispatch, id]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl space-y-4">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Partners
        </button>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading && !partner ? (
          <p className="py-12 text-center text-sm text-slate-500">Loading partner…</p>
        ) : !partner ? (
          <p className="py-12 text-center text-sm text-slate-500">Partner not found.</p>
        ) : (
          <>
            {/* Section 1 — Profile + Stats */}
            <PartnerProfile partner={partner} leads={leads} />

            {/* Section 2 — Quick Voice Action + Recent Updates */}
            <PartnerOverview leads={leads} />

            {/* Section 3 — Leads search, filters & list */}
            <PartnerLeads leads={leads} partnerId={id} />
          </>
        )}
      </div>
    </main>
  );
}
