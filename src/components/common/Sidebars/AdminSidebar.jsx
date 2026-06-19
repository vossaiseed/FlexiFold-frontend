import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut } from "lucide-react";
import UserMenu from "../UserMenu";
import { logout as logoutAction } from "../../../redux/features/auth/authSlice";
import api from "../../../redux/services/api";

const ROLE_LABELS = {
  admin: "Administrator",
  "lead-manager": "Lead Manager",
  partner: "Partner",
  sales: "Sales",
  telecaller: "Telecaller",
};

const navItems = [
  {
    label: "Overview",
    path: "/admin/dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    label: "Pending Review",
    path: "/admin/pending-review",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: "Assigned Leads",
    path: "/admin/assigned-leads",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a4 4 0 00-5.356-3.712M9 20H4v-2a4 4 0 015.356-3.712M15 7a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 11-6 0 3 3 0 016 0zm-18 0a3 3 0 116 0 3 3 0 01-6 0z" />
      </svg>
    ),
  },
  {
    label: "Conversion Requests",
    path: "/admin/conversion-requests",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    label: "Partners",
    path: "/admin/partners",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a4 4 0 00-5.356-3.712M9 20H4v-2a4 4 0 015.356-3.712M15 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    label: "Lead Managers",
    path: "/admin/lead-managers",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    label: "Sales Team",
    path: "/admin/sales-team",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: "General Leads",
    path: "/admin/general-leads",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Trash",
    path: "/admin/trash",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
  },
  {
    label: "History",
    path: "/admin/history",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Lead Pool",
    path: "/admin/lead-pool",
    badge: "View",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];


export default function AdminSidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  // Drive the highlight from the URL so it never desyncs from the page.
  const isActivePath = (path) => pathname === path || pathname.startsWith(path + "/");
  const active = navItems.find((i) => isActivePath(i.path))?.label || "Overview";

  // Logged-in user info for the sidebar profile.
  const { user } = useSelector((s) => s.auth);
  const meta = user?.user_metadata || {};
  const displayName = meta.name || "User";
  const displayRole = ROLE_LABELS[meta.role] || meta.role || "";
  const displayInitial = (displayName?.[0] || "U").toUpperCase();

  const handleLogout = async () => {
    setUserMenuOpen(false);
    try { await api.post("/auth/logout"); } catch { /* ignore — clear client state anyway */ }
    dispatch(logoutAction());
    navigate("/login");
  };


  return (
    <>
      {/* ───────────── DESKTOP SIDEBAR (lg+) ───────────── */}
      <div className="hidden lg:flex fixed top-0 left-0 bottom-0 flex-col w-52 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-200">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-green-500">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <div className="font-semibold text-sm text-gray-900">Flexifold</div>
            <div className="text-xs text-gray-400">Admin panel</div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = active === item.label;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  background: isActive ? "#22c55e" : "transparent",
                  color: isActive ? "#ffffff" : "#6b7280",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "#f0fdf4";
                    e.currentTarget.style.color = "#16a34a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#6b7280";
                  }
                }}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.25)" : "#f0fdf4",
                      color: isActive ? "#fff" : "#22c55e",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom user */}
        <div className="relative px-2 py-3 border-t border-gray-200">
          {userMenuOpen && (
            <div className="absolute bottom-full left-2 right-2 mb-2 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-green-500">
              <span className="text-white text-xs font-bold">{displayInitial}</span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-xs font-semibold truncate text-gray-800">{displayName}</div>
              <div className="text-xs text-gray-400">{displayRole}</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 text-gray-400 shrink-0 transition ${userMenuOpen ? "" : "rotate-180"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ───────────── MOBILE TOP HEADER (below lg) ───────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3">
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Page title */}
        <span className="text-sm font-bold text-gray-900">{active}</span>

        {/* Right: role badge + logout */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "#ede9fe", color: "#7c3aed" }}>
            {displayRole || "Admin"}
          </span>
          <button onClick={handleLogout} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* ───────────── MOBILE DRAWER ───────────── */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer panel */}
          <div className="relative w-64 h-full bg-white shadow-xl flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Flexifold</div>
                  <div className="text-xs text-gray-400">Admin panel</div>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer nav */}
            <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = active === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => { setDrawerOpen(false); navigate(item.path); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                    style={{
                      background: isActive ? "#22c55e" : "transparent",
                      color: isActive ? "#ffffff" : "#6b7280",
                    }}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          background: isActive ? "rgba(255,255,255,0.25)" : "#f0fdf4",
                          color: isActive ? "#fff" : "#22c55e",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Drawer bottom user */}
            <div className="px-2 py-3 border-t border-gray-200">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-green-500 shrink-0">
                  <span className="text-white text-xs font-bold">{displayInitial}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-800 truncate">{displayName}</div>
                  <div className="text-xs text-gray-400">{displayRole}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────── DESKTOP TOP NAVBAR (lg+) ───────────── */}
      <div className="hidden lg:flex fixed top-0 left-52 right-0 z-30 bg-white border-b border-gray-200 items-center justify-between px-6 py-3 h-14">
        {/* Page title */}
        <span className="text-base font-bold text-gray-900">{active}</span>

        {/* Right: User menu */}
        <UserMenu />
      </div>

    </>
  );
}