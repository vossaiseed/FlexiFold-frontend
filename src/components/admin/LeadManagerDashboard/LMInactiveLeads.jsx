import React from "react";

const inactiveLeads = [
  { id: 1, name: "Toji joseph & brothers", staff: "MI", ago: "1066h ago" },
  { id: 2, name: "Sidharth Roy", staff: "MI", ago: "1066h ago" },
];

export default function LMInactiveLeads() {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-base">⚠️</span>
        <span className="text-[13px] font-bold text-slate-800">{inactiveLeads.length} leads inactive for 48h+</span>
      </div>

      <div className="flex flex-col gap-2">
        {inactiveLeads.map((lead) => (
          <div
            key={lead.id}
            className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-gray-50 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-[13px] font-semibold text-slate-800">{lead.name}</p>
              <p className="mt-0.5 text-[11px] text-red-500">{lead.staff} · {lead.ago}</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50">
                View
              </button>
              <button className="rounded-lg bg-red-500 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-red-600">
                Reassign
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
