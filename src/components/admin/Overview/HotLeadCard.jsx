export default function HotLeadsCard() {
  return (
    <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-base">🔥</span>

        <span className="text-[13px] font-bold text-slate-800">
          Hot Leads
        </span>
      </div>

      <p className="m-0 text-[13px] text-slate-400">
        No hot leads right now.
      </p>
    </div>
  );
}