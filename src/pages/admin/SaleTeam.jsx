

import React, { useState } from "react";
import SaleTeamCard from "../../components/admin/SalesTeam/SaleTeamCard";
import AddSalesStaff from "../../components/admin/SalesTeam/AddSalesStaff";
import { useNavigate } from "react-router-dom";


const saleteam = [
  {
    id: 1,
    initials: "F",
    name: "Fayiz Alikkal",
    phone: "9746442665",
    email: "arfayizalikkal@gmail.com",
    company: "Alikkal Associates",
    location: "Perinthalmanna",
  
    leads: "0",
    converted: "0",
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
   
    leads: "0",
    converted: "0",
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
   
    leads: "0",
    converted: "0",
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
   
    leads: "0",
    converted: "0",
    passwordMask: "indraneel@123",
  },
];


export default function SaleTeam() {
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-8xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          {/* <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-600">Sales team section</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Sales team management</h1>
          </div> */}
          <button
            type="button"
            onClick={() => { setSelectedStaff(null); setShowAddStaff(true); }}
            className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-green-200 transition hover:bg-green-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Sales
          </button>
        </div>
        {showAddStaff && (
          <AddSalesStaff
            staff={selectedStaff}
            onClose={() => { setShowAddStaff(false); setSelectedStaff(null); }}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {saleteam.map((saleteam) => (
            <SaleTeamCard
              key={saleteam.id}
              partner={saleteam}
              onEdit={() => { setSelectedStaff(saleteam); setShowAddStaff(true); }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
