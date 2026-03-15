import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg-food.jpg";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", password: "", referral: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          password: form.password,
          referredByCode: form.referral || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.map(err => err.msg).join(", "));
        }
        throw new Error(data.message || data.error || "Registration failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ _id: data._id, name: data.name, role: data.role }));
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
          <path d="M2 10 C18 5, 38 12, 58 8 C78 4, 98 11, 118 7 C132 4, 144 9, 153 7" stroke="#c8a800" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 11 C22 7, 42 13, 62 9 C82 5, 102 12, 122 8 C135 5, 146 10, 153 8" stroke="#c8a800" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeOpacity="0.45" />
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
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block text-white text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
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
                disabled={loading}
                className="w-full rounded-full py-3 text-white font-extrabold text-lg tracking-widest transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #ff6a00, #e65c00)", letterSpacing: "0.15em" }}
              >
                {loading ? "REGISTERING..." : "REGISTER"}
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