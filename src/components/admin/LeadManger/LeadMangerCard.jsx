import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteLeadManager,
  selectLeadManagers,
  selectLeadManagersLoading,
  selectLeadManagersError,
} from "../../../redux/features/leadManagers/leadManagersSlice";

const avatarColors = [
  { bg: "bg-teal-100",   text: "text-teal-700" },
  { bg: "bg-indigo-100", text: "text-indigo-700" },
  { bg: "bg-pink-100",   text: "text-pink-700" },
  { bg: "bg-amber-100",  text: "text-amber-700" },
  { bg: "bg-blue-100",   text: "text-blue-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
];
// Pick a stable colour from the manager's name (ids are now uuids, not numbers).
const getColor = (key = "") => {
  const sum = String(key).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return avatarColors[sum % avatarColors.length];
};

export default function LeadMangerCard({ onEdit }) {
  const dispatch = useDispatch();
  const managers = useSelector(selectLeadManagers);
  const loading = useSelector(selectLeadManagersLoading);
  const error = useSelector(selectLeadManagersError);

  const navigate = useNavigate();
  const openDetails = () => {
    try { sessionStorage.setItem("lmFromAdmin", "1"); } catch { /* ignore */ }
    navigate(`/lead-manager/dashboard`);
  };

  const handleDelete = (manager) => {
    if (window.confirm(`Delete lead manager "${manager.name}"? This cannot be undone.`)) {
      dispatch(deleteLeadManager(manager.id));
    }
  };

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (loading && managers.length === 0) {
    return <p className="py-12 text-center text-sm text-slate-500">Loading lead managers…</p>;
  }

  if (!loading && managers.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-slate-500">
        No lead managers yet. Click “Add Manager” to create one.
      </p>
    );
  }

  return (
    <>
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
    {managers?.map((manager) => {
      const color = getColor(manager.name || manager.id);
      return (
        

      <div key={manager.id} className="bg-white rounded-2xl border border-slate-100 hover:border-teal-200 transition-colors p-4 flex flex-col gap-3">
        
        {/* Top — avatar + name */}
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 ${color.bg} ${color.text}`}>
          {manager.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{manager.name}</p>
          <p className="text-xs text-slate-400">{manager.phone}</p>
        </div>
      </div>
 
      {/* Location + badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{manager.location}</span>
        </div>
        <span className="text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
          Lead Manager
        </span>
      </div>
 
      {/* Actions */}
      <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100">
        <button
          onClick={() => onEdit?.(manager)}
          className="flex flex-col items-center gap-1 py-2 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
        >
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-xs font-medium text-slate-500">Edit</span>
        </button>

        <button onClick={openDetails}
          className="flex flex-col items-center gap-1 py-2 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50 transition-colors"
        >
          <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-xs font-medium text-slate-500">View</span>
        </button>

        <button
          onClick={() => handleDelete(manager)}
          className="flex flex-col items-center gap-1 py-2 rounded-xl border border-slate-100 hover:border-red-200 hover:bg-red-50 transition-colors"
        >
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-xs font-medium text-slate-500">Delete</span>
        </button>
      </div>
    </div>
      )
})}
  </div>
  </>
  );
}