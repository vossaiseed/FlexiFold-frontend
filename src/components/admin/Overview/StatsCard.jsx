import React from 'react'

export default function OverviewCard() {
    const card = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #f1f5f9",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  padding: "20px 20px",
};

const statCards = [
  { label: "Total Users", value: "1,234", color: "#3b82f6" },
  { label: "Active Subscriptions", value: "567", color: "#10b981" },
  { label: "Monthly Revenue", value: "$12.3K", color: "#f59e0b" },
  { label: "Churn Rate", value: "2.5%", color: "#ef4444" },
];const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #f1f5f9",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  padding: "20px",
};
 
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