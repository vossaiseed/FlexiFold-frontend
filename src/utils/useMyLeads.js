import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectSalesTeam } from "../redux/features/salesTeam/salesTeamSlice";
import { selectConversions } from "../redux/features/conversions/conversionsSlice";

const digits = (p) => String(p ?? "").replace(/\D/g, "");
const norm = (s) => (s || "").trim().toLowerCase();

// Returns the leads that belong to the logged-in telecaller/sales user, each
// annotated with an `effectiveStatus`:
//   - "Converted"          if it has an Approved conversion request
//   - "Conversion Pending" if it has a Pending conversion request
//   - otherwise the lead's own status
// This keeps the dashboard cards, filters and the "conversion pending" chip in
// agreement even when the raw `status` column couldn't be updated.
//
// A lead's `assigned_to` can hold the user's Supabase Auth id OR their
// `salesstaff` row id (admin "Change"), so we match against both + name.
export default function useMyLeads() {
  const leads = useSelector((s) => s.leads.leads) || [];
  const salesTeam = useSelector(selectSalesTeam) || [];
  const conversions = useSelector(selectConversions) || [];
  const { user } = useSelector((s) => s.auth);
  const meta = user?.user_metadata || {};

  return useMemo(() => {
    const myName = norm(meta.name);
    const myPhone = digits(meta.phoneNumber);

    const myIds = new Set();
    if (user?.id) myIds.add(user.id);
    salesTeam.forEach((s) => {
      if ((myPhone && digits(s.phone) === myPhone) || (myName && norm(s.name) === myName)) {
        myIds.add(s.id);
      }
    });

    // lead_id -> "Approved" | "Pending" (active conversion, ignoring Rejected)
    const convStatus = {};
    conversions.forEach((c) => {
      if (!c.lead_id || c.status === "Rejected") return;
      if (convStatus[c.lead_id] !== "Approved") convStatus[c.lead_id] = c.status;
    });

    return leads
      .filter(
        (l) =>
          (l.assigned_to && myIds.has(l.assigned_to)) ||
          (myName && norm(l.assigned_name) === myName)
      )
      .map((l) => {
        const cs = convStatus[l.id];
        const effectiveStatus =
          cs === "Approved" ? "Converted" : cs === "Pending" ? "Conversion Pending" : l.status;
        return { ...l, effectiveStatus };
      });
  }, [leads, salesTeam, conversions, user, meta.name, meta.phoneNumber]);
}
