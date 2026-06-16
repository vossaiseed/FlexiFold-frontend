export default function PendingReviewCard() {
    const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #f1f5f9",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  padding: "20px",
};
  return (
    <div className="col-span-1 lg:col-span-2" style={cardStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 16 }}>📋</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1f2937" }}>Pending Review</span>
      </div>
      <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>All caught up!</p>
    </div>
  );
}