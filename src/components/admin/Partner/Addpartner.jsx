import React from 'react'

export default function Addpartner({ mode, partner, onClose }) {
    const [form, setForm] = React.useState({
        name: partner?.name || '',
        phone: partner?.phone || '',  
        email: partner?.email || '',
        location: partner?.location || '',
        state: partner?.state || '',
        password: partner?.password || '',
        company:partner?.company || '',
        role: partner?.status || 'Authorized Partner',
    });

    const handleChange = (e) => {
        setForm({...form,[e.target.name]:e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
       
        console.log(form);
        onClose();
    }

     
  return (
    <div>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="w-full max-w-2xl rounded-4xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{mode === "edit" ? "Edit Partner" : "Add Partner"}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-slate-600 transition hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Full Name *</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="mt-2 w-full rounded-2xl border border-green-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Phone *</span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="mt-2 w-full rounded-2xl border border-green-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="mt-2 w-full rounded-2xl border border-green-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Location</span>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City"
                className="mt-2 w-full rounded-2xl border border-green-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">State</span>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className="mt-2 w-full rounded-2xl border border-green-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Password *</span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Set password"
                className="mt-2 w-full rounded-2xl border border-green-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Company Name (optional)</span>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company name"
              className="mt-2 w-full rounded-2xl border border-green-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Role *</span>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-green-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              >
                <option>Authorized Partner</option>
                <option>Partner</option>
                <option>Pending Approval</option>
              </select>
            </label>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Photo (optional)</span>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">📷</div>
                <button type="button" className="rounded-full border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100">
                  Upload
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              {mode === "edit" ? "Update Partner" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}
