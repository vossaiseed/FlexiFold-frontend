import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import LMSidebar from '../components/common/Sidebars/LMSidebar'
import AddLead from '../components/admin/Partner/PartnerDetails/AddLead'
import UserMenu from '../components/common/UserMenu'

const sectionTitles = {
  dashboard: 'Overview',
  leads: 'Leads',
  'sales-team': 'Sales Team',
  alerts: 'Alerts',
}

export default function LMDashLayout() {
  const { pathname } = useLocation()
  const segment = pathname.split('/').filter(Boolean).pop()
  const title = sectionTitles[segment] || 'Overview'
  const [showAddLead, setShowAddLead] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <LMSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <span className="text-base font-bold text-slate-900">{title}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddLead(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-600"
            >
              <Plus className="h-4 w-4" /> Add Lead
            </button>
            <UserMenu name="Admin" role="Lead Manager" email="admin@flexifold.com" initial="LM" />
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-5 sm:px-6">
          <Outlet />
        </main>
      </div>

      {showAddLead && <AddLead onClose={() => setShowAddLead(false)} />}
    </div>
  )
}
