import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg-food.jpg";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", phone: "", password: "", referral: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register:", form);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden font-sans">
      {/* Dark base */}
      <div className="absolute inset-0 bg-[#1a1a1a]" />

      {/* Background image with low opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})`, opacity: 0.18 }}
      />

      {/* Logo */}
      <div className="relative z-10 px-8 pt-6">
        <h1 className="text-3xl font-extrabold tracking-wide">
          <span className="text-white">TADKA </span>
          <span className="text-orange-500">EXPRESS</span>
        </h1>
        {/* Golden brush-stroke underline */}
        <svg width="155" height="14" viewBox="0 0 155 14" className="mt-1" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 10 C18 5, 38 12, 58 8 C78 4, 98 11, 118 7 C132 4, 144 9, 153 7" stroke="#c8a800" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 11 C22 7, 42 13, 62 9 C82 5, 102 12, 122 8 C135 5, 146 10, 153 8" stroke="#c8a800" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeOpacity="0.45"/>
        </svg>
      </div>

      {/* Card */}
      <div className="relative z-10 flex flex-1 items-center justify-center py-10">
        <div
          className="w-full max-w-md rounded-xl px-10 py-10"
          style={{ background: "rgba(55,50,45,0.92)" }}
        >
          <h2
            className="text-center text-3xl font-extrabold text-white mb-7"
            style={{ letterSpacing: "0.2em" }}
          >
            REGISTER
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-3 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                style={{ background: "#e8e0d8" }}
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-3 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                style={{ background: "#d6cfc7" }}
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-3 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                style={{ background: "#d6cfc7" }}
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-1">Referral Code</label>
              <input
                type="text"
                name="referral"
                value={form.referral}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-3 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                style={{ background: "#d6cfc7" }}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-full py-3 text-white font-extrabold text-lg tracking-widest transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{ background: "linear-gradient(135deg, #ff6a00, #e65c00)", letterSpacing: "0.15em" }}
              >
                SIGN IN
              </button>
            </div>
          </form>

          <p className="text-center text-white text-sm mt-5">
            Already Have an Account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-orange-400 font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}