import React from "react";
import { Check } from "lucide-react";
import { currentStageIndex } from "../../../utils/pipeline";

// Renders the full lead lifecycle as a vertical stepper.
// stages: [{ key, label, done }]
export default function StatusTimeline({ stages = [] }) {
  const current = currentStageIndex(stages);

  return (
    <ol className="relative ml-2 border-l-2 border-slate-100">
      {stages.map((stage, i) => {
        const isCurrent = i === current && !stage.done;
        const state = stage.done ? "done" : isCurrent ? "current" : "todo";
        const dot =
          state === "done"
            ? "bg-emerald-500 border-emerald-500 text-white"
            : state === "current"
            ? "bg-white border-emerald-500 text-emerald-600 ring-4 ring-emerald-100"
            : "bg-white border-slate-300 text-slate-300";
        const text =
          state === "done"
            ? "text-slate-700"
            : state === "current"
            ? "text-emerald-700 font-semibold"
            : "text-slate-400";

        return (
          <li key={stage.key} className="mb-4 ml-4 last:mb-0">
            <span
              className={`absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] font-bold ${dot}`}
            >
              {stage.done ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <p className={`text-sm ${text}`}>{stage.label}</p>
          </li>
        );
      })}
    </ol>
  );
}
