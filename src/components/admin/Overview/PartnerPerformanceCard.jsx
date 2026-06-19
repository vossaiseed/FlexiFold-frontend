import { useSelector } from "react-redux";
import { selectAllPartners } from "../../../redux/features/partners/partnersSlice";
import { selectConversions } from "../../../redux/features/conversions/conversionsSlice";

const AVATAR_COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#f97316", "#06b6d4"];
const norm = (s) => (s || "").trim().toLowerCase();
const DEFAULT_RATE = 10; // % — used when a partner has no commission rate set

function getAvatarColor(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function getInitial(name = "") {
  return name.trim()?.[0]?.toUpperCase() || "?";
}

export default function PartnerPerformanceCard() {
  const partnerRows = useSelector(selectAllPartners);
  const allLeads = useSelector((s) => s.leads.leads) || [];
  const conversions = useSelector(selectConversions) || [];

  // Earnings = approved conversion amounts for this partner's leads;
  // royalty = earnings × the partner's commission rate. Mirrors PartnerCard.
  const partners = (partnerRows || []).map((p) => {
    const myLeadIds = new Set(
      allLeads
        .filter(
          (l) =>
            (l.partner_id && l.partner_id === p.id) ||
            (p.name && norm(l.partner_name) === norm(p.name))
        )
        .map((l) => l.id)
    );
    const earnings = conversions
      .filter((c) => myLeadIds.has(c.lead_id) && c.status === "Approved")
      .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
    const rate = p.commission_rate != null ? Number(p.commission_rate) : DEFAULT_RATE;
    return {
      name: p.name || "Partner",
      earnings,
      royalty: Math.round((earnings * rate) / 100),
    };
  });

  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 text-[13px] font-bold text-gray-800">Partner Performance</div>

      {partners.length === 0 ? (
        <p className="m-0 text-[13px] text-gray-400">No partners yet.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
          {partners.map((p, i) => {
            const bg = getAvatarColor(p.name);
            return (
              <div
                key={`${p.name}-${i}`}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-gray-50 px-3.5 py-3"
              >
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: bg }}
                >
                  {getInitial(p.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-gray-800">{p.name}</div>
                  <div className="mt-0.5 text-[11px] text-gray-400">₹{Number(p.earnings).toLocaleString("en-IN")}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-[13px] font-bold text-orange-600">₹{Number(p.royalty).toLocaleString("en-IN")}</div>
                  <div className="text-[11px] text-gray-400">royalty</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
