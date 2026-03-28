import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Search, MapPin } from "lucide-react";

// Food bowl image — Unsplash (replace with Cloudinary later)
const BOWL_IMG = "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop";
const BG_FOOD  = "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop";

function Hero() {
  const { dark } = useContext(ThemeContext);

  return (
    <section className={`relative min-h-screen overflow-hidden pt-16
      ${dark ? "bg-[#0F0F0F]" : "bg-[#f5f9f0]"}`}>

      {/* ── LEFT ghost bg image ── */}
      {!dark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url('${BG_FOOD}')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f5f9f0]/60 via-[#f5f9f0]/40 to-transparent" />
        </div>
      )}

      {/* ── RIGHT curved blob ── */}
      <div className="absolute top-0 right-0 h-full w-[52%] pointer-events-none hidden md:block">
        {/* Main teal/green curve */}
        <div className="absolute inset-0"
          style={{
            background: dark
              ? "linear-gradient(145deg, #1a2e1a 0%, #0d1f0d 100%)"
              : "linear-gradient(145deg, #2d6a4f 0%, #1b4332 100%)",
            borderRadius: "60% 0 0 60% / 50% 0 0 50%",
            clipPath: "ellipse(100% 100% at 100% 50%)",
          }} />
        {/* Lighter overlay for depth */}
        <div className="absolute inset-0 opacity-30"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
            borderRadius: "60% 0 0 60% / 50% 0 0 50%",
            clipPath: "ellipse(100% 100% at 100% 50%)",
          }} />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 min-h-[calc(100vh-64px)] flex flex-col md:flex-row items-center gap-10 py-16 relative z-10">

        {/* LEFT — text */}
        <div className="flex-1 max-w-xl">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-6 border"
            style={{
              background: dark ? "rgba(45,106,79,0.15)" : "rgba(45,106,79,0.1)",
              borderColor: dark ? "rgba(45,106,79,0.3)" : "rgba(45,106,79,0.25)",
              color: dark ? "#52b788" : "#2d6a4f",
            }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#2d6a4f" }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#2d6a4f" }} />
            </span>
            #1 Tiffin Service in Bhubaneswar
          </div>

          <h1 className={`text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight mb-5
            ${dark ? "text-white" : "text-gray-900"}`}>
            Ghar ka Khana,<br />
            <span style={{ color: "#2d6a4f" }}>Delivered</span>{" "}
            <span className={dark ? "text-white" : "text-gray-900"}>Fresh</span><br />
            <span className="text-orange-500">&amp; Hot</span>
          </h1>

          <p className={`text-base md:text-lg leading-relaxed max-w-md mb-8
            ${dark ? "text-gray-400" : "text-gray-600"}`}>
              Healthy , affordable , and delicious home-style meals delivered right to your doorstep. Perfect for students and busy professionals
          </p>

        </div>
{/* RIGHT — food bowl image on the curve */}
        <div className="flex-1 flex justify-center items-center relative md:justify-end">
          {/* Glow behind bowl */}
          <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{ background: "#2d6a4f" }} />
 
          {/* Bowl image — clean cutout style */}
          <div className="relative z-10"
            style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.35))" }}>
            <img
              src={BOWL_IMG}
              alt="Fresh meal bowl"
              className="w-80 h-80 md:w-100 md:h-100 object-cover rounded-full"
              style={{
                boxShadow: "0 25px 80px rgba(0,0,0,0.3)",
                border: "5px solid rgba(255,255,255,0.15)",
              }}
            />
 
            {/* Top-right floating food image */}
            <div className="absolute -top-20 -right-30 w-50 h-50 rounded-full overflow-hidden shadow-2xl"
              style={{ border: "3px solid rgba(255,255,255,0.3)" }}>
              <img src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=200&auto=format&fit=crop"
                alt="Dal" className="w-full h-full object-cover" />
            </div>
 
            {/* Bottom-left floating food image */}
            <div className="absolute -bottom-6 -left-40 w-50 h-50 rounded-full overflow-hidden shadow-2xl"
              style={{ border: "3px solid rgba(255,255,255,0.3)" }}>
              <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=200&auto=format&fit=crop"
                alt="Biryani" className="w-full h-full object-cover" />
            </div>
 
            {/* Bottom-right floating food image */}
            <div className="absolute -bottom-10 -right-22 w-40 h-40 rounded-full overflow-hidden shadow-2xl"
              style={{ border: "3px solid rgba(255,255,255,0.3)" }}>
              <img src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=200&auto=format&fit=crop"
                alt="Curry" className="w-full h-full object-cover" />
            </div>
 
           
            
          </div>
        </div>
      </div>

     
    </section>
  );
}

export default Hero;