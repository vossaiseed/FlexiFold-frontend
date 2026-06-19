import React from "react";
import { PhoneOff } from "lucide-react";

export default function CallLogsSection() {
  // Call logs require telephony/call-tracking integration, which isn't wired yet.
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-slate-800">Call Logs</h2>
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <PhoneOff className="h-8 w-8 text-slate-300" />
        <p className="font-semibold text-slate-500">No call logs yet</p>
        <p className="text-sm text-slate-400">Calls will appear here once call tracking is enabled.</p>
      </div>
    </section>
  );
}
