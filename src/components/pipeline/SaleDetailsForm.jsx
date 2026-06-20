import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IndianRupee, Check } from "lucide-react";
import { updateLead } from "../../redux/features/leads/leadsSlice";
import { fetchConversions, updateConversionAmount, selectConversions } from "../../redux/features/conversions/conversionsSlice";
import { getLeadId } from "../../utils/leadHelpers";

const inputClass = "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100";
const labelClass = "text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400";

// Sales Team finalises the conversion amount + sale notes. Saves to the
// conversion record (always present for a converted lead — no migration needed,
// and it's what the Conversion Request shows) and mirrors onto the lead.
export default function SaleDetailsForm({ leadId }) {
  const dispatch = useDispatch();
  const lead = useSelector((s) => (s.leads.leads || []).find((l) => getLeadId(l) === leadId));
  const conversions = useSelector(selectConversions) || [];
  const conversion = conversions.find((c) => c.lead_id === leadId);

  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { dispatch(fetchConversions()); }, [dispatch]);

  useEffect(() => {
    const initAmt = lead?.conversion_amount ?? conversion?.amount ?? "";
    setAmount(initAmt === null || initAmt === undefined ? "" : initAmt);
    setNotes(lead?.sale_notes ?? conversion?.notes ?? "");
  }, [lead?.conversion_amount, lead?.sale_notes, conversion?.amount, conversion?.notes]);

  const save = async () => {
    setBusy(true);
    setError(null);
    setSaved(false);
    const amt = amount === "" ? null : Number(amount);
    try {
      let persisted = false;
      // Primary: the conversion record (shows directly in the Conversion Request).
      if (conversion?.id) {
        await dispatch(updateConversionAmount({ id: conversion.id, amount: amt, notes: notes || null })).unwrap();
        persisted = true;
      }
      // Mirror onto the lead for Lead Details views. If there's no conversion this
      // is the only path, so surface its error then.
      try {
        await dispatch(updateLead({ leadId, changes: { conversion_amount: amt, sale_notes: notes || null } })).unwrap();
        persisted = true;
      } catch (leadErr) {
        if (!persisted) throw leadErr;
      }
      setSaved(true);
    } catch (e) {
      setError(typeof e === "string" ? e : e?.message || "Could not save details.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
        <IndianRupee className="h-4 w-4 text-emerald-600" /> Conversion Amount &amp; Details
      </p>

      {error && <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

      <div className="mt-3 grid gap-2">
        <label>
          <span className={labelClass}>Conversion amount (₹)</span>
          <input type="number" min="0" className={inputClass} value={amount} onChange={(e) => { setAmount(e.target.value); setSaved(false); }} placeholder="e.g. 250000" />
        </label>
        <label>
          <span className={labelClass}>Sale notes / required details</span>
          <textarea rows={2} className={inputClass} value={notes} onChange={(e) => { setNotes(e.target.value); setSaved(false); }} placeholder="Final scope, materials, special requirements…" />
        </label>
      </div>

      <button
        onClick={save}
        disabled={busy}
        className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
      >
        {saved ? <><Check className="h-4 w-4" /> Saved</> : busy ? "Saving…" : "Save Details"}
      </button>
    </div>
  );
}
