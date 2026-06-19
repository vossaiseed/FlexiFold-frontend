import { Eye, EyeOff, Mail, Pencil, KeyRound, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetSalesStaffPassword } from "../../../redux/features/salesTeam/salesTeamSlice";
import ResetPasswordModal from "../../common/ResetPasswordModal";

const norm = (s) => (s || "").trim().toLowerCase();

export default function SaleTeamCard({ partner, onEdit, onDelete }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showReset, setShowReset] = React.useState(false);
  const dispatch = useDispatch();
  const allLeads = useSelector((s) => s.leads.leads) || [];

  // Derive display values from the backend salesstaff row.
  const initials = partner.name?.charAt(0)?.toUpperCase() || "?";
  const password = partner.password || "";

  // Prefer the backend-computed counts (reliably bridge Auth id ↔ salesstaff
  // id); fall back to a client-side match for older data.
  const myLeads = allLeads.filter(
    (l) =>
      (l.assigned_to && l.assigned_to === partner.id) ||
      (partner.name && norm(l.assigned_name) === norm(partner.name))
  );
  const leads = partner.leads_count != null ? partner.leads_count : myLeads.length;
  const converted =
    partner.converted_count != null ? partner.converted_count : myLeads.filter((l) => l.status === "Converted").length;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 hover:border-teal-200 transition-colors p-4 flex flex-col gap-3">

      {/* Top — avatar + name */}
      <div className="flex items-center gap-2.5 text-left">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 bg-teal-100 text-teal-700">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{partner.name}</p>
          <p className="text-xs text-slate-400">{partner.phone}</p>
        </div>
      </div>

      {/* Email + role badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-xs text-slate-400 min-w-0">
          <Mail className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{partner.email}</span>
        </div>
        <span className="text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
          {partner.role || "Sales Staff"}
        </span>
      </div>

      {/* Stats — Leads / Converted / Pwd */}
      <div className="grid grid-cols-3 gap-1.5">
        <div className="rounded-xl bg-slate-50 px-2 py-2 text-center">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Leads</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">{leads}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-2 py-2 text-center">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Converted</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800">{converted}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-2 py-2 text-center">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Pwd</p>
          <div className="mt-0.5 flex items-center justify-center gap-1 text-sm font-semibold text-slate-800">
            <span>{showPassword ? (password || "—") : (password ? password.replace(/./g, "•") : "—")}</span>
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              className="rounded-full p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <span className="sr-only">Show password</span>
              {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onEdit}
          className="flex flex-col items-center gap-1 py-2 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
        >
          <Pencil className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-medium text-slate-500">Edit</span>
        </button>

        <button
          type="button"
          onClick={() => setShowReset(true)}
          className="flex flex-col items-center gap-1 py-2 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-colors"
        >
          <KeyRound className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-medium text-slate-500">Reset</span>
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="flex flex-col items-center gap-1 py-2 rounded-xl border border-slate-100 hover:border-red-200 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
          <span className="text-xs font-medium text-slate-500">Delete</span>
        </button>
      </div>

      <ResetPasswordModal
        open={showReset}
        onClose={() => setShowReset(false)}
        name={partner.name}
        onSubmit={(password) =>
          dispatch(resetSalesStaffPassword({ staffId: partner.id, password })).unwrap()
        }
      />
    </div>
  );
}
