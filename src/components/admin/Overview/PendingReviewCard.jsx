import { useSelector } from "react-redux";
import { PENDING_STATUSES } from "../../../utils/leadHelpers";

const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #f1f5f9",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  padding: "20px",
};

export default function PendingReviewCard() {
  const leads = useSelector((s) => s.leads.leads);
  const pending = (leads || []).filter((l) => PENDING_STATUSES.includes(l?.status));

  return (
    <div className="col-span-1 lg:col-span-2" style={cardStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 16 }}>📋</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1f2937" }}>Pending Review</span>
        {pending.length > 0 && (
          <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: "#ea580c", background: "#fff7ed", borderRadius: 999, padding: "2px 10px" }}>
            {pending.length}
          </span>
        )}
      </div>
      {pending.length === 0 ? (
        <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>All caught up!</p>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
          {pending.slice(0, 3).map((l) => (
            <li key={l.id} style={{ fontSize: 13, color: "#475569", display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.name}</span>
              <span style={{ color: "#9ca3af" }}>{l.status}</span>
            </li>
          ))}
          {pending.length > 3 && (
            <li style={{ fontSize: 12, color: "#9ca3af" }}>+{pending.length - 3} more</li>
          )}
        </ul>
      )}
    </div>
  );
}
