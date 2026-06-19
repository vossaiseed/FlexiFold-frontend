import { useSelector } from "react-redux";
import { selectConversions } from "../../../redux/features/conversions/conversionsSlice";
import { selectAllPartners } from "../../../redux/features/partners/partnersSlice";

const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #f1f5f9",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  padding: "20px",
};

const norm = (s) => (s || "").trim().toLowerCase();
const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const DEFAULT_RATE = 10; // % when a partner has no commission rate set

export default function RevenueRoyaltyCards() {
  const conversions = useSelector(selectConversions) || [];
  const leads = useSelector((s) => s.leads.leads) || [];
  const partners = useSelector(selectAllPartners) || [];

  const leadById = {};
  leads.forEach((l) => { leadById[l.id] = l; });

  // Commission rate for the partner who owns a given lead.
  const rateForLead = (lead) => {
    if (!lead) return DEFAULT_RATE;
    const p = partners.find(
      (p) =>
        (lead.partner_id && p.id === lead.partner_id) ||
        (lead.partner_name && norm(p.name) === norm(lead.partner_name))
    );
    return p?.commission_rate != null ? Number(p.commission_rate) : DEFAULT_RATE;
  };

  const approved = conversions.filter((c) => c.status === "Approved");
  // Revenue = total approved conversion amount.
  const revenue = approved.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  // Royalty = each conversion's amount × that partner's commission rate.
  const royalty = approved.reduce((sum, c) => {
    const amount = Number(c.amount) || 0;
    return sum + (amount * rateForLead(leadById[c.lead_id])) / 100;
  }, 0);

  const cards = [
    { label: "Total Revenue", value: inr(revenue) },
    { label: "Total Royalty Paid", value: inr(Math.round(royalty)) },
  ];

  return (
    <>
      {cards.map((s) => (
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
