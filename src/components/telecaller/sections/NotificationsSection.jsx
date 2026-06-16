import React from "react";
import { UserPlus, CalendarClock, CheckCircle2, Bell } from "lucide-react";

const notifications = [
  { id: 1, text: "3 new leads were assigned to you.", time: "1h ago", icon: UserPlus, bg: "bg-blue-50", color: "text-blue-600", unread: true },
  { id: 2, text: "Follow-up with Meera Nair is due at 2:00 pm.", time: "2h ago", icon: CalendarClock, bg: "bg-amber-50", color: "text-amber-600", unread: true },
  { id: 3, text: "Lead “Toji Joseph” was marked converted.", time: "1d ago", icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-600", unread: false },
  { id: 4, text: "Daily call target reminder.", time: "1d ago", icon: Bell, bg: "bg-violet-50", color: "text-violet-600", unread: false },
];

export default function NotificationsSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-slate-800">Notifications</h2>
      <ul className="space-y-2">
        {notifications.map(({ id, text, time, icon: Icon, bg, color, unread }) => (
          <li key={id} className={`flex items-start gap-3 rounded-xl border p-3 ${unread ? "border-emerald-100 bg-emerald-50/40" : "border-slate-100 bg-white"}`}>
            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}>
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-700">{text}</p>
              <p className="mt-0.5 text-xs text-slate-400">{time}</p>
            </div>
            {unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />}
          </li>
        ))}
      </ul>
    </section>
  );
}
