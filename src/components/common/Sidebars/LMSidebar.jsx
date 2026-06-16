import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Inbox, Users, Bell, Plus, ArrowLeft, ChevronUp, LogOut } from "lucide-react";
import AddLead from "../../admin/Partner/PartnerDetails/AddLead";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, to: "/lead-manager/dashboard" },
  { label: "Leads", icon: Inbox, to: "/lead-manager/leads" },
  { label: "Sales Team", icon: Users, to: "/lead-manager/sales-team" },
  { label: "Alerts", icon: Bell, badge: 2, to: "/lead-manager/alerts" },
];

export default function LMSidebar() {
  const navigate = useNavigate();
  const [showAddLead, setShowAddLead] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Was this dashboard opened from the Admin view? (set when an admin clicks a Lead Manager card)
  const [fromAdmin] = useState(() => {
    try {
      return sessionStorage.getItem("lmFromAdmin") === "1";
    } catch {
      return false;
    }
  });

  const backToAdmin = () => {
    try { sessionStorage.removeItem("lmFromAdmin"); } catch { /* ignore */ }
    navigate("/admin/dashboard");
  };
  const logout = () => {
    try { sessionStorage.removeItem("lmFromAdmin"); } catch { /* ignore */ }
    navigate("/login");
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-52 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500">
          <span className="text-sm font-bold text-white">X</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">FlexiFold</div>
          <div className="text-xs text-gray-400">Lead Manager</div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4">
        {navItems.map(({ label, icon: Icon, badge, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive ? "bg-green-500 text-white" : "text-gray-500 hover:bg-green-50 hover:text-green-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="shrink-0"><Icon className="h-5 w-5" /></span>
                <span className="flex-1 text-left">{label}</span>
                {badge && (
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      isActive ? "bg-white/25 text-white" : "bg-green-50 text-green-600"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        <button
          onClick={() => setShowAddLead(true)}
          className="mt-2 flex w-full items-center gap-3 rounded-lg text-green-400 px-3 py-2.5 text-sm font-semibold transition-colors hover:text-white hover:bg-green-600"
        >
          <Plus className="h-5 w-5 shrink-0" />
          <span className="flex-1 text-left">Add Lead</span>
        </button>
      </nav>

      {/* Bottom profile */}
      <div className="relative border-t border-gray-200 p-3">
        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
            {fromAdmin ? (
              <button
                onClick={backToAdmin}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-violet-600 transition hover:bg-violet-50"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Admin Dashboard
              </button>
            ) : (
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            )}
          </div>
        )}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-gray-50"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500">
            <span className="text-xs font-bold text-white">A</span>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate text-xs font-semibold text-gray-800">Admin</div>
            <div className="text-xs text-gray-400">Lead Manager</div>
          </div>
          <ChevronUp className={`h-4 w-4 shrink-0 text-gray-400 transition ${menuOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {showAddLead && <AddLead onClose={() => setShowAddLead(false)} />}
    </aside>
  );
}
