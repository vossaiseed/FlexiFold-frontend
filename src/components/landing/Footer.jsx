import { Phone, MapPin, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer id="footer" className="bg-[#005547] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="py-14 flex flex-col gap-12 md:flex-row md:justify-between">
          {/* Brand Section */}
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 mb-2 ">
              <span className="text-emerald-400 text-3xl font-bold">⌂</span>

              <span className="text-white text-2xl sm:text-2xl font-bold uppercase">
                Flexifold
              </span>
            </div>

            <p className="text-gray-300 text-xs sm:text-base leading-relaxed max-w-xs sm:max-w-sm">
              Connecting professionals and creating opportunities through a
              trusted referral network.
            </p>
          </div>

          {/* Contact Section */}
          <div className="">
            <h3 className="sm:text-md font-bold uppercase text-gray-200 mb-6">
              Contact
            </h3>

            <div className="flex flex-col gap-4 items-start">
              {/* WhatsApp */}
              <div className="flex items-center gap-3 group">
                <div className="bg-white/10 rounded-xl p-2 ">
                  <MessageCircle className="w-5 h-5 text-gray-200 group-hover:text-emerald-400 transition-colors" />
                </div>

                <a
                  href="https://wa.me/919999999999"
                  className=" text-gray-200 hover:text-emerald-400 transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 group">
                <div className="bg-white/10 rounded-xl p-2 ">
                  <Phone className="w-5 h-5 text-gray-200 group-hover:text-emerald-400 transition-colors" />
                </div>

                <span className=" text-gray-200">
                  +91 99999 99999
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 group">
                <div className="bg-white/10 rounded-xl p-2 ">
                  <MapPin className="w-5 h-5 text-gray-200 group-hover:text-emerald-400 transition-colors" />
                </div>

                <span className=" text-gray-200">
                  Bangalore, Karnataka, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10">
          <div className="py-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-gray-300 text-xs  text-center">
              © 2026 Flexifold. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <span
                onClick={() => navigate('/register')}
                className="text-xs  text-gray-300 hover:text-white transition-colors"
              >
                Join Now
              </span>

              <span onClick={() => navigate('/login')}
                
                className="text-xs  text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}