import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ConversionStats from "../../components/admin/ConversionRequests/ConversionStats";
import ConversionRequestsTable from "../../components/admin/ConversionRequests/ConversionRequestsTable";
import ConversionDetails from "../../components/admin/ConversionRequests/ConversionDetails";
import { fetchConversions, updateConversion } from "../../redux/features/conversions/conversionsSlice";
import { fetchLeads, updateLead } from "../../redux/features/leads/leadsSlice";

export default function ConversionRequestsSection() {
  const dispatch = useDispatch();
  const [selectedConversion, setSelectedConversion] = useState(null);

  useEffect(() => {
    dispatch(fetchConversions());
    dispatch(fetchLeads()); // keep lead conversion_amount fresh for display
  }, [dispatch]);

  // Approving a conversion marks the lead "Converted" and assigns it to the
  // chosen Sales Team member (so it shows up on their dashboard for fulfilment).
  const decide = async (conversion, status, salesMember) => {
    if (!conversion?.id) return;
    await dispatch(updateConversion({ id: conversion.id, changes: { status } }));
    if (status === "Approved" && conversion.lead_id) {
      const changes = { status: "Converted" };
      if (salesMember) {
        changes.assigned_sales_id = String(salesMember.id ?? salesMember._id);
        changes.assigned_sales_name = salesMember.name;
      }
      dispatch(updateLead({ leadId: conversion.lead_id, changes }));
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
            onApprove={(member) => decide(selectedConversion, "Approved", member)}
            onReject={() => decide(selectedConversion, "Rejected")}
          />
        )}
      </div>
    </main>
  );
}
