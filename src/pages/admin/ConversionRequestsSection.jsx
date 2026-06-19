import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ConversionStats from "../../components/admin/ConversionRequests/ConversionStats";
import ConversionRequestsTable from "../../components/admin/ConversionRequests/ConversionRequestsTable";
import ConversionDetails from "../../components/admin/ConversionRequests/ConversionDetails";
import { fetchConversions, updateConversion } from "../../redux/features/conversions/conversionsSlice";
import { updateLead } from "../../redux/features/leads/leadsSlice";

export default function ConversionRequestsSection() {
  const dispatch = useDispatch();
  const [selectedConversion, setSelectedConversion] = useState(null);

  useEffect(() => {
    dispatch(fetchConversions());
  }, [dispatch]);

  // Approving a conversion request also marks the underlying lead "Converted".
  const decide = async (conversion, status) => {
    if (!conversion?.id) return;
    await dispatch(updateConversion({ id: conversion.id, changes: { status } }));
    if (status === "Approved" && conversion.lead_id) {
      dispatch(updateLead({ leadId: conversion.lead_id, changes: { status: "Converted" } }));
    }
    setSelectedConversion(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-8xl flex-col gap-8">
        <ConversionStats />
        <ConversionRequestsTable onView={setSelectedConversion} />
        {selectedConversion && (
          <ConversionDetails
            conversion={selectedConversion}
            onBack={() => setSelectedConversion(null)}
            onApprove={() => decide(selectedConversion, "Approved")}
            onReject={() => decide(selectedConversion, "Rejected")}
          />
        )}
      </div>
    </main>
  );
}
