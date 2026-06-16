import { useNavigate } from "react-router-dom";

export default function LeadMangerCard({ onEdit }) {
 const managers = [
  { id: 1, name: "Lead Manager", phone: "0000000000", location: "mlp" },
  { id: 2, name: "Arjun Nair", phone: "9876543210", location: "Calicut" },
  { id: 3, name: "Sneha Pillai", phone: "8765432109", location: "Kochi" },
  { id: 4, name: "Rahul Dev", phone: "9988776655", location: "Bangalore" },
  { id: 5, name: "Priya Sharma", phone: "9123456780", location: "Mumbai" },
  { id: 6, name: "Benazir Ameen", phone: "8848340828", location: "Perinthalmanna" },
];
const avatarColors = [
  { bg: "bg-teal-100",   text: "text-teal-700" },
  { bg: "bg-indigo-100", text: "text-indigo-700" },
  { bg: "bg-pink-100",   text: "text-pink-700" },
  { bg: "bg-amber-100",  text: "text-amber-700" },
  { bg: "bg-blue-100",   text: "text-blue-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
];
const getColor=(id)=>{
  const color = avatarColors[id % avatarColors.length];
  return color;
}
 const navigate = useNavigate();
 const openDetails = () => {
   try { sessionStorage.setItem("lmFromAdmin", "1"); } catch { /* ignore */ }
   navigate(`/lead-manager/dashboard`);
 };
 

  return (
    <>
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
    {managers?.map((manager) => {
      const color =getColor(manager.id);
      return (
        

      <div key={manager.id} className="bg-white rounded-2xl border border-slate-100 hover:border-teal-200 transition-colors p-4 flex flex-col gap-3">
        
        {/* Top — avatar + name */}
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 ${color.bg} ${color.text}`}>
          {manager.name[0].toUpperCase()}
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
         
          className="flex flex-col items-center gap-1 py-2 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-colors"
        >
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-xs font-medium text-slate-500">Reset</span>
        </button>
      </div>
    </div>
      )
})}
  </div>
  </>
  );
}