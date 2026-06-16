import { Eye, EyeOff } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PartnerCard({ setSelectedPartner,setShowAddPartner, partner }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const openDetails = () => navigate(`/admin/partners/${partner.id}`);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
      <button type="button" onClick={openDetails} className="block w-full cursor-pointer bg-slate-50 px-3 py-3 text-left transition hover:bg-slate-100">
        <div key={partner.id} className="flex items-start gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-emerald-100 text-base font-bold text-emerald-700">
            {partner.initials}
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
            <p className="text-sm font-semibold text-slate-900">{partner.company}</p>
            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              <span className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-slate-100 text-slate-500">•</span>
              {partner.location}
            </p>
          </div>
          <div className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">
            {partner.status}
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 px-2.5 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Sales</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{partner.sales}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-2.5 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Royalty</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{partner.royalty}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-2.5 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Pwd</p>
            <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-950">
              <span type="password">{showPassword ? partner.passwordMask : partner.passwordMask.replace(/./g, '•')}</span>
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
            <button className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-50">Reset</button>
          </div>
          <button className="rounded-full border border-red-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-red-600 transition hover:bg-red-50">Delete</button>
        </div>
      </div>
    </div>
  );
}
