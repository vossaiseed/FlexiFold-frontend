import React from "react";
import Leadcategory from "../../components/admin/AssignedLeads/Leadcategory";

const generalLeads = [
  { id: 1, status: "New", name: "Ravi Kumar", phone: "9847012345", location: "Kochi", time: "08 Jun 2026 11:20 am IST", assignee: "Unassigned", color: "gray" },
  { id: 2, status: "New", name: "Meera Nair", phone: "9847098765", location: "Trivandrum", time: "07 Jun 2026 03:15 pm IST", assignee: "Unassigned", color: "gray" },
  { id: 3, status: "Discussion", name: "Arjun Menon", phone: "9847055555", location: "Calicut", time: "06 Jun 2026 09:40 am IST", assignee: "Unassigned", color: "blue" },
  { id: 4, status: "New", name: "Fathima Z", phone: "9847077777", location: "Malappuram", time: "05 Jun 2026 06:10 pm IST", assignee: "Unassigned", color: "gray" },
  { id: 5, status: "Converted", name: "Joseph Thomas", phone: "9847088888", location: "Kottayam", time: "04 Jun 2026 10:05 am IST", assignee: "Unassigned", color: "gray" },
  { id: 6, status: "In Progress", name: "Anita Raj", phone: "9847099999", location: "Thrissur", time: "03 Jun 2026 02:30 pm IST", assignee: "Unassigned", color: "gray" },
  { id: 7, status: "New", name: "Suhail Ahmed", phone: "9847011223", location: "Kannur", time: "02 Jun 2026 08:55 am IST", assignee: "Unassigned", color: "gray" },
  { id: 8, status: "Discussion", name: "Divya S", phone: "9847033445", location: "Alappuzha", time: "01 Jun 2026 04:25 pm IST", assignee: "Unassigned", color: "blue" },
];

export default function GeneralLeads() {
  return (
    <div>
      <div className="mb-5">
        {/* <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Lead Pool</p>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">General Leads</h1> */}
      </div>
      <Leadcategory leadsData={generalLeads} />
    </div>
  );
}
