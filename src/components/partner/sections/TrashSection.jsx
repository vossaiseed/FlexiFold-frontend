import React, { useState } from "react";
import { RotateCcw, Trash2, MapPin } from "lucide-react";

const trashedData = [
  { id: 1, name: "Anoop Wayanad", location: "Wayanad", deletedAt: "2 days ago" },
  { id: 2, name: "Sreenath", location: "Calicut", deletedAt: "5 days ago" },
  { id: 3, name: "Ratheesh", location: "Alappuzha", deletedAt: "1 week ago" },
];

const initial = (name) => name?.trim()?.[0]?.toUpperCase() || "?";

export default function TrashSection() {
  const [items, setItems] = useState(trashedData);
  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
        <Trash2 className="h-8 w-8 text-slate-300" />
        <p className="font-semibold text-slate-500">Trash is empty</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
              {initial(item.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-800">{item.name}</p>
              <p className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="h-3 w-3" /> {item.location}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Deleted {item.deletedAt}</p>
          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
            <button onClick={() => remove(item.id)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">
              <RotateCcw className="h-3.5 w-3.5" /> Restore
            </button>
            <button onClick={() => remove(item.id)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
