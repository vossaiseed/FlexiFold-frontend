import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2, Phone, Mail, MapPin, X, UserCog } from "lucide-react";
import {
  fetchProjectManagers,
  createProjectManager,
  deleteProjectManager,
  selectProjectManagers,
} from "../../redux/features/projectManagers/projectManagersSlice";

const inputClass = "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100";
const labelClass = "text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400";

export default function ProjectManagers() {
  const dispatch = useDispatch();
  const managers = useSelector(selectProjectManagers) || [];
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", location: "", password: "" });

  useEffect(() => { dispatch(fetchProjectManagers()); }, [dispatch]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await dispatch(createProjectManager(form)).unwrap();
      setForm({ name: "", phone: "", email: "", location: "", password: "" });
      setOpen(false);
    } catch (err) {
      setError(typeof err === "string" ? err : "Could not create project manager.");
    } finally {
      setBusy(false);
    }
  };

  const remove = (id) => dispatch(deleteProjectManager(id));

  return (
    <div className="font-sans">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <UserCog className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Project Managers</h1>
            <p className="text-xs text-slate-400">{managers.length} manager{managers.length === 1 ? "" : "s"} · can be assigned to projects</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4" /> Add Project Manager
        </button>
      </div>

      {/* List */}
      {managers.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
          <UserCog className="h-8 w-8 text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">No project managers yet</p>
          <p className="text-sm text-slate-400">Add one so leads can be assigned for execution.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {managers.map((m) => (
            <div
              key={m.id ?? m._id}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-2 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-base font-bold text-emerald-700 ring-2 ring-emerald-50">
                    {m.name?.[0]?.toUpperCase() || "P"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">{m.name}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">Project Manager</p>
                  </div>
                </div>
                <button
                  onClick={() => remove(m.id ?? m._id)}
                  title="Remove"
                  className="rounded-lg p-2 text-slate-300 transition hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Contact */}
              <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-400" />{m.phone || "—"}</span>
                {m.email && <span className="inline-flex items-center gap-2 truncate"><Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" /><span className="truncate">{m.email}</span></span>}
                {m.location && <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-slate-400" />{m.location}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="absolute inset-0" onClick={() => setOpen(false)} />
          <form onSubmit={submit} className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"><UserCog className="h-4.5 w-4.5" /></span>
                <h2 className="text-lg font-semibold text-slate-900">Add Project Manager</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <label><span className={labelClass}>Name *</span><input required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label><span className={labelClass}>Phone *</span><input required className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
              <label><span className={labelClass}>Email</span><input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label><span className={labelClass}>Location</span><input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
              <label className="sm:col-span-2"><span className={labelClass}>Password *</span><input required type="password" className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
              <p className="sm:col-span-2 text-[11px] text-slate-400">They log in with this phone &amp; password as a Project Manager.</p>
            </div>
            {error && <p className="px-5 pb-1 text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={busy} className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50">
                {busy ? "Saving…" : "Create Manager"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
