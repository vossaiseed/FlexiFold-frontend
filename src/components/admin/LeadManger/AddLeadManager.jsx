import React, { useRef, useState } from "react";
import { X, Camera, Trash2 } from "lucide-react";

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100";
const labelClass = "text-xs font-semibold uppercase tracking-[0.2em] text-slate-400";

export default function AddLeadManager({  manager, onClose }) {
  const isEdit = Boolean(manager);
  const [form, setForm] = useState({
    name: manager?.name || "",
    phone: manager?.phone || "",
    email: manager?.email || "",
    location: manager?.location || "",
    password: "",
  });
  const [photo, setPhoto] = useState(manager?.photo || "");
  const fileRef = useRef(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...form, photo });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Team Section</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {isEdit ? "Edit Lead Manager" : "Add Lead Manager"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-slate-200 bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            {/* Photo upload */}
            <div className="flex flex-col items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="group relative h-24 w-24 overflow-hidden rounded-full border border-slate-200 bg-slate-50 shadow-sm transition hover:border-teal-300"
              >
                {photo ? (
                  <img src={photo} alt="Manager" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-teal-600">
                    {form.name?.trim()?.[0]?.toUpperCase() || "?"}
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-slate-900/60 py-1 text-[10px] font-semibold uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100">
                  <Camera className="h-3 w-3" /> Edit
                </span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
                >
                  {photo ? "Change Photo" : "Upload Photo"}
                </button>
                {photo && (
                  <button
                    type="button"
                    onClick={() => setPhoto("")}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                )}
              </div>
            </div>

            <label className="block">
              <span className={labelClass}>Full Name *</span>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Manager name"
                className={inputClass}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Phone *</span>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Location</span>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City"
                  className={inputClass}
                />
              </label>
            </div>

            <label className="block">
              <span className={labelClass}>Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>{isEdit ? "Reset Password" : "Password *"}</span>
              <input
                name="password"
                type="password"
                required={!isEdit}
                value={form.password}
                onChange={handleChange}
                placeholder={isEdit ? "Leave blank to keep current" : "Set password"}
                className={inputClass}
              />
            </label>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-teal-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-200 transition hover:bg-teal-600"
            >
              {isEdit ? "Update Manager" : "Add Manager"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
