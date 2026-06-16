import React, { useState } from "react";
import { X, Mic } from "lucide-react";
import { useDispatch } from "react-redux";
import { createLead } from "../../../../redux/features/leads/leadsSlice";

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-100";
const labelClass = "text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400";

export default function AddLead({ onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    mobile: "",
    clientName: "",
    location: "",
    state: "",
    whatsapp: "",
    email: "",
    urgency: "Medium",
    designation: "Architect",
    language: "English",
    units: "",
    model: "",
    notes: "",
  });
  const [recording, setRecording] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Map the form fields to the column names the API/database expects.
    const payload = {
      name: form.clientName,
      phone: form.mobile,
      whatsapp: form.whatsapp,
      email: form.email,
      location: form.location,
      state: form.state,
      requirement: form.model,
      units: form.units ? Number(form.units) : null,
      urgency: form.urgency,
      designation: form.designation,
      language: form.language,
      status: "New",
      notes: form.notes,
    };

    try {
      await dispatch(createLead(payload)).unwrap();
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add New Lead</h2>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
              Lead will be auto-assigned if a matching sales staff is available, otherwise sent for review.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-slate-200 bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-3 px-6 py-4">
            {/* Mobile + Client Name */}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Mobile Number *</span>
                <input
                  name="mobile"
                  type="tel"
                  required
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="Mobile number"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Client Name *</span>
                <input
                  name="clientName"
                  required
                  value={form.clientName}
                  onChange={handleChange}
                  placeholder="Client name"
                  className={inputClass}
                />
              </label>
            </div>

            {/* Location + State */}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Location (City)</span>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>State</span>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State"
                  className={inputClass}
                />
              </label>
            </div>

            {/* WhatsApp + Email */}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>WhatsApp Number (Optional)</span>
                <input
                  name="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="WhatsApp number"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Email (Optional)</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className={inputClass}
                />
              </label>
            </div>

            {/* Urgency + Designation */}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Urgency</span>
                <select name="urgency" value={form.urgency} onChange={handleChange} className={inputClass}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Designation</span>
                <select name="designation" value={form.designation} onChange={handleChange} className={inputClass}>
                  <option>Architect</option>
                  <option>Builder</option>
                  <option>Contractor</option>
                  <option>Engineer</option>
                  <option>Interior Designer</option>
                  <option>Other</option>
                </select>
              </label>
            </div>

            {/* Primary Language + Number of Units */}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Primary Language</span>
                <select name="language" value={form.language} onChange={handleChange} className={inputClass}>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Malayalam</option>
                  <option>Tamil</option>
                  <option>Arabic</option>
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Number of Units</span>
                <input
                  name="units"
                  type="number"
                  min="0"
                  value={form.units}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  className={inputClass}
                />
              </label>
            </div>

            {/* Enquired Model & Details */}
            <label className="block">
              <span className={labelClass}>Enquired Model & Details</span>
              <textarea
                name="model"
                rows={2}
                value={form.model}
                onChange={handleChange}
                placeholder="Model enquired and any specific requirements"
                className={`${inputClass} resize-none`}
              />
            </label>

            {/* Notes */}
            <label className="block">
              <span className={labelClass}>Notes</span>
              <textarea
                name="notes"
                rows={2}
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional notes"
                className={`${inputClass} resize-none`}
              />
            </label>

            {/* Voice Note */}
            <div className="block">
              <span className={labelClass}>Voice Note (Optional)</span>
              <button
                type="button"
                onClick={() => setRecording((r) => !r)}
                className={`mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  recording
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Mic className={`h-4 w-4 ${recording ? "animate-pulse" : ""}`} />
                {recording ? "Recording… tap to stop" : "Record Voice Note"}
              </button>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="border-t border-slate-100 px-6 py-3">
            <button
              type="submit"
              className="w-full rounded-full bg-green-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-green-200 transition hover:bg-green-600"
            >
              Submit Lead for Review
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
