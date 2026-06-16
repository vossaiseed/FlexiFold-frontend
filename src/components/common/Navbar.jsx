import React, { useEffect, useState } from 'react'
import { HiOutlineMenu } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#013334] backdrop-blur-sm px-4 py-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 font-syne font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight text-white">
          FLEXIFOLD
        </div>

        <ul className="hidden md:flex gap-6 list-none text-base  text-white/80">
          {["Home", "Features", "FAQs", "Contact"].map(l => (
            <li key={l}>
              <a href="#" className="hover:text-white transition-colors hover:underline">{l}</a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
          <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/15 md:hidden">
            <HiOutlineMenu className="h-6 w-6" />
          </button>
          <div className="hidden md:flex flex-wrap gap-2 items-center">
            <button className="border border-white/30 hover:border-white hover:bg-white/10 text-white rounded-full px-5 py-2    transition-all bg-transparent cursor-pointer">
              Sign In
            </button>
            <button onClick={() => navigate('/register')} className="bg-green-500 hover:bg-green-600 text-white rounded-full px-5 py-2 sm:px-6 sm:py-2   font-semibold transition-all cursor-pointer hover:-translate-y-px">
              Join Now
            </button>
          </div>
        </div>
      </div>

      <>
        {/* Overlay */}
        <div
          className={`fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ease-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsOpen(false)}
        />
        {/* Mobile Menu */}
        <div className={`fixed top-0 right-0 h-screen w-[75%] max-w-sm bg-linear-to-b from-[#013334] to-[#001b1d] z-60 shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 className="text-white text-xl font-bold">
                FLEXIFOLD
              </h2>

              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-xl bg-white/10 text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Navigation */}
            <div className="px-10 py-10">
              <ul className="space-y-5 text-white text-lg font-medium">
                <li>
                  <a href="#home" className="hover:text-green-400" onClick={() => setIsOpen(false)}>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-green-400" onClick={() => setIsOpen(false)}>
                    Features
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="hover:text-green-400" onClick={() => setIsOpen(false)}>
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-green-400" onClick={() => setIsOpen(false)}>
                    Contact
                  </a>
                </li>
              </ul>

              {/* Divider */}
              <div className="border-t border-white/10 my-10"></div>

              {/* Buttons */}
              <div className="space-y-4">
                <button onClick={() => navigate('/login')} className="w-full border border-white/20 text-white py-3 rounded-2xl hover:bg-white/10 transition">
                  Sign In
                </button>

                <button onClick={() => navigate('/register')} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold transition">
                  Join Now
                </button>
              </div>
            </div>
          </div>
        </>
    </nav>
  )
}
