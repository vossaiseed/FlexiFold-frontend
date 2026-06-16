import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/api";

export default function Register() {
  const [input, setInput] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    profession: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Register page is for PARTNERS only — role is fixed to "partner".
  const eventSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!input.name || !input.email || !input.password) {
      setError("Name, email and password are required.");
      return;
    }
    if (input.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: input.name,
          email: input.email,
          password: input.password,
          phoneNumber: input.phone,
          profession: input.profession,
          location: input.location,
          role: "partner",
        }),
      });
      const data = await res.json();
      console.log(data)
      if (!res.ok) throw new Error(data.message || "Registration failed");
      // Account created — send the partner to the login page to sign in.
      navigate("/login");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-sans lg:items-stretch">

      {/* Mobile Top Header - only on mobile */}
      <div className="lg:hidden bg-emerald-900 px-6 py-6 flex items-center justify-center gap-3">
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
          <path d="M4 6h12l-4 8h8l-8 14 2-10H6L4 6Z" fill="#4ade80" />
        </svg>
        <span className="text-white text-xl font-bold tracking-widest">FLEXIFOLD</span>
      </div>

      {/* Left Green Panel - desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-500 flex-col justify-center items-center text-center px-8 py-12 lg:py-16 lg:px-10">
        <div className="flex items-center gap-3 mb-8 lg:mb-8">
          <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
            <path d="M4 6h12l-4 8h8l-8 14 2-10H6L4 6Z" fill="white" />
          </svg>
          <span className="text-white text-xl lg:text-5xl font-bold tracking-widest">FLEXIFOLD</span>
        </div>
        <h2 className="text-white text-xl lg:text-3xl font-bold mb-3">Join Our Network</h2>
        <p className="text-emerald-100 text-lg leading-relaxed mb-8 lg:mb-12 max-w-sm">
          Connect professionals, share opportunities, and earn rewards with every successful referral.
        </p>
        <div className="flex gap-8 lg:gap-10 justify-center">
          <div className="text-center">
            <div className="text-white text-xl lg:text-4xl font-bold">500+</div>
            <div className="text-emerald-200 text-sm mt-1 mr-4">Partners</div>
          </div>
          <div className="text-center">
            <div className="text-white text-xl lg:text-4xl font-bold">₹5L+</div>
            <div className="text-emerald-200 text-sm mt-1 mr-4">Paid Out</div>
          </div>
          <div className="text-center">
            <div className="text-white text-xl lg:text-4xl font-bold">98%</div>
            <div className="text-emerald-200 text-sm mt-1 ">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Right / Main Panel */}
      <div className="flex-1 bg-gray-50 lg:bg-white flex flex-col justify-center items-center px-4 sm:px-8 lg:px-16 pt-8 pb-10 lg:py-16">
        <div  className="w-full max-w-sm lg:max-w-lg">

          {/* Heading */}
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Create Account</h1>
          <p className="text-sm md:text-base text-gray-500 mb-6">Start your journey with Flexifold today</p>

          {/* Card wrapper on mobile */}
          <form onSubmit={eventSubmitHandler} className="bg-white lg:bg-transparent rounded-2xl lg:rounded-none shadow-sm lg:shadow-none p-5 lg:p-0 mb-4">

            {/* Full Name + Phone */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input type="text" placeholder="Your name" value={input.name} onChange={handleInputChange} name="name"
                    className="w-full pl-9 pr-2 py-4 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <input type="tel" placeholder="+91 00000"
                    value={input.phone} onChange={handleInputChange} name="phone"
                    className="w-full pl-9 pr-2 py-4 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input type="email" placeholder="you@example.com"
                  value={input.email} onChange={handleInputChange} name="email"
                  className="w-full pl-9 pr-2 py-4 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white" />
              </div>
            </div>

            {/* Location + Profession */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Location</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <input type="text" placeholder="City"
                    value={input.location} onChange={handleInputChange} name="location"
                    className="w-full pl-9 pr-2 py-4 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Profession</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <select className="w-full pl-9 pr-6 py-4 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-400 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white" value={input.profession} onChange={handleInputChange} name="profession">
                    <option value="">Select</option>
                    <option className="text-gray-800">Freelancer</option>
                    <option className="text-gray-800">Consultant</option>
                    <option className="text-gray-800">Business Owner</option>
                    <option className="text-gray-800">Employee</option>
                  </select>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={input.password} onChange={handleInputChange} name="password"
                  className="w-full pl-9 pr-10 py-4 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? (
                    <EyeClosed className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-bold py-3 rounded-xl text-sm md:text-base flex items-center justify-center gap-2 transition-all duration-150">
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
            </button>
          </form>

          {/* Footer Links */}
        <div className="text-center">
          <p className="text-center text-sm text-gray-500 mb-2">
            Already have an account?{" "}
            <span onClick={() => navigate('/login')} className="text-emerald-600 font-medium hover:underline">Sign In</span>
          </p>
         <span onClick={() => navigate('/')} className="text-gray-400 hover:text-emerald-600 text-sm">← Back to Home</span>
          </div>
        </div>
      </div>
    </div>
  );
}