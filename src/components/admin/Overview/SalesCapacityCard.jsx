export default function SalesCapacityCard() {
  const salesCapacity = [
  { name: "Muhammed Misvar Nishad", used: 0, total: 10 },
  { name: "MI", used: 2, total: 10 },
  { name: "Abdullah", used: 0, total: 20 },
];
  return (
    <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-base">📊</span>
        <span className="text-[13px] font-bold text-gray-800">
          Sales Capacity
        </span>
      </div>

      <div className="flex flex-col gap-3.5">
        {salesCapacity.map((item) => {
          const pct = item.total > 0 ? (item.used / item.total) * 100 : 0;

          return (
            <div key={item.name}>
              <div className="mb-1.5 flex justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-500">
                  {item.name}
                </span>

                <span className="text-[11px] font-bold text-gray-500">
                  {item.used}/{item.total}
                </span>
              </div>

              <div className="h-[7px] overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    pct > 0 ? "bg-emerald-500 min-w-[8px]" : "bg-gray-200"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}