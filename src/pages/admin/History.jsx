import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Activity, RefreshCw, RotateCcw, RefreshCcw } from "lucide-react";
import { fetchLeads } from "../../redux/features/leads/leadsSlice";
import { fetchConversions, selectConversions } from "../../redux/features/conversions/conversionsSlice";

// Activity lines stored in lead.notes look like: "[2026-06-17] Status → Converted"
const parseNoteLine = (line) => {
  const m = line.match(/^\[([^\]]+)\]\s*(.*)$/);
  return m ? { date: m[1], text: m[2] } : { date: null, text: line };
};

const typeStyle = {
  status: { icon: RefreshCw, bg: "bg-blue-50", color: "text-blue-600" },
  created: { icon: Activity, bg: "bg-emerald-50", color: "text-emerald-600" },
  conversion: { icon: RefreshCcw, bg: "bg-violet-50", color: "text-violet-600" },
  note: { icon: RotateCcw, bg: "bg-amber-50", color: "text-amber-600" },
};

const fmt = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true,
  });
};

const FILTERS = ["All", "Status changes", "Conversions", "New leads"];

export default function History() {
  const dispatch = useDispatch();
  const leads = useSelector((s) => s.leads.leads) || [];
  const conversions = useSelector(selectConversions) || [];
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchLeads());
    dispatch(fetchConversions());
  }, [dispatch]);

  // Build a single chronological activity feed from leads + conversions.
  const events = useMemo(() => {
    const out = [];

    leads.forEach((lead) => {
      // Lead creation
      if (lead.created_at) {
        out.push({
          id: `lead-${lead.id}-created`,
          who: lead.name,
          text: `Lead created (${lead.status || "New"})`,
          ts: lead.created_at,
          type: "created",
        });
      }
      // Logged activity lines (status changes + notes/reports)
      (lead.notes || "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .forEach((line, i) => {
          const { date, text } = parseNoteLine(line);
          out.push({
            id: `lead-${lead.id}-note-${i}`,
            who: lead.name,
            text,
            ts: date || lead.created_at,
            type: /status\s*→/i.test(text) ? "status" : "note",
          });
        });
    });

    conversions.forEach((c) => {
      out.push({
        id: `conv-${c.id}`,
        who: c.lead_name || c.customer_name || "Lead",
        text: `Conversion ${c.status}${c.amount ? ` · ₹${c.amount}` : ""}${c.sales_staff_name ? ` (by ${c.sales_staff_name})` : ""}`,
        ts: c.created_at,
        type: "conversion",
      });
    });

    return out.sort((a, b) => new Date(b.ts) - new Date(a.ts));
  }, [leads, conversions]);

  const filtered = events.filter((e) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Status changes" && e.type === "status") ||
      (filter === "Conversions" && e.type === "conversion") ||
      (filter === "New leads" && e.type === "created");
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || `${e.who} ${e.text}`.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-8xl">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Activity</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">History</h1>
          <p className="mt-1 text-sm text-slate-500">Every lead creation, status change and conversion across the CRM.</p>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by lead or activity"
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  filter === f ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">No activity yet.</p>
          ) : (
            <ul className="space-y-1">
              {filtered.map((e) => {
                const cfg = typeStyle[e.type] || typeStyle.note;
                const Icon = cfg.icon;
                return (
                  <li key={e.id} className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition hover:bg-slate-50">
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cfg.bg} ${cfg.color}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold text-slate-900">{e.who}</span> — {e.text}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">{fmt(e.ts)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <p className="mt-3 text-center text-xs text-slate-400">Showing {filtered.length} of {events.length} events</p>
      </div>
    </main>
  );
}
