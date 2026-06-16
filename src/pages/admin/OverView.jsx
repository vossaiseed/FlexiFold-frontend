import React from 'react'
import StatsCard from '../../components/admin/Overview/StatsCard'
import RevenueRoyaltyCards from '../../components/admin/Overview/RevenueRoyaltyCards'
import PendingReviewCard from '../../components/admin/Overview/PendingReviewCard'
import HotLeadsCard from '../../components/admin/Overview/HotLeadCard'
import ConversionRequestsCard from '../../components/admin/Overview/ConversionRequestsCard'
import SalesCapacityCard from '../../components/admin/Overview/SalesCapacityCard'
import PartnerPerformanceCard from '../../components/admin/Overview/PartnerPerformanceCard'
import LeadTrendChart from '../../components/admin/Overview/LeadTrendChart'
import LeadStatusCard from '../../components/admin/Overview/LeadStatusCard'


export default function OverView() {

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

