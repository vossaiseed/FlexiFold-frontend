import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Landingpage from '../pages/public/Landingpage'
import Register from '../components/landing/Register'
import Login from '../components/landing/Login'
import AdminLayout from '../Layout/AdminLayout'
import OverView from '../pages/admin/OverView'
import AssignedLeads from '../pages/admin/AssignedLeads'
import PendingReviewSection from '../components/admin/PendingReview/PendingReviewSection'
import ConversionRequestsSection from '../pages/admin/ConversionRequestsSection'
import PartnerDashboard from '../pages/admin/PartnerSection'
import PartnerDetails from '../components/admin/Partner/PartnerDetails'
import LeadMangerSection from '../pages/admin/LeadMangerSection'
import AddLeadForm from '../components/leads/AddLeadForm'
import SaleTeam from '../pages/admin/SaleTeam'
import GeneralLeads from '../pages/admin/GeneralLeads'
import Trash from '../pages/admin/Trash'
import Settings from '../pages/admin/Settings'
import LeadPool from '../pages/admin/LeadPool'
import PartnerLayout from '../Layout/PartnerLayout'
import DashboardSection from '../components/partner/sections/DashboardSection'
import LeadsSection from '../components/partner/sections/LeadsSection'
import EarningsSection from '../components/partner/sections/EarningsSection'
import WithdrawalsSection from '../components/partner/sections/WithdrawalsSection'
import NotificationsSection from '../components/partner/sections/NotificationsSection'
import TrashSection from '../components/partner/sections/TrashSection'
import ProfileSection from '../components/partner/sections/ProfileSection'
import TellecallerLayout from '../Layout/TellecallerLayout'
import TCDashboardSection from '../components/telecaller/sections/DashboardSection'
import TCLeadsSection from '../components/telecaller/sections/LeadsSection'
import TCCallLogsSection from '../components/telecaller/sections/CallLogsSection'
import TCFollowUpsSection from '../components/telecaller/sections/FollowUpsSection'
import TCNotificationsSection from '../components/telecaller/sections/NotificationsSection'
import TCProfileSection from '../components/telecaller/sections/ProfileSection'
import LMSection from '../pages/LeadMangerDashborad/LMSection'
import LeadManagerDashboard from '../pages/LeadMangerDashborad/LMDashboard'
import LMSalesTeam from '../pages/LeadMangerDashborad/LMSalesTeam'
import LMAlerts from '../pages/LeadMangerDashborad/LMAlerts'
import LMDashLayout from '../Layout/LMDashLayout'
import Leadcategory from '../components/admin/AssignedLeads/Leadcategory'
import ProtectedRoute from './ProtectedRoute'


export default function AppRoutes() {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Landingpage/>} />
            <Route path="/register" element={<Register/>} />
              <Route path="/login" element={<Login/>} />

              {/* Admin area — admins only */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin" element={<AdminLayout/>}>
                  <Route path="dashboard" element={<OverView />} />
                  <Route path="pending-review" element={<PendingReviewSection />} />
                  <Route path="conversion-requests" element={<ConversionRequestsSection />} />
                  <Route path="assigned-leads" element={<AssignedLeads />} />
                  <Route path="partners" element={<PartnerDashboard />} />
                  <Route path="lead-managers" element={<LeadMangerSection />} />
                  <Route path="sales-team" element={<SaleTeam />} />
                  <Route path="general-leads" element={<GeneralLeads />} />
                  <Route path="trash" element={<Trash />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="lead-pool" element={<LeadPool />} />
                </Route>
                {/* Standalone Partner Details page — outside AdminLayout so it opens as its own full page (no dashboard chrome) */}
                <Route path="/admin/partners/:id" element={<PartnerDetails />} />
                {/* Standalone Add Lead form page */}
                <Route path="/admin/leads/add" element={<AddLeadForm />} />
              </Route>

              {/* Partner dashboard — partners only; own layout/sidebar */}
              <Route element={<ProtectedRoute allowedRoles={["partner"]} />}>
                <Route path="/partner" element={<PartnerLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardSection />} />
                  <Route path="leads" element={<LeadsSection />} />
                  <Route path="earnings" element={<EarningsSection />} />
                  <Route path="withdrawals" element={<WithdrawalsSection />} />
                  <Route path="notifications" element={<NotificationsSection />} />
                  <Route path="trash" element={<TrashSection />} />
                  <Route path="profile" element={<ProfileSection />} />
                </Route>
              </Route>

              {/* Telecaller dashboard — telecallers only; own layout/sidebar */}
              <Route element={<ProtectedRoute allowedRoles={["telecaller"]} />}>
                <Route path="/telecaller" element={<TellecallerLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<TCDashboardSection />} />
                  <Route path="leads" element={<TCLeadsSection />} />
                  <Route path="call-logs" element={<TCCallLogsSection />} />
                  <Route path="follow-ups" element={<TCFollowUpsSection />} />
                  <Route path="notifications" element={<TCNotificationsSection />} />
                  <Route path="profile" element={<TCProfileSection />} />
                </Route>
              </Route>

              {/* Lead Manager area — lead managers only; own sidebar/chrome */}
              <Route element={<ProtectedRoute allowedRoles={["lead-manager"]} />}>
                <Route path="/lead-manager" element={<LMDashLayout />} >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<LeadManagerDashboard />} />
                  <Route path="leads" element={<Leadcategory />} />
                  <Route path="sales-team" element={<LMSalesTeam />} />
                  <Route path="alerts" element={<LMAlerts />} />
                </Route>
              </Route>
        </Routes>
    </div>
  )
}
