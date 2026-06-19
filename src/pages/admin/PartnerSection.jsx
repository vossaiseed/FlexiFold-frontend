import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PartnerCard from "../../components/admin/Partner/PartnerCard";
import Addpartner from "../../components/admin/Partner/Addpartner";
import {
  fetchPartners,
  selectAllPartners,
  selectPartnersLoading,
  selectPartnersError,
} from "../../redux/features/partners/partnersSlice";
import { fetchLeads } from "../../redux/features/leads/leadsSlice";
import { fetchConversions } from "../../redux/features/conversions/conversionsSlice";

export default function PartnerSection() {
  const dispatch = useDispatch();
  const partners = useSelector(selectAllPartners);
  const isLoading = useSelector(selectPartnersLoading);
  const error = useSelector(selectPartnersError);

  const [showAddPartner, setShowAddPartner] = React.useState(false);
  const [selectedPartner, setSelectedPartner] = React.useState(null);

  // Load partners + leads + conversions (the latter two drive each card's
  // Sales/Royalty figures).
  useEffect(() => {
    dispatch(fetchPartners());
    dispatch(fetchLeads());
    dispatch(fetchConversions());
  }, [dispatch]);

  const closeModal = () => {
    setShowAddPartner(false);
    setSelectedPartner(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-8xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          <button onClick={() => setShowAddPartner(true)} className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-green-200 transition hover:bg-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Partner
          </button>
        </div>

        {showAddPartner && (
          <Addpartner
            mode={selectedPartner ? "edit" : "add"}
            partner={selectedPartner}
            onClose={closeModal}
          />
        )}

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading (initial) */}
        {isLoading && partners.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-500">Loading partners…</p>
        )}

        {/* Empty */}
        {!isLoading && !error && partners.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-500">
            No partners yet. Click “Add Partner” to create one.
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {partners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              setSelectedPartner={setSelectedPartner}
              setShowAddPartner={setShowAddPartner}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
