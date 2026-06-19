import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { CheckCircle2, XCircle, UserPlus, Activity } from "lucide-react";
import { formatLeadTime } from "../../../utils/leadHelpers";

// Build a notification from a lead based on its status.
const toNotification = (lead) => {
  switch (lead.status) {
    case "Converted":
      return { text: `Your lead “${lead.name}” was converted.`, icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-600" };
    case "Rejected":
      return { text: `Your lead “${lead.name}” was rejected.`, icon: XCircle, bg: "bg-red-50", color: "text-red-600" };
    case "New":
    case "Pending":
      return { text: `Lead “${lead.name}” is awaiting review.`, icon: UserPlus, bg: "bg-blue-50", color: "text-blue-600" };
    default:
      return { text: `Lead “${lead.name}” is now ${lead.status}.`, icon: Activity, bg: "bg-amber-50", color: "text-amber-600" };
  }
};

export default function NotificationsSection() {
  const leads = useSelector((s) => s.leads.leads);

  // A real activity feed derived from the partner's own leads (most recent first).
  const notifications = useMemo(() => {
    return [...(leads || [])]
      .filter((l) => l?.created_at)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 15)
      .map((l) => ({ id: l.id, time: formatLeadTime(l.created_at), ...toNotification(l) }));
  }, [leads]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-slate-800">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">No notifications yet.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map(({ id, text, time, icon: Icon, bg, color }) => (
            <li key={id} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3">
              <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-700">{text}</p>
                <p className="mt-0.5 text-xs text-slate-400">{time}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
