export default function PartnerPerformanceCard() {
  const partners = [
  { name: "Fayiz Alikkal", earnings: 0, royalty: 0 },
  { name: "Benazir Ameen", earnings: 0, royalty: 0 },
  { name: "Rohit Gupta", earnings: 0, royalty: 0 },
  { name: "Indraneel Dutta", earnings: 0, royalty: 0 },
];
const AVATAR_COLORS = ["#f59e0b","#10b981","#3b82f6","#8b5cf6","#ef4444","#f97316","#06b6d4"];
 
function getAvatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function getInitial(name) { return name.trim()[0].toUpperCase(); }
  return (
    <div className="col-span-1 sm:col-span-2 lg:col-span-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 text-[13px] font-bold text-gray-800">
        Partner Performance
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
        {partners.map((p) => {
          const bg = getAvatarColor(p.name);

          return (
            <div
              key={p.name}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-gray-50 px-3.5 py-3"
            >
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: bg }}
              >
                {getInitial(p.name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-gray-800">
                  {p.name}
                </div>

                <div className="mt-0.5 text-[11px] text-gray-400">
                  ₹{p.earnings}
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <div className="text-[13px] font-bold text-orange-600">
                  ₹{p.royalty}
                </div>

                <div className="text-[11px] text-gray-400">
                  royalty
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}