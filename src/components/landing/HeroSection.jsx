import React from 'react'
import { GoArrowDown } from "react-icons/go";
import { LuUsers } from "react-icons/lu";
import { IoShareSocialOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 sm:pt-32">
      {/* background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#e8f5e9 0%,#f0fff4 40%,#e0f2f1 100%)" }} />
      <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0 bg-black/10" />

      {/* content */}
      <div className="hero-content relative z-10 text-center px-6 sm:px-8 lg:px-8 flex flex-col items-center mt-10 max-w-6xl mx-auto">
        <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/30 rounded-full px-8 py-2 text-xs font-medium text-emerald-900 mb-4">
          <span className="badge-dot w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          Referral Network Platform
        </span>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl  font-syne font-extrabold leading-tight tracking-tighter ">
          Earn by Connecting
        </h1>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-syne font-extrabold leading-tight tracking-tighter text-emerald-500 ">
          Opportunities
        </h1>

        <p className="mt-3 text-slate-600 max-w-2xl leading-relaxed text-base ">
          Share quality leads and earn rewards
        </p>

        <div className="grid w-full max-w-xl grid-cols-2 gap-4 mt-10 ">
          <div onClick={() => navigate('/register')} className="rounded-4xl p-5 sm:p-10 flex flex-col items-center gap-4 cursor-pointer bg-emerald-500 shadow-[0_20px_50px_rgba(15,197,110,0.28)] hover:-translate-y-1 transition-transform duration-300">
            <div className="flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-xl sm:rounded-3xl bg-white/15 text-white">
              <LuUsers className="sm:w-8 sm:h-8 w-6 h-6" />
            </div>
            <div  className="flex flex-col items-center gap-1">
              <span className="font-syne font-bold text-white text-lg sm:text-2xl">Join Now</span>
              <span className="text-white/75 text-xs sm:text-base">Create free account</span>
            </div>
          </div>

          <div onClick={() => navigate('/login')} className="rounded-4xl p-5 sm:p-10 flex flex-col items-center gap-4 cursor-pointer bg-white shadow-[0_20px_50px_rgba(15,197,110,0.18)] hover:-translate-y-1 transition-transform duration-300">
            <div className="flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-xl sm:rounded-3xl bg-emerald-500/10 text-emerald-500">
              <IoShareSocialOutline className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-syne font-bold text-slate-900 text-lg sm:text-2xl">Sign In</span>
              <span className="text-slate-500 text-xs sm:text-base">Access dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <a href="#howisitsection" className="relative z-10 mt-30 flex flex-col items-center gap-2 text-slate-100 sm:text-md cursor-pointer hover:text-emerald-200 transition-colors group">
        See how it works
        <span className="flex items-center justify-center">
          <GoArrowDown className="animate-bounce sm:w-6 sm:h-6" />
        </span>
      </a>
    </section>
  )
}
