import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg-food.jpg";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        _id: data._id,
        name: data.name,
        role: data.role
      }));

      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[#1a1a1a]" />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})`, opacity: 0.18 }}
      />

      <div className="relative z-10 px-8 pt-6">
        <h1 className="text-3xl font-extrabold tracking-wide">
          <span className="text-white">TADKA </span>
          <span className="text-orange-500">EXPRESS</span>
        </h1>
        <svg width="155" height="14" viewBox="0 0 155 14" className="mt-1" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 10 C18 5, 38 12, 58 8 C78 4, 98 11, 118 7 C132 4, 144 9, 153 7" stroke="#c8a800" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 11 C22 7, 42 13, 62 9 C82 5, 102 12, 122 8 C135 5, 146 10, 153 8" stroke="#c8a800" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeOpacity="0.45"/>
        </svg>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center py-10">
        <div
          className="w-full max-w-md rounded-xl px-10 py-10"
          style={{ background: "rgba(55,50,45,0.92)" }}
        >
          <h2
            className="text-center text-3xl font-extrabold text-white mb-8"
            style={{ letterSpacing: "0.2em" }}
          >
            LOGIN
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

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
              <div className="text-right mt-1">
                <button type="button" className="text-orange-400 text-xs hover:underline">
                  Forgot Password?
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-3 text-white font-extrabold text-lg tracking-widest transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #ff6a00, #e65c00)", letterSpacing: "0.15em" }}
              >
                {loading ? "LOGGING IN..." : "LOGIN"}
              </button>
            </div>
          </form>

          <p className="text-center text-white text-sm mt-5">
            New to Tadka Express?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-orange-400 font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}