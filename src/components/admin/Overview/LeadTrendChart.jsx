import { useSelector } from "react-redux";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function LeadTrendChart() {
  const leads = useSelector((s) => s.leads.leads);

  // Build the last 6 month buckets and count leads by created_at.
  const now = new Date();
  const buckets = [];
  const idx = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    idx[key] = buckets.length;
    buckets.push({ label: MONTHS[d.getMonth()], count: 0 });
  }
  (leads || []).forEach((l) => {
    if (!l?.created_at) return;
    const d = new Date(l.created_at);
    if (isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (idx[key] !== undefined) buckets[idx[key]].count++;
  });

  const W = 400, H = 110, TOP = 10;
  const max = Math.max(...buckets.map((b) => b.count), 1);
  const stepX = buckets.length > 1 ? W / (buckets.length - 1) : W;
  const points = buckets.map((b, i) => [
    Math.round(i * stepX),
    Math.round(H - (b.count / max) * (H - TOP)),
  ]);
  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1][0]},${H} L${points[0][0]},${H} Z`;

  return (
    <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-0.5 text-[13px] font-bold text-gray-800">Lead Trend</div>
      <div className="mb-4 text-[11px] text-gray-400">Leads over the last 6 months</div>

      <svg viewBox="0 0 400 120" className="block h-[120px] w-full">
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 30, 60, 90].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#f1f5f9" strokeWidth="1" />
        ))}

        <path d={areaPath} fill="url(#trendGrad)" />
        <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke="#10b981" strokeWidth="2.5" />
        ))}

        {buckets.map((b, i) => (
          <text key={b.label + i} x={points[i][0]} y="118" fontSize="9" fill="#9ca3af" textAnchor="middle">
            {b.label}
          </text>
        ))}
      </svg>

      <div className="mt-3 flex gap-4">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
          <span className="inline-block h-[3px] w-6 rounded-full bg-emerald-500" />
          Total Leads
        </div>
      </div>
    </div>
  );
}
