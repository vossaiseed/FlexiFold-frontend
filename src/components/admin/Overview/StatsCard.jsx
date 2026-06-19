import React from 'react'
import { useSelector } from 'react-redux'
import { selectConversions } from '../../../redux/features/conversions/conversionsSlice'
import { PENDING_STATUSES } from '../../../utils/leadHelpers'

const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #f1f5f9",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  padding: "20px",
};

export default function StatsCard() {
  const leads = useSelector((s) => s.leads.leads);
  const conversions = useSelector(selectConversions);

  const converted = (leads || []).filter((l) => l?.status === "Converted").length;
  const pendingReview = (leads || []).filter((l) => PENDING_STATUSES.includes(l?.status)).length;

  const statCards = [
    { label: "Total Leads", value: (leads || []).length, color: "#1f2937" },
    { label: "Converted", value: converted, color: "#10b981" },
    { label: "Pending Review", value: pendingReview, color: "#ea580c" },
    { label: "Conv. Requests", value: (conversions || []).length, color: "#8b5cf6" },
  ];

  return (
    <>
      {statCards.map((s) => (
        <div key={s.label} style={cardStyle}>
          <div style={{ fontSize: 32, fontWeight: 700, color: s.color, marginBottom: 6 }}>
            {s.value}
          </div>
          <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>{s.label}</div>
        </div>
      ))}
    </>
  );
}
