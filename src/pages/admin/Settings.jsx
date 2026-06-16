import React, { useState } from "react";
import { User, Bell, Lock, Camera } from "lucide-react";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100";
const labelClass = "text-xs font-semibold text-slate-500";

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-emerald-500" : "bg-slate-200"}`}
    >
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

const notifyItems = [
  { key: "email", label: "Email notifications", desc: "Receive updates and summaries by email" },
  { key: "leadAlerts", label: "Lead alerts", desc: "Get notified when a new lead is assigned" },
  { key: "weekly", label: "Weekly reports", desc: "A performance digest every Monday" },
];

export default function Settings() {
  const [profile, setProfile] = useState({ name: "Admin", email: "admin@flexifold.com", phone: "9876543210", role: "Administrator" });
  const [notify, setNotify] = useState({ email: true, leadAlerts: true, weekly: false });
  const [security, setSecurity] = useState({ current: "", next: "", confirm: "" });

  const onProfile = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const onSecurity = (e) => setSecurity({ ...security, [e.target.name]: e.target.value });
  const toggle = (key) => setNotify((n) => ({ ...n, [key]: !n[key] }));

  const handleSave = (e) => {
    e.preventDefault();
    console.log({ profile, notify, security });
  };

  return (
    <form onSubmit={handleSave} className="max-w-3xl space-y-5 font-sans mt-3">
      {/* Profile */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <User className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-bold text-slate-800">Profile</h2>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
            {profile.name?.trim()?.[0]?.toUpperCase() || "A"}
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <Camera className="h-3.5 w-3.5" /> Change Photo
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Full Name</span>
            <input name="name" value={profile.name} onChange={onProfile} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Email</span>
            <input name="email" type="email" value={profile.email} onChange={onProfile} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Phone</span>
            <input name="phone" value={profile.phone} onChange={onProfile} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Role</span>
            <input name="role" value={profile.role} onChange={onProfile} disabled className={`${inputClass} cursor-not-allowed opacity-70`} />
          </label>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Bell className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-bold text-slate-800">Notifications</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {notifyItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <Toggle on={notify[item.key]} onChange={() => toggle(item.key)} />
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <Lock className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-bold text-slate-800">Security</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className={labelClass}>Current Password</span>
            <input name="current" type="password" value={security.current} onChange={onSecurity} placeholder="••••••" className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>New Password</span>
            <input name="next" type="password" value={security.next} onChange={onSecurity} placeholder="••••••" className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Confirm Password</span>
            <input name="confirm" type="password" value={security.confirm} onChange={onSecurity} placeholder="••••••" className={inputClass} />
          </label>
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-600"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
