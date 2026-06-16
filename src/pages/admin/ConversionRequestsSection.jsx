import React, { useState } from "react";
import ConversionStats from "../../components/admin/ConversionRequests/ConversionStats";
import ConversionRequestsTable from "../../components/admin/ConversionRequests/ConversionRequestsTable";
import ConversionDetails from "../../components/admin/ConversionRequests/ConversionDetails";

export default function ConversionRequestsSection() {
  const [selectedConversion, setSelectedConversion] = useState(null);

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-8xl flex-col gap-8">
        <ConversionStats />
        <ConversionRequestsTable onView={setSelectedConversion} />
        {selectedConversion && (
          <ConversionDetails
            conversion={selectedConversion}
            onBack={() => setSelectedConversion(null)}
            onApprove={() => {
              setSelectedConversion(null);
            }}
            onReject={() => {
              setSelectedConversion(null);
            }}
          />
        )}
      </div>
    </main>
  );
}
