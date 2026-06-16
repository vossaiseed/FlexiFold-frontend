import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PartnerProfile from "./PartnerDetails/PartnerProfile";
import PartnerOverview from "./PartnerDetails/PartnerOverview";
import PartnerLeads from "./PartnerDetails/PartnerLeads";

export default function PartnerDetails() {
  const navigate = useNavigate();

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

        {/* Section 1 — Profile + Stats */}
        <PartnerProfile />

        {/* Section 2 — Quick Voice Action + Recent Updates */}
        <PartnerOverview />

        {/* Section 3 — Leads search, filters & list */}
        <PartnerLeads />
      </div>
    </main>
  );
}
