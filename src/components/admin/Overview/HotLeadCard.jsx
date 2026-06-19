import { useSelector } from "react-redux";

const CLOSED = ["Converted", "Failed", "Rejected"];

export default function HotLeadsCard() {
  const leads = useSelector((s) => s.leads.leads);
  // "Hot" = high-urgency leads that are still open.
  const hot = (leads || []).filter((l) => l?.urgency === "High" && !CLOSED.includes(l?.status));

  return (
    <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-base">🔥</span>
        <span className="text-[13px] font-bold text-slate-800">Hot Leads</span>
        {hot.length > 0 && (
          <span className="ml-auto rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600">
            {hot.length}
          </span>
        )}
      </div>

      {hot.length === 0 ? (
        <p className="m-0 text-[13px] text-slate-400">No hot leads right now.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {hot.slice(0, 3).map((l) => (
            <li key={l.id} className="flex justify-between gap-2 text-[13px] text-slate-600">
              <span className="truncate">{l.name}</span>
              <span className="text-slate-400">{l.location || "—"}</span>
            </li>
          ))}
          {hot.length > 3 && <li className="text-xs text-slate-400">+{hot.length - 3} more</li>}
        </ul>
      )}
    </div>
  );
}
