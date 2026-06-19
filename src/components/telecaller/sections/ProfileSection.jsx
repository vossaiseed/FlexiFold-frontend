import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera } from "lucide-react";
import api, { getApiError } from "../../../redux/services/api";
import { setCredentials } from "../../../redux/features/auth/authSlice";
import ChangePassword from "../../common/ChangePassword";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100";
const labelClass = "text-xs font-semibold text-slate-500";

export default function ProfileSection() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((s) => s.auth);
  const meta = user?.user_metadata || {};

  const [form, setForm] = useState({
    name: meta.name || "",
    email: user?.email || "",
    phone: meta.phoneNumber || "",
    location: meta.location || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await api.get("/settings");
        const s = data.data ?? data;
        if (active && s) {
          setForm({ name: s.name || "", email: s.email || "", phone: s.phone || "", location: s.location || "" });
        }
      } catch { /* fall back to Redux values */ }
    })();
    return () => { active = false; };
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name.trim()) return setError("Name is required.");
    setSaving(true);
    try {
      const { data } = await api.put("/settings", { name: form.name, phone: form.phone, location: form.location });
      const updatedUser = data.data ?? data;
      if (updatedUser) dispatch(setCredentials({ user: updatedUser, token }));
      setSuccess("Profile saved.");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <form onSubmit={onSave} className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
            {form.name?.trim()?.[0]?.toUpperCase() || "T"}
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
            <input name="email" type="email" value={form.email} disabled className={`${inputClass} cursor-not-allowed opacity-70`} />
          </label>
          <label className="block">
            <span className={labelClass}>Phone</span>
            <input name="phone" value={form.phone} onChange={onChange} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Location</span>
            <input name="location" value={form.location} onChange={onChange} className={inputClass} />
          </label>
        </div>
      </section>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
      {success && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">{success}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
      </form>

      <ChangePassword />
    </div>
  );
}
