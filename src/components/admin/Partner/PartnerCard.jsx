import { Eye, EyeOff } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deletePartner, resetPartnerPassword } from "../../../redux/features/partners/partnersSlice";
import { selectConversions } from "../../../redux/features/conversions/conversionsSlice";
import ResetPasswordModal from "../../common/ResetPasswordModal";

const norm = (s) => (s || "").trim().toLowerCase();
const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const DEFAULT_RATE = 10; // % — used when a partner has no commission rate set

export default function PartnerCard({ setSelectedPartner, setShowAddPartner, partner }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showReset, setShowReset] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allLeads = useSelector((s) => s.leads.leads) || [];
  const conversions = useSelector(selectConversions) || [];
  const openDetails = () => navigate(`/admin/partners/${partner.id}`);

  // Derive display values from the backend partner row.
  const initials = partner.name?.charAt(0)?.toUpperCase() || "?";
  const company = partner.companyname || "—";
  const location = partner.city || "—";
  const status = partner.role || "partner";
  const password = partner.password || "";

  // Leads brought in by this partner (matched by partner-table id or the
  // resolved partner_name), then revenue = their approved conversion amounts.
  const myLeadIds = new Set(
    allLeads
      .filter(
        (l) =>
          (l.partner_id && l.partner_id === partner.id) ||
          (partner.name && norm(l.partner_name) === norm(partner.name))
      )
      .map((l) => l.id)
  );
  const salesValue = conversions
    .filter((c) => myLeadIds.has(c.lead_id) && c.status === "Approved")
    .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const rate = partner.commission_rate != null ? Number(partner.commission_rate) : DEFAULT_RATE;
  const sales = inr(salesValue);
  const royalty = inr(Math.round((salesValue * rate) / 100));

  const handleDelete = () => {
    if (window.confirm(`Delete partner "${partner.name}"? This cannot be undone.`)) {
      dispatch(deletePartner(partner.id));
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
      <button type="button" onClick={openDetails} className="block w-full cursor-pointer bg-slate-50 px-3 py-3 text-left transition hover:bg-slate-100">
        <div key={partner.id} className="flex items-start gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-emerald-100 text-base font-bold text-emerald-700">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-950">{partner.name}</h2>
            <div className="mt-1 text-xs text-slate-500 space-y-0.5">
              <p>{partner.phone}</p>
              <p>{partner.email}</p>
            </div>
          </div>
        </div>
      </button>

      <div className="px-3 py-3">
        <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-900">{company}</p>
            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              <span className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-slate-100 text-slate-500">•</span>
              {location}
            </p>
          </div>
          <div className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">
            {status}
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 px-2.5 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Sales</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{sales}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-2.5 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Royalty ({rate}%)</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{royalty}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-2.5 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Pwd</p>
            <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-950">
              <span>{showPassword ? (password || "—") : (password ? password.replace(/./g, "•") : "—")}</span>
              <button onClick={() => setShowPassword(!showPassword)} type="button" className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
                <span className="sr-only">Show password</span>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-3 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            <button onClick={() => {setSelectedPartner(partner),setShowAddPartner(true)}} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-50">Edit</button>
            <button onClick={openDetails} className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700 transition hover:bg-violet-100">View</button>
            <button className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 transition hover:bg-amber-100">Upgrade</button>
            <button className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-700 transition hover:bg-red-100">Deactivate</button>
            <button onClick={() => setShowReset(true)} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-50">Reset</button>
          </div>
          <button onClick={handleDelete} className="rounded-full border border-red-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-red-600 transition hover:bg-red-50">Delete</button>
        </div>
      </div>

      <ResetPasswordModal
        open={showReset}
        onClose={() => setShowReset(false)}
        name={partner.name}
        onSubmit={(password) =>
          dispatch(resetPartnerPassword({ partnerId: partner.id, password })).unwrap()
        }
      />
    </div>
  );
}
