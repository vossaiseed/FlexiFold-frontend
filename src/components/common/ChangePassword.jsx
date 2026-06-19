import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import api, { getApiError } from "../../redux/services/api";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100";
const labelClass = "text-xs font-semibold text-slate-500";

// Self-contained password-change form. Posts to PUT /api/settings, which
// verifies the current password against Supabase Auth before updating it.
export default function ChangePassword() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.current) return setError("Enter your current password.");
    if (form.next.length < 6) return setError("New password must be at least 6 characters.");
    if (form.next !== form.confirm) return setError("New password and confirmation do not match.");
    if (form.next === form.current) return setError("New password must be different from the current one.");

    setSaving(true);
    try {
      await api.put("/settings", { currentPassword: form.current, newPassword: form.next });
      setForm({ current: "", next: "", confirm: "" });
      setSuccess("Password updated successfully.");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const field = (name, label, placeholder) => (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          value={form[name]}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={name === "current" ? "current-password" : "new-password"}
          className={`${inputClass} pr-10`}
        />
        {name === "current" && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            tabIndex={-1}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </label>
  );

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
          <Lock className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-bold text-slate-800">Change Password</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {field("current", "Current Password", "••••••")}
        {field("next", "New Password", "Min. 6 characters")}
        {field("confirm", "Confirm New Password", "Re-enter new password")}
      </div>

      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
      )}
      {success && (
        <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">{success}</p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Updating…" : "Update Password"}
        </button>
      </div>
    </form>
  );
}
