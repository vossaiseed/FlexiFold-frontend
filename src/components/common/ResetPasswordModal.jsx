import React, { useState } from "react";
import { KeyRound, Eye, EyeOff, X } from "lucide-react";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100";
const labelClass = "text-xs font-semibold text-slate-500";

// Admin-initiated password reset modal. Used by Sales Team and Partner cards.
// `onSubmit(password)` should return a promise (the reset thunk); the modal
// shows loading / error and closes on success.
export default function ResetPasswordModal({ open, onClose, onSubmit, name }) {
  const [form, setForm] = useState({ next: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const reset = () => {
    setForm({ next: "", confirm: "" });
    setShow(false);
    setError("");
    setSaving(false);
  };

  const close = () => {
    reset();
    onClose?.();
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.next.length < 6) return setError("New password must be at least 6 characters.");
    if (form.next !== form.confirm) return setError("Passwords do not match.");

    setSaving(true);
    try {
      await onSubmit(form.next);
      reset();
      onClose?.();
    } catch (err) {
      setError(typeof err === "string" ? err : err?.message || "Could not reset password.");
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={close}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <KeyRound className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Reset Password</h2>
              {name && <p className="text-xs text-slate-400">for {name}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className={labelClass}>New Password</span>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={form.next}
                onChange={(e) => setForm({ ...form, next: e.target.value })}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                tabIndex={-1}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <label className="block">
            <span className={labelClass}>Confirm New Password</span>
            <input
              type={show ? "text" : "password"}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Re-enter new password"
              autoComplete="new-password"
              className={inputClass}
            />
          </label>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-amber-200 transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Resetting…" : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
