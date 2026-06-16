import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../utils/api";
import { setCredentials } from "../../redux/features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    phoneNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Login is shared across roles — the redirect is driven by the user's role.
  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, input);
      const { user, session } = res.data;
      dispatch(setCredentials({ user, token: session }));
      const role = user?.user_metadata?.role || "partner";
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-sans lg:items-stretch">

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-emerald-900 px-6 py-6 flex items-center justify-center gap-3">
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
          <path d="M4 6h12l-4 8h8l-8 14 2-10H6L4 6Z" fill="#4ade80" />
        </svg>
        <span className="text-white text-xl font-bold tracking-widest">FLEXIFOLD</span>
      </div>

      {/* Left Green Panel - desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-500 flex-col justify-center items-center text-center px-8 py-16 lg:px-10">
        <div className="flex items-center gap-3 mb-10">
          <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
            <path d="M4 6h12l-4 8h8l-8 14 2-10H6L4 6Z" fill="white" />
          </svg>
          <span className="text-white text-xl lg:text-5xl font-bold tracking-widest">FLEXIFOLD</span>
        </div>
        <h2 className="text-white text-2xl lg:text-3xl font-bold mb-3">Welcome Back</h2>
        <p className="text-emerald-100 text-sm lg:text-lg leading-relaxed mb-12 max-w-sm">
          Access your leads, track earnings, and grow your referral network.
        </p>
        <div className="flex gap-10 justify-center">
          <div className="text-center">
            <div className="text-white text-xl lg:text-4xl  font-bold">500+</div>
            <div className="text-emerald-200 text-sm mt-1 mr-4">Partners</div>
          </div>
          <div className="text-center">
            <div className="text-white text-2xl lg:text-4xl font-bold">₹5L+</div>
            <div className="text-emerald-200 text-sm mt-1 mr-4  ">Paid Out</div>
          </div>
          <div className="text-center">
            <div className="text-white text-2xl lg:text-4xl font-bold">98%</div>
            <div className="text-emerald-200 text-sm mt-1">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Right / Main Panel */}
      <div className="flex-1 bg-gray-50 lg:bg-white flex flex-col justify-center items-center px-4 sm:px-8 lg:px-16 pt-8 pb-10 lg:py-16">
        <div className="w-full max-w-sm lg:max-w-lg">

          {/* Heading */}
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Sign In</h1>
          <p className="text-sm text-gray-500 mb-6">Sign in to access your dashboard</p>

          {/* Card */}
          <form onSubmit={submitHandler} className="bg-white lg:bg-transparent rounded-2xl lg:rounded-none shadow-sm lg:shadow-none p-5 lg:p-0 mb-4">

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <input
                  value={input.phoneNumber} name="phoneNumber" onChange={handleInputChange}
                  type="tel"
                  placeholder="9876543210"
                  className="w-full pl-9 pr-3 py-4 border border-gray-200 rounded-lg text-xs lg:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs lg:text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-emerald-600 font-medium hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input value={input.password} name="password" onChange={handleInputChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-4 border border-gray-200 rounded-lg text-xs lg:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                   <EyeClosed className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2 mb-5">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
              />
              <label htmlFor="remember" className="text-xs lg:text-sm text-gray-600 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Error message */}
            {error && (
              <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-bold py-3 rounded-xl text-base md:text-lg flex items-center justify-center gap-2 transition-all duration-150"
            >
              {loading ? "Signing In..." : "Sign In"}
              {!loading && (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <p className="text-center text-sm text-gray-500 mb-2">
            Don't have an account?{" "}
            <span onClick={() => navigate('/register')} className="text-emerald-600 font-medium hover:underline">Create Account</span>
          </p>
          <p onClick={() => navigate('/')} className="text-center text-sm text-gray-400">← Back to Home</p>
        </div>
      </div>
    </div>
  );
}