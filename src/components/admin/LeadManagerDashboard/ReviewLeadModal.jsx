import React, { useState } from "react";
import { X, Star } from "lucide-react";

const recommendedStaff = [
  { id: 1, name: "abdullah", active: 0, top: true },
  { id: 2, name: "MUHAMMED MISVAR NISHAD", active: 0 },
  { id: 3, name: "MI", active: 2 },
];

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100";
const labelClass = "text-xs font-semibold text-slate-600";

export default function ReviewLeadModal({ lead, onClose }) {
  const [form, setForm] = useState({ urgency: "", designation: "", language: "", state: "" });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    console.log("save lead details", { lead, ...form });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Review Lead</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {lead?.name} · {lead?.phone}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Complete lead details */}
          <form onSubmit={handleSave} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">Complete Lead Details</p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelClass}>Urgency</span>
                <select name="urgency" value={form.urgency} onChange={handleChange} className={fieldClass}>
                  <option value="">— Select —</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Designation</span>
                <select name="designation" value={form.designation} onChange={handleChange} className={fieldClass}>
                  <option value="">— Select —</option>
                  <option>Architect</option>
                  <option>Builder</option>
                  <option>Contractor</option>
                  <option>Engineer</option>
                  <option>Interior Designer</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Language</span>
                <select name="language" value={form.language} onChange={handleChange} className={fieldClass}>
                  <option value="">— Select —</option>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Malayalam</option>
                  <option>Tamil</option>
                  <option>Arabic</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>State</span>
                <input name="state" value={form.state} onChange={handleChange} placeholder="State" className={fieldClass} />
              </label>
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Save Details
            </button>
          </form>

          {/* Recommended sales staff */}
          <p className="mt-5 mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            Recommended Sales Staff
          </p>
          <div className="space-y-2.5">
            {recommendedStaff.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 ${
                  s.top ? "border-green-200 bg-green-50" : "border-slate-100 bg-white"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                    {s.top ? <Star className="h-3.5 w-3.5 fill-green-600" /> : i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.active} active</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-md bg-green-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-green-600"
                >
                  Assign
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
