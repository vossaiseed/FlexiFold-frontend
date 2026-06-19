import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LayoutDashboard, Inbox, Users, Bell, Plus, ArrowLeft, ChevronUp, LogOut } from "lucide-react";
import AddLead from "../../admin/Partner/PartnerDetails/AddLead";
import { logout as logoutAction } from "../../../redux/features/auth/authSlice";
import api from "../../../redux/services/api";

const CLOSED = ["Converted", "Failed", "Rejected"];
const isInactive48 = (l) => {
  if (CLOSED.includes(l?.status)) return false;
  const d = new Date(l?.created_at);
  return !isNaN(d.getTime()) && Date.now() - d.getTime() > 48 * 3600 * 1000;
};

export default function LMSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const leads = useSelector((state) => state.leads.leads) || [];
  const role = user?.user_metadata?.role;

  // Live alert count (inactive 48h+ leads) — drives the Alerts badge.
  const alertCount = leads.filter(isInactive48).length;
  const navItems = [
    { label: "Overview", icon: LayoutDashboard, to: "/lead-manager/dashboard" },
    { label: "Leads", icon: Inbox, to: "/lead-manager/leads" },
    { label: "Sales Team", icon: Users, to: "/lead-manager/sales-team" },
    { label: "Alerts", icon: Bell, badge: alertCount, to: "/lead-manager/alerts" },
  ];
  // An admin is here because they came from the Admin dashboard → offer "Back to
  // Admin". A lead manager who logged in directly → offer "Logout".
  const fromAdmin = role === "admin";
  const displayName = user?.user_metadata?.name || (fromAdmin ? "Admin" : "Lead Manager");

  const [showAddLead, setShowAddLead] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const backToAdmin = () => {
    try { sessionStorage.removeItem("lmFromAdmin"); } catch { /* ignore */ }
    navigate("/admin/dashboard");
  };
  const handleLogout = async () => {
    try { sessionStorage.removeItem("lmFromAdmin"); } catch { /* ignore */ }
    try { await api.post("/auth/logout"); } catch { /* ignore — clear client state anyway */ }
    dispatch(logoutAction());
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
                {badge > 0 && (
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
                onClick={handleLogout}
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
            <span className="text-xs font-bold text-white">{displayName?.[0]?.toUpperCase() || "U"}</span>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate text-xs font-semibold text-gray-800">{displayName}</div>
            <div className="text-xs text-gray-400">Lead Manager</div>
          </div>
          <ChevronUp className={`h-4 w-4 shrink-0 text-gray-400 transition ${menuOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {showAddLead && <AddLead onClose={() => setShowAddLead(false)} />}
    </aside>
  );
}
