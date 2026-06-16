import React, { useState } from "react";
import { Camera } from "lucide-react";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100";
const labelClass = "text-xs font-semibold text-slate-500";

export default function ProfileSection() {
  const [form, setForm] = useState({
    name: "Fayiz Alikkal",
    email: "arfayizalikkal@gmail.com",
    phone: "9746442665",
    company: "Alikkal Associates",
    location: "Perinthalmanna, Kerala",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSave = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <form onSubmit={onSave} className="max-w-2xl space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
            {form.name?.trim()?.[0]?.toUpperCase() || "P"}
          </div>
          <button type="button" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
            <Camera className="h-3.5 w-3.5" /> Change Photo
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Full Name</span>
            <input name="name" value={form.name} onChange={onChange} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Email</span>
            <input name="email" type="email" value={form.email} onChange={onChange} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Phone</span>
            <input name="phone" value={form.phone} onChange={onChange} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Company</span>
            <input name="company" value={form.company} onChange={onChange} className={inputClass} />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Location</span>
            <input name="location" value={form.location} onChange={onChange} className={inputClass} />
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-600">
          Save Changes
        </button>
      </div>
    </form>
  );
}
