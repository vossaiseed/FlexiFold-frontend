export default function LeadStatusCard() {
  const total = 50;
  const leadStatuses = [
  { label: "Converted",   value: 28, color: "#10b981" },
  { label: "Pending",     value: 14, color: "#f59e0b" },
  { label: "In Progress", value: 8,  color: "#3b82f6" },
];

  return (
    <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-0.5 text-[13px] font-bold text-gray-800">
        Lead Status
      </div>

      <div className="mb-4 text-[11px] text-gray-400">
        Current breakdown
      </div>

      <div className="flex items-center gap-5">
        <svg
          viewBox="0 0 100 100"
          className="h-[110px] w-[110px] flex-shrink-0"
        >
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="14"
          />

          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#10b981"
            strokeWidth="14"
            strokeDasharray="134 239"
            strokeDashoffset="0"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />

          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="14"
            strokeDasharray="67 239"
            strokeDashoffset="-134"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />

          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="14"
            strokeDasharray="38 239"
            strokeDashoffset="-201"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />

          <text
            x="50"
            y="46"
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="#1f2937"
          >
            {total}
          </text>

          <text
            x="50"
            y="58"
            textAnchor="middle"
            fontSize="8"
            fill="#9ca3af"
          >
            Total
          </text>
        </svg>

        <div className="flex flex-1 flex-col gap-2.5">
          {leadStatuses.map((s) => (
            <div key={s.label}>
              <div className="mb-1 flex justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                  <span
                    className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.label}
                </div>

                <span className="text-[11px] font-bold text-gray-700">
                  {s.value}
                </span>
              </div>

              <div className="h-[5px] overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: s.color,
                    width: `${(s.value / total) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}