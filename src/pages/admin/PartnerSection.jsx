

import React from "react";
import PartnerCard from "../../components/admin/Partner/PartnerCard";
import { useNavigate } from "react-router-dom";
import Addpartner from "../../components/admin/Partner/Addpartner";

const partners = [
  {
    id: 1,
    initials: "F",
    name: "Fayiz Alikkal",
    phone: "9746442665",
    email: "arfayizalikkal@gmail.com",
    company: "Alikkal Associates",
    location: "Perinthalmanna",
    status: "Authorized Partner",
    sales: "₹0",
    royalty: "₹0",
    passwordMask: "fayiz@123",
  },
  {
    id: 2,
    initials: "B",
    name: "Benazir Ameen",
    phone: "8848340828",
    email: "beny.arya@gmail.com",
    company: "Beniztalks",
    location: "Perinthalmanna",
    status: "Authorized Partner",
    sales: "₹0",
    royalty: "₹0",
    passwordMask: "benazir@123",
  },
  {
    id: 3,
    initials: "R",
    name: "Rohit Gupta",
    phone: "8879740115",
    email: "rohit.gupta@example.com",
    company: "Rohit Group",
    location: "Bangalore",
    status: "Authorized Partner",
    sales: "₹0",
    royalty: "₹0",
    passwordMask: "rohit@123",
  },
  {
    id: 4,
    initials: "I",
    name: "Indraneel Dutta",
    phone: "9886001177",
    email: "indraneel.dutta@example.com",
    company: "DKA Architects",
    location: "Bangalore",
    status: "Authorized Partner",
    sales: "₹0",
    royalty: "₹0",
    passwordMask: "indraneel@123",
  },
];


export default function PartnerSection() {
  const [showAddPartner, setShowAddPartner] = React.useState(false);
  const [selectedPartner, setSelectedPartner] = React.useState(null);
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-8xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          {/* <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-600">Partner section</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Partner management</h1>
          </div> */}
          <button onClick={()=>{setShowAddPartner(true)}} className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-green-200 transition hover:bg-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Partner
          </button>
        </div>
        {showAddPartner && <Addpartner mode={selectedPartner?  "edit" : "add"} partner={selectedPartner} onClose={() =>{setShowAddPartner(false),setSelectedPartner(null)}} />}

        <div className="grid gap-5 md:grid-cols-2">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} setSelectedPartner={setSelectedPartner} setShowAddPartner={setShowAddPartner}  />
          ))}
        </div>
      </div>
    </main>
  );
}
