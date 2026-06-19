import { useSelector } from "react-redux";
import { selectConversions } from "../../../redux/features/conversions/conversionsSlice";

export default function ConversionRequestsCard() {
  const conversions = useSelector(selectConversions);
  const pending = conversions.filter((c) => c.status === "Pending");

  return (
    <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-base">🔄</span>
        <span className="text-[13px] font-bold text-gray-800">Conversion Requests</span>
        {pending.length > 0 && (
          <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
            {pending.length}
          </span>
        )}
      </div>

      {pending.length === 0 ? (
        <p className="m-0 text-[13px] text-gray-400">No pending requests.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {pending.slice(0, 3).map((c) => (
            <li key={c.id} className="flex justify-between gap-2 text-[13px] text-gray-600">
              <span className="truncate">{c.lead_name || c.customer_name || "Lead"}</span>
              <span className="font-semibold text-gray-700">
                {c.amount ? `₹${c.amount}` : "—"}
              </span>
            </li>
          ))}
          {pending.length > 3 && <li className="text-xs text-gray-400">+{pending.length - 3} more</li>}
        </ul>
      )}
    </div>
  );
}
