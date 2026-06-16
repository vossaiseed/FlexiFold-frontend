import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, DollarSign, CreditCard, Bell, Trash2, User, ChevronUp, LogOut, X } from "lucide-react";

export const partnerNav = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/partner/dashboard" },
  { label: "Leads", icon: Users, to: "/partner/leads" },
  { label: "Earnings", icon: DollarSign, to: "/partner/earnings" },
  { label: "Withdrawals", icon: CreditCard, to: "/partner/withdrawals" },
  { label: "Notifications", icon: Bell, to: "/partner/notifications" },
  { label: "Trash", icon: Trash2, to: "/partner/trash" },
  { label: "Profile", icon: User, to: "/partner/profile" },
];

const currentUser = { name: "Fayiz Alikkal", role: "Partner", initial: "F" };

function SidebarBody({ onNavClick }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    onNavClick?.();
    navigate("/login");
  };

  return (
    <>
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-base font-bold text-white">P</div>
        <div>
          <p className="text-sm font-bold text-slate-900">Partner Panel</p>
          <p className="text-xs text-slate-400">FlexiFold</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {partnerNav.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                isActive ? "bg-emerald-500 text-white shadow-sm" : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logged-in user */}
      <div className="relative border-t border-slate-100 p-3">
        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        )}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-50"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
            {currentUser.initial}
          </span>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-semibold text-slate-800">{currentUser.name}</p>
            <p className="truncate text-xs text-slate-400">{currentUser.role}</p>
          </div>
          <ChevronUp className={`h-4 w-4 shrink-0 text-slate-400 transition ${menuOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
    </>
  );
}

export default function PartnerSidebar({ open, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-slate-200">
        <SidebarBody />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="relative flex h-full w-64 flex-col bg-white shadow-xl">
            <button
              onClick={onClose}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarBody onNavClick={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
