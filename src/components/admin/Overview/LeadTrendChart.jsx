export default function LeadTrendChart() {
  return (
    <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-0.5 text-[13px] font-bold text-gray-800">
        Lead Trend
      </div>

      <div className="mb-4 text-[11px] text-gray-400">
        Monthly leads over time
      </div>

      <svg
        viewBox="0 0 400 120"
        className="block h-[120px] w-full"
      >
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 30, 60, 90].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="400"
            y2={y}
            stroke="#f1f5f9"
            strokeWidth="1"
          />
        ))}

        <path
          d="M0,90 C50,85 80,60 100,55 C130,48 150,70 180,50 C210,30 240,40 270,25 C300,10 340,20 380,15 L380,110 L0,110 Z"
          fill="url(#trendGrad)"
        />

        <path
          d="M0,90 C50,85 80,60 100,55 C130,48 150,70 180,50 C210,30 240,40 270,25 C300,10 340,20 380,15"
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {[
          [0, 90],
          [100, 55],
          [180, 50],
          [270, 25],
          [380, 15],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="#fff"
            stroke="#10b981"
            strokeWidth="2.5"
          />
        ))}

        {["Jan", "Mar", "May", "Aug", "Oct"].map((m, i) => {
          const xs = [0, 100, 180, 270, 380];

          return (
            <text
              key={m}
              x={xs[i]}
              y="118"
              fontSize="9"
              fill="#9ca3af"
              textAnchor="middle"
            >
              {m}
            </text>
          );
        })}
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