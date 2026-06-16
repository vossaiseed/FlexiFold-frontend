import React from "react";
import { PhoneIncoming, PhoneMissed, PhoneOff } from "lucide-react";

const logs = [
  { id: 1, name: "Toji Joseph", phone: "9972372573", time: "Today · 10:42 am", duration: "4m 12s", outcome: "Connected" },
  { id: 2, name: "Sidharth Roy", phone: "9986025260", time: "Today · 10:15 am", duration: "—", outcome: "Not Reachable" },
  { id: 3, name: "Arun Public RV", phone: "9243435653", time: "Today · 09:50 am", duration: "2m 38s", outcome: "Connected" },
  { id: 4, name: "Hashir Ali", phone: "9745450284", time: "Today · 09:30 am", duration: "—", outcome: "Busy" },
  { id: 5, name: "Meera Nair", phone: "9846098765", time: "Yesterday · 05:10 pm", duration: "6m 05s", outcome: "Connected" },
];

const outcomeStyle = {
  Connected: { icon: PhoneIncoming, cls: "bg-emerald-50 text-emerald-600", badge: "bg-emerald-50 text-emerald-700" },
  "Not Reachable": { icon: PhoneMissed, cls: "bg-rose-50 text-rose-600", badge: "bg-rose-50 text-rose-700" },
  Busy: { icon: PhoneOff, cls: "bg-amber-50 text-amber-600", badge: "bg-amber-50 text-amber-700" },
};

export default function CallLogsSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-slate-800">Call Logs</h2>
      <div className="divide-y divide-slate-100">
        {logs.map((log) => {
          const cfg = outcomeStyle[log.outcome] || outcomeStyle.Connected;
          const Icon = cfg.icon;
          return (
            <div key={log.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.cls}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{log.name}</p>
                  <p className="text-xs text-slate-400">{log.phone} · {log.time}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden text-xs text-slate-400 sm:inline">{log.duration}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.badge}`}>{log.outcome}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
