export const leadsData = [
  { id: 1, status: "Discussion", name: "Toji joseph & brothers", phone: "9972372573", location: "Near Munnar and Hosur Shoolagiri", team: "Sales: MI", time: "09 May 2026 10:07 am IST", assignee: "INDRANEEL DUTTA", color: "blue" },
  { id: 2, status: "Discussion", name: "Sidharth Roy", phone: "9986025260", location: "Sales: MI", team: "Sales: MI", time: "07 May 2026 6:19 pm IST", assignee: "INDRANEEL DUTTA", color: "blue" },
  { id: 3, status: "New", name: "Arun Public RV", phone: "9243435653", location: "Srirangapatna", team: "", time: "25 Apr 2026 9:20 am IST", assignee: "INDRANEEL DUTTA", color: "gray" },
  { id: 4, status: "New", name: "hashir ali", phone: "0000000000", location: "calicut", team: "", time: "13 Apr 2026 5:45 am IST", assignee: "Benazir Ameen", color: "gray" },
  { id: 5, status: "New", name: "Tony joseph", phone: "919048746444", location: "alappuzha", team: "", time: "13 Apr 2026 5:44 am IST", assignee: "Benazir Ameen", color: "gray" },
  { id: 6, status: "New", name: "saheer galaxy", phone: "7306286665", location: "kakkadampoil", team: "", time: "13 Apr 2026 5:42 am IST", assignee: "Benazir Ameen", color: "gray" },
  { id: 7, status: "New", name: "Aslam munnar", phone: "8138806990", location: "he needs to visit banglore", team: "", time: "12 Apr 2026 4:14 pm IST", assignee: "Benazir Ameen", color: "gray" },
  { id: 8, status: "New", name: "ansif munnar", phone: "8606609211", location: "munnar", team: "", time: "12 Apr 2026 4:12 pm IST", assignee: "Benazir Ameen", color: "gray" },
  { id: 9, status: "New", name: "nyef", phone: "9995059208", location: "thikkody beach", team: "", time: "11 Apr 2026 10:30 am IST", assignee: "Benazir Ameen", color: "gray" },
  { id: 10, status: "In Progress", name: "Aslam munnar", phone: "918138806990", location: "munnar", team: "", time: "11 Apr 2026 10:29 am IST", assignee: "Benazir Ameen", color: "gray" },
  { id: 11, status: "New", name: "Chandran", phone: "9482483050", location: "malappuram", team: "", time: "11 Apr 2026 10:28 am IST", assignee: "Benazir Ameen", color: "gray" },
  { id: 12, status: "New", name: "Anoop wayanad", phone: "9880896946", location: "wayanad", team: "", time: "11 Apr 2026 10:27 am IST", assignee: "Benazir Ameen", color: "gray" },
  { id: 13, status: "New", name: "Ratheesh", phone: "0096597591895", location: "Alappuzha", team: "", time: "11 Apr 2026 10:26 am IST", assignee: "Benazir Ameen", color: "gray" },
  { id: 14, status: "New", name: "mohammed Ashraf", phone: "9745450284", location: "malappuram", team: "", time: "11 Apr 2026 10:25 am IST", assignee: "Benazir Ameen", color: "gray" },
  { id: 15, status: "New", name: "Sreenath", phone: "9447498244", location: "calicut", team: "", time: "07 Apr 2026 6:43 am IST", assignee: "Benazir Ameen", color: "gray" },
];
 
const statusConfig = {
  Discussion: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500", border: "border-l-blue-500" },
  New: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-l-emerald-400" },
  "In Progress": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-l-amber-400" },
  Converted: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500", border: "border-l-purple-400" },
  Failed: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400", border: "border-l-red-400" },
};
 
 
export default function LeadCard({ lead, onDelete, onClick }) {
  if (!lead) return null;
  const status = lead.status ?? "New";
  const cfg = statusConfig[status] || statusConfig["New"];
 
  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-3xl border border-slate-200 border-l-4 ${cfg.border} shadow-sm hover:shadow-md transition-shadow duration-200 p-5 gap-4 lg:rounded-2xl lg:p-4 lg:gap-2 flex flex-col cursor-pointer`}
    >

      {/* Top row: status + delete */}
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full text-xs px-3 py-1 lg:px-2.5 lg:py-0.5 ${cfg.bg} ${cfg.text}`}>
          {lead.status}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(lead.id);
          }}
          className="rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors shrink-0 w-9 h-9 lg:w-7 lg:h-7"
        >
          <svg className="text-red-400 w-4.5 h-4.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Name */}
      <h3 className="font-bold text-slate-900 leading-snug capitalize text-lg lg:text-sm">{lead.name}</h3>

      {/* Details */}
      <div className="flex flex-col gap-2.5 lg:gap-1.5">
        <div className="flex items-center gap-2.5 text-slate-600 text-sm lg:gap-2 lg:text-xs">
          <svg className="text-slate-400 shrink-0 w-5 h-5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{lead.phone}</span>
        </div>
        {lead.location && (
          <div className="flex items-center gap-2.5 text-slate-600 text-sm lg:gap-2 lg:text-xs min-w-0">
            <svg className="text-slate-400 shrink-0 w-5 h-5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate min-w-0">{lead.location}</span>
          </div>
        )}
        {lead.team && (
          <div className="flex items-center gap-2.5 text-slate-600 text-sm lg:gap-2 lg:text-xs">
            <svg className="text-slate-400 shrink-0 w-5 h-5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{lead.team}</span>
          </div>
        )}
        <div className="flex items-center gap-2.5 text-slate-400 text-sm lg:gap-2 lg:text-xs">
          <svg className="text-slate-300 shrink-0 w-5 h-5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{lead.time}</span>
        </div>
      </div>

      {/* Footer: assigned partner */}
      <div className="flex items-center gap-2.5 border-t border-slate-100 pt-3 mt-0.5 lg:gap-2 lg:pt-2.5">
        <span className="flex items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500 shrink-0 h-7 w-7 text-xs lg:h-6 lg:w-6 lg:text-[10px]">
          {lead.assignee?.trim()?.[0]?.toUpperCase() || "?"}
        </span>
        <span className="font-medium text-slate-500 truncate text-sm lg:text-xs">{lead.assignee}</span>
      </div>
    </div>
  );
}