export default function RevenueRoyaltyCards() {
const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #f1f5f9",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  padding: "20px",
};
  return (
    <>
      {[
        { label: "Total Revenue",    value: "₹0" },
        { label: "Total Royalty Paid", value: "₹0" },
      ].map((s) => (
        <div key={s.label} className="col-span-1 lg:col-span-2" style={cardStyle}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            {s.label}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#ea580c" }}>{s.value}</div>
        </div>
      ))}
    </>
  );
}