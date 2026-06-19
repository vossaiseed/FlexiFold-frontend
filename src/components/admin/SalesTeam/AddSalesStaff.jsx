import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { X, Camera, Trash2, Eye, EyeOff, ShieldCheck, Plus } from "lucide-react";
import { createSalesStaff, updateSalesStaff } from "../../../redux/features/salesTeam/salesTeamSlice";

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100";
const labelClass = "text-xs font-semibold text-slate-600";

const LANGUAGE_OPTIONS = ["English", "Hindi", "Malayalam", "Tamil", "Arabic"];
const CLOSING_CAPACITY_OPTIONS = ["Other", "Low", "Medium", "High"];
const ROLE_OPTIONS = ["Official Sales Person", "Telecaller"];

export default function AddSalesStaff({ staff, onClose }) {
  const isEdit = Boolean(staff);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: staff?.name || "",
    phone: staff?.phone || "",
    email: staff?.email || "",
    location: staff?.city || "",
    state: staff?.state || "",
    password: "",
    closingCapacity: staff?.closing_capacity || "Other",
    maxLeadCapacity: staff?.max_lead_capacity ?? 10,
    fullAccess: staff?.full_access ?? true,
    role: staff?.role || "Official Sales Person",
  });
  // The table stores a single primary language + proficiency; seed from that.
  const [languages, setLanguages] = useState(
    staff?.language ? [{ name: staff.language, level: staff.proficiency || 0 }] : []
  );
  const [langName, setLangName] = useState("");
  const [langLevel, setLangLevel] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState(staff?.photo || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const addLanguage = () => {
    if (!langName || !langLevel) return;
    if (languages.some((l) => l.name === langName)) return;
    setLanguages([...languages, { name: langName, level: Number(langLevel) }]);
    setLangName("");
    setLangLevel("");
  };

  const removeLanguage = (index) =>
    setLanguages(languages.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Full name and phone are required.");
      return;
    }

    // Map the form to the salesstaff table columns. The table holds a single
    // primary language + proficiency, so we use the first one entered.
    const primary = languages[0];
    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      city: form.location,
      state: form.state,
      closing_capacity: form.closingCapacity,
      max_lead_capacity: Number(form.maxLeadCapacity) || 0,
      language: primary?.name || null,
      proficiency: primary?.level || null,
      full_access: form.fullAccess,
      role: form.role,
    };
    // Only send a password when set — on edit, blank means "keep current".
    if (form.password) payload.password = form.password;

    setSubmitting(true);
    try {
      if (isEdit && staff?.id) {
        await dispatch(updateSalesStaff({ staffId: staff.id, changes: payload })).unwrap();
      } else {
        await dispatch(createSalesStaff(payload)).unwrap();
      }
      onClose();
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to save sales member. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-900">
            {isEdit ? "Edit Sales Member" : "Add Sales Member"}
          </h2>
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
            {/* Name + Phone */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Full Name *</span>
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className={inputClass}
                />
              </label>
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
            </div>

            {/* Email + Location */}
            <div className="grid gap-4 sm:grid-cols-2">
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

            {/* State + Password */}
            <div className="grid gap-4 sm:grid-cols-2">
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
              <label className="block">
                <span className={labelClass}>Password *</span>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required={!isEdit}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Set password"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>
            </div>

            {/* Closing Capacity + Max Lead Capacity */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Closing Capacity</span>
                <select
                  name="closingCapacity"
                  value={form.closingCapacity}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {CLOSING_CAPACITY_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Max Lead Capacity</span>
                <input
                  name="maxLeadCapacity"
                  type="number"
                  min="0"
                  value={form.maxLeadCapacity}
                  onChange={handleChange}
                  className={inputClass}
                />
              </label>
            </div>

            {/* Languages & Proficiency */}
            <div className="block">
              <span className={labelClass}>Languages &amp; Proficiency</span>
              <div className="mt-2 flex items-center gap-2">
                <select
                  value={langName}
                  onChange={(e) => setLangName(e.target.value)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                >
                  <option value="">Language</option>
                  {LANGUAGE_OPTIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={langLevel}
                  onChange={(e) => setLangLevel(e.target.value)}
                  placeholder="1-10"
                  className="w-20 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                />
                <button
                  type="button"
                  onClick={addLanguage}
                  className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Add
                </button>
              </div>

              {languages.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {languages.map((l, i) => (
                    <span
                      key={l.name}
                      className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700"
                    >
                      {l.name} · {l.level}/10
                      <button
                        type="button"
                        onClick={() => removeLanguage(i)}
                        className="text-teal-500 transition hover:text-teal-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Lead Access Permissions */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                Lead Access Permissions
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, fullAccess: !form.fullAccess })}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    form.fullAccess ? "bg-green-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                      form.fullAccess ? "left-5.5" : "left-0.5"
                    }`}
                  />
                </button>
                <span className="text-sm text-slate-600">
                  {form.fullAccess ? "Full Access — Can see all leads" : "Limited — Only assigned leads"}
                </span>
              </div>
            </div>

            {/* Role */}
            <label className="block">
              <span className={labelClass}>Role *</span>
              <select
                name="role"
                required
                value={form.role}
                onChange={handleChange}
                className={inputClass}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>

            {/* Photo */}
            <div className="block">
              <span className={labelClass}>Photo (optional)</span>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-slate-400">
                  {photo ? (
                    <img src={photo} alt="Sales member" className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                >
                  <Camera className="h-4 w-4" />
                  {photo ? "Change" : "Upload"}
                </button>
                {photo && (
                  <button
                    type="button"
                    onClick={() => setPhoto("")}
                    className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-6 py-4">
            {error && (
              <p className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-linear-to-r from-amber-500 to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:from-amber-600 hover:to-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving…" : isEdit ? "Update Account" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
