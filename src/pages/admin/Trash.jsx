import React, { useState } from "react";
import { RotateCcw, Trash2, AlertCircle, MapPin, Phone, Clock } from "lucide-react";

const trashedData = [
  { id: 1, name: "Anoop Wayanad", phone: "9880896946", location: "Wayanad", deletedAt: "2 days ago" },
  { id: 2, name: "Sreenath", phone: "9447498244", location: "Calicut", deletedAt: "5 days ago" },
  { id: 3, name: "Ratheesh", phone: "0096597591895", location: "Alappuzha", deletedAt: "1 week ago" },
  { id: 4, name: "Mohammed Ashraf", phone: "9745450284", location: "Malappuram", deletedAt: "2 weeks ago" },
];

const initial = (name) => name?.trim()?.[0]?.toUpperCase() || "?";

export default function Trash() {
  const [items, setItems] = useState(trashedData);

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="font-sans mt-3">
      {/* Info bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <AlertCircle className="h-4 w-4 text-slate-400" />
          Items in Trash are permanently removed after 30 days.
        </p>
        {items.length > 0 && (
          <button
            onClick={() => setItems([])}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
          >
            <Trash2 className="h-3.5 w-3.5" /> Empty Trash
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
          <Trash2 className="h-8 w-8 text-slate-300" />
          <p className="font-semibold text-slate-500">Trash is empty</p>
          <p className="text-sm text-slate-400">Deleted items will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              {/* Header */}
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
                  {initial(item.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">{item.name}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <Phone className="h-3 w-3" /> {item.phone}
                  </p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> {item.location}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="h-3.5 w-3.5" /> Deleted {item.deletedAt}
                </span>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => remove(item.id)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Restore
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
