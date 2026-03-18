import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg-food.jpg";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", phone: "", email: "", password: "", confirmPassword: "",
    street: "", landmark: "", pincode: "", referral: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: basic info, Step 2: address

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required");
    if (!/^[6-9]\d{9}$/.test(form.phone)) return setError("Enter a valid 10-digit Indian phone number");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
          password: form.password,
          referredByCode: form.referral || undefined,
          address: {
            street: form.street || undefined,
            landmark: form.landmark || undefined,
            pincode: form.pincode || undefined,
          }
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
        localStorage.setItem("user", JSON.stringify({
          _id: data._id,
          name: data.name,
          role: data.role,
          referralCode: data.referralCode,
        }));
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
      <div className="absolute inset-0 bg-[#1a1a1a]" />
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})`, opacity: 0.18 }} />

      {/* Logo */}
      <div className="relative z-10 px-8 pt-6">
        <h1 className="text-3xl font-extrabold tracking-wide">
          <span className="text-white">TADKA </span>
          <span className="text-orange-500">EXPRESS</span>
        </h1>
        <svg width="155" height="14" viewBox="0 0 155 14" className="mt-1" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 10 C18 5, 38 12, 58 8 C78 4, 98 11, 118 7 C132 4, 144 9, 153 7" stroke="#c8a800" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 11 C22 7, 42 13, 62 9 C82 5, 102 12, 122 8 C135 5, 146 10, 153 8" stroke="#c8a800" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeOpacity="0.45" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center py-8">
        <div className="w-full max-w-md rounded-xl px-10 py-8" style={{ background: "rgba(55,50,45,0.92)" }}>

          <h2 className="text-center text-3xl font-extrabold text-white mb-2" style={{ letterSpacing: "0.2em" }}>
            REGISTER
          </h2>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-8 h-1.5 rounded-full transition-colors ${step === 1 ? "bg-orange-500" : "bg-orange-500"}`} />
            <div className={`w-8 h-1.5 rounded-full transition-colors ${step === 2 ? "bg-orange-500" : "bg-white/20"}`} />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded-lg text-sm text-center mb-4">
              {error}
            </div>
          )}

          {/* ── Step 1: Basic Info ── */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-white text-sm mb-1">Full Name <span className="text-orange-400">*</span></label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder="Full Name"
                  className="w-full rounded-lg px-4 py-3 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ background: "#e8e0d8" }} />
              </div>
              <div>
                <label className="block text-white text-sm mb-1">Phone Number <span className="text-orange-400">*</span></label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                  placeholder="10-digit mobile number"
                  className="w-full rounded-lg px-4 py-3 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ background: "#d6cfc7" }} />
              </div>
              <div>
                <label className="block text-white text-sm mb-1">Email <span className="text-white/40 text-xs">(optional)</span></label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full rounded-lg px-4 py-3 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ background: "#d6cfc7" }} />
              </div>
              <div>
                <label className="block text-white text-sm mb-1">Password <span className="text-orange-400">*</span></label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required
                  placeholder="Min. 6 characters"
                  className="w-full rounded-lg px-4 py-3 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ background: "#d6cfc7" }} />
              </div>
              <div>
                <label className="block text-white text-sm mb-1">Confirm Password <span className="text-orange-400">*</span></label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required
                  placeholder="Re-enter password"
                  className="w-full rounded-lg px-4 py-3 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ background: "#d6cfc7" }} />
              </div>
              <div className="pt-1">
                <button type="submit"
                  className="w-full rounded-full py-3 text-white font-extrabold text-base tracking-widest transition-all duration-200 hover:brightness-110 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #ff6a00, #e65c00)" }}>
                  NEXT →
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-white/60 text-xs text-center mb-2">Add your delivery address (can be updated later)</p>
              <div>
                <label className="block text-white text-sm mb-1">Street / Area</label>
                <input type="text" name="street" value={form.street} onChange={handleChange}
                  placeholder="e.g. 42 MG Road, Lakshmisagar"
                  className="w-full rounded-lg px-4 py-3 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ background: "#e8e0d8" }} />
              </div>
              <div>
                <label className="block text-white text-sm mb-1">Landmark</label>
                <input type="text" name="landmark" value={form.landmark} onChange={handleChange}
                  placeholder="e.g. Near City Mall"
                  className="w-full rounded-lg px-4 py-3 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ background: "#d6cfc7" }} />
              </div>
              <div>
                <label className="block text-white text-sm mb-1">Pincode</label>
                <input type="text" name="pincode" value={form.pincode} onChange={handleChange}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  className="w-full rounded-lg px-4 py-3 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ background: "#d6cfc7" }} />
              </div>
              <div>
                <label className="block text-white text-sm mb-1">Referral Code <span className="text-white/40 text-xs">(optional)</span></label>
                <input type="text" name="referral" value={form.referral} onChange={handleChange}
                  placeholder="e.g. TADKA-A1B2C3"
                  className="w-full rounded-lg px-4 py-3 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ background: "#d6cfc7" }} />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep(1)}
                  className="w-1/3 rounded-full py-3 text-white font-bold text-sm border border-white/30 hover:bg-white/10 transition-all">
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 rounded-full py-3 text-white font-extrabold text-base tracking-widest transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #ff6a00, #e65c00)" }}>
                  {loading ? "REGISTERING..." : "REGISTER"}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-white text-sm mt-5">
            Already Have an Account?{" "}
            <button onClick={() => navigate("/login")} className="text-orange-400 font-semibold hover:underline">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}