import React from "react";
import PendingReviewStats from "./PendingReviewStats";
import ApprovalRequests from "./ApprovalRequests";
import PendingReviewTable from "./PendingReviewTable";

export default function PendingReviewSection() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-8xl flex-col gap-8">
        <PendingReviewStats />
        <ApprovalRequests />
        <PendingReviewTable />
      </div>
    </main>
  );
}
