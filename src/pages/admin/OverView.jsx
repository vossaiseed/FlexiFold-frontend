import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import StatsCard from '../../components/admin/Overview/StatsCard'
import RevenueRoyaltyCards from '../../components/admin/Overview/RevenueRoyaltyCards'
import PendingReviewCard from '../../components/admin/Overview/PendingReviewCard'
import HotLeadsCard from '../../components/admin/Overview/HotLeadCard'
import ConversionRequestsCard from '../../components/admin/Overview/ConversionRequestsCard'
import SalesCapacityCard from '../../components/admin/Overview/SalesCapacityCard'
import PartnerPerformanceCard from '../../components/admin/Overview/PartnerPerformanceCard'
import LeadTrendChart from '../../components/admin/Overview/LeadTrendChart'
import LeadStatusCard from '../../components/admin/Overview/LeadStatusCard'
import { fetchLeads } from '../../redux/features/leads/leadsSlice'
import { fetchPartners } from '../../redux/features/partners/partnersSlice'
import { fetchSalesTeam } from '../../redux/features/salesTeam/salesTeamSlice'
import { fetchLeadManagers } from '../../redux/features/leadManagers/leadManagersSlice'
import { fetchConversions } from '../../redux/features/conversions/conversionsSlice'


export default function OverView() {
  const dispatch = useDispatch();

  // Load everything the dashboard cards summarise.
  useEffect(() => {
    dispatch(fetchLeads());
    dispatch(fetchPartners());
    dispatch(fetchSalesTeam());
    dispatch(fetchLeadManagers());
    dispatch(fetchConversions());
  }, [dispatch]);

  return (
    <div className="min-h-full overflow-y-auto p-4 pb-10 scroll-smooth sm:p-5" style={{ background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style  >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard />
        <RevenueRoyaltyCards />
        <PendingReviewCard />
        <HotLeadsCard />
        <ConversionRequestsCard />
        <SalesCapacityCard />
        <PartnerPerformanceCard />
        <LeadTrendChart />
        <LeadStatusCard />
      </div>
    </div>
  )
}

