import React from "react";
import { Menu } from "lucide-react";
import UserMenu from "./UserMenu";

export default function PartnerNavbar({ title, role = "Partner", initial = "F", onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-bold text-slate-900">{title}</h1>
      </div>
      <UserMenu name="Fayiz Alikkal" role={role} email="arfayizalikkal@gmail.com" initial={initial} />
    </header>
  );
}
