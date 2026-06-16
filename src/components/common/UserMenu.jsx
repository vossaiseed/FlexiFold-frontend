import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Mail } from "lucide-react";

export default function UserMenu({ name = "Admin", role = "Administrator", email = "admin@flexifold.com", initial }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ini = initial || name?.trim()?.[0]?.toUpperCase() || "U";

  const logout = () => {
    setOpen(false);
    navigate("/login");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-slate-100"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
          {ini}
        </span>
        <span className="hidden text-sm font-medium text-slate-700 sm:inline">{name}</span>
        <ChevronDown className={`hidden h-4 w-4 text-slate-400 transition sm:inline ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* click-away backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                {ini}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{name}</p>
                <p className="truncate text-xs text-slate-400">{role}</p>
              </div>
            </div>
            <div className="px-4 py-2.5">
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="h-3.5 w-3.5 text-slate-400" /> {email}
              </p>
            </div>
            <div className="border-t border-slate-100 p-1">
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
