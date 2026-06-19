import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SaleTeamCard from "../../components/admin/SalesTeam/SaleTeamCard";
import AddSalesStaff from "../../components/admin/SalesTeam/AddSalesStaff";
import {
  fetchSalesTeam,
  deleteSalesStaff,
  selectSalesTeam,
  selectSalesTeamLoading,
  selectSalesTeamError,
} from "../../redux/features/salesTeam/salesTeamSlice";
import { fetchLeads } from "../../redux/features/leads/leadsSlice";

export default function SaleTeam() {
  const dispatch = useDispatch();
  const staff = useSelector(selectSalesTeam);
  const loading = useSelector(selectSalesTeamLoading);
  const error = useSelector(selectSalesTeamError);

  const [showAddStaff, setShowAddStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Load the sales team + leads (leads drive each card's Leads/Converted counts).
  useEffect(() => {
    dispatch(fetchSalesTeam());
    dispatch(fetchLeads());
  }, [dispatch]);

  const handleDelete = (member) => {
    if (window.confirm(`Delete sales member "${member.name}"? This cannot be undone.`)) {
      dispatch(deleteSalesStaff(member.id));
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-8xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => { setSelectedStaff(null); setShowAddStaff(true); }}
            className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-green-200 transition hover:bg-green-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Sales
          </button>
        </div>

        {showAddStaff && (
          <AddSalesStaff
            staff={selectedStaff}
            onClose={() => { setShowAddStaff(false); setSelectedStaff(null); }}
          />
        )}

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading (initial) */}
        {loading && staff.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-500">Loading sales team…</p>
        )}

        {/* Empty */}
        {!loading && !error && staff.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-500">
            No sales members yet. Click “Add Sales” to create one.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {staff.map((member) => (
            <SaleTeamCard
              key={member.id}
              partner={member}
              onEdit={() => { setSelectedStaff(member); setShowAddStaff(true); }}
              onDelete={() => handleDelete(member)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
