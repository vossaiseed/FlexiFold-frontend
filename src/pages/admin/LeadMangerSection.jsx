import React, { useState } from 'react'
import LeadMangerCard from '../../components/admin/LeadManger/LeadMangerCard';
import AddLeadManager from '../../components/admin/LeadManger/AddLeadManager';

export default function LeadMangerSection() {
  const [showAddManager, setShowAddManager] = useState(false);
  const [editingManager, setEditingManager] = useState(null);

  const closeModal = () => {
    setShowAddManager(false);
    setEditingManager(null);
  };

  return (
    <div>
          <div className="mb-6  mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        {/* <div>
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-1">Team Section</p>
          <h2 className="text-2xl font-bold text-slate-900">Lead Manager</h2>
        </div> */}
        <button
          onClick={() => { setEditingManager(null); setShowAddManager(true); }}
          className="flex w-full items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm sm:w-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Manager
        </button>
      </div>
      <LeadMangerCard onEdit={(manager) => { setEditingManager(manager); setShowAddManager(true); }} />

      {showAddManager && <AddLeadManager manager={editingManager} onClose={closeModal} />}
    </div>
  )
}
