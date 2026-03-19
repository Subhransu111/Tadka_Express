import { Link } from "react-router-dom";
import { getImage } from "../config/cloudinary";
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

// Meal photos array — replace src with your actual images
const MEALS = [
  { src: getImage("HERO_MEAL_1", "q_auto,f_auto,w_600")},
  { src: getImage("HERO_MEAL_2", "q_auto,f_auto,w_600")},
  { src: getImage("HERO_MEAL_3", "q_auto,f_auto,w_600")},
  { src: getImage("HERO_MEAL_4", "q_auto,f_auto,w_600") },
];

function StackedCards() {
  const [hovered, setHovered] = useState(false);
  const [active, setActive]   = useState(0);

  // When fanned out: each card gets a rotation + x offset
  const fanAngles = [-20, -7, 7, 20];
  const fanX      = [-145, -48, 48, 145];
  const fanY      = [18, 5, 5, 18]; // slight arc downward at edges

  return (
    <div
      className="relative flex justify-center items-center select-none"
      style={{ width: 380, height: 440 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {MEALS.map((meal, i) => {
        const isActive = i === active;

        const angle = hovered ? fanAngles[i] : (i - 1.5) * 3;
        const tx    = hovered ? fanX[i]      : (i - 1.5) * 7;
        const ty    = hovered ? fanY[i]      : -i * 7;
        const scale = hovered ? (isActive ? 1.1 : 0.9) : 1 - i * 0.03;
        const zIdx  = hovered ? (isActive ? 30 : 10 - i) : MEALS.length - i;

        return (
          <div
            key={i}
            onClick={() => setActive(i)}
            className="absolute cursor-pointer"
            style={{
              width: 300,
              height: 390,
              transform: `translateX(${tx}px) translateY(${ty}px) rotate(${angle}deg) scale(${scale})`,
              zIndex: zIdx,
              transition: "all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="w-full h-full rounded-[30px] overflow-hidden relative"
              style={{
                boxShadow:
                  isActive && hovered
                    ? "0 50px 90px rgba(154,52,18,0.6), 0 0 0 3px rgba(255,255,255,0.18)"
                    : "0 20px 50px rgba(0,0,0,0.45)",
              }}
            >
              {/* Photo */}
              <img
                src={meal.src}
                alt={meal.label}
                className="w-full h-full object-cover transition-all duration-500"
                style={{
                  filter:
                    isActive || !hovered
                      ? "brightness(1) saturate(1.1)"
                      : "brightness(0.65) saturate(0.8)",
                }}
              />

              {/* Bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              {/* Tag chip */}
              <div className="absolute top-4 left-4 bg-orange-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                {meal.tag}
              </div>

              {/* Active ring pulse */}
              {isActive && hovered && (
                <div className="absolute inset-0 rounded-[30px] ring-2 ring-orange-400/60 animate-pulse pointer-events-none" />
              )}

              {/* Meal info */}
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white font-black text-lg leading-tight drop-shadow-lg">
                  {meal.label}
                </p>
                {isActive && hovered && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-orange-300 text-xs font-bold tracking-wide">View dish →</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Dot indicators */}
      <div
        className="absolute flex gap-2 z-40"
        style={{ bottom: -34, left: "50%", transform: "translateX(-50%)" }}
      >
        {MEALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? 22 : 7,
              height: 7,
              background: i === active ? "#EA580C" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Hero() {
  const { dark } = useContext(ThemeContext);

  return (
    <section
      className={`relative min-h-screen overflow-hidden flex items-center ${
        dark ? "bg-[#0F0F0F]" : "bg-[#FFF8F2]"
      }`}
    >
      {/* ─── LEFT GHOST DECORATIVE IMAGE ─── */}
      <div className="absolute left-0 top-0 h-full w-[45%] pointer-events-none z-10 hidden md:block">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${getImage("HERO_MEAL_1", "q_auto,f_auto,w_800")})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: dark ? 0.06 : 0.09,
            filter: "blur(1px) saturate(0.4)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: dark
              ? "linear-gradient(to right, transparent 0%, #0F0F0F 80%)"
              : "linear-gradient(to right, transparent 0%, #FFF8F2 80%)",
          }}
        />
      </div>

      {/* ─── 3-D CURVED BLOB ─── */}
      {/* Depth shadow */}
      <div
        className="absolute hidden md:block"
        style={{
          top: "-8%", right: "-8%",
          width: "62%", height: "120%",
          background: "rgba(154, 52, 18, 0.35)",
          borderRadius: "120px 40px 180px 60px / 80px 120px 60px 140px",
          transform: "rotate(10deg) translateX(20px) translateY(20px)",
          filter: "blur(30px)",
          zIndex: 1,
        }}
      />
      {/* Main blob */}
      <div
        className="absolute hidden md:block"
        style={{
          top: "-12%", right: "-6%",
          width: "60%", height: "125%",
          background: "linear-gradient(145deg, #EA580C 0%, #C2410C 45%, #9A3412 100%)",
          borderRadius: "120px 40px 180px 60px / 80px 120px 60px 140px",
          transform: "rotate(8deg)",
          zIndex: 2,
          boxShadow: "inset -20px -20px 60px rgba(0,0,0,0.3), inset 10px 10px 40px rgba(255,150,80,0.2)",
        }}
      />
      {/* Highlight sheen */}
      <div
        className="absolute hidden md:block pointer-events-none"
        style={{
          top: "-5%", right: "5%",
          width: "45%", height: "60%",
          background: "linear-gradient(135deg, rgba(255,200,150,0.18) 0%, transparent 60%)",
          borderRadius: "100px 30px 140px 40px / 60px 100px 40px 120px",
          transform: "rotate(8deg)",
          zIndex: 3,
        }}
      />

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-6 py-28 md:py-36 flex flex-col md:flex-row items-center justify-between gap-16 relative z-20 w-full">

        {/* LEFT: Text */}
        <div className="max-w-lg text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-bold mb-7 border border-orange-200/60 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            #1 Tiffin Service in Bhubaneswar
          </div>

          <h1 className={`text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>
            Ghar ka khana,{" "}<br />
            <span className="relative inline-block text-orange-600">
              Delivered Daily.
              <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 300 10" preserveAspectRatio="none">
                <path d="M0 6 Q 37.5 0 75 6 Q 112.5 12 150 6 Q 187.5 0 225 6 Q 262.5 12 300 6"
                  stroke="#FBBF24" strokeWidth="3.5" fill="transparent" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className={`mt-8 text-lg leading-relaxed max-w-sm mx-auto md:mx-0 ${dark ? "text-gray-400" : "text-gray-600"}`}>
            Healthy, affordable, and delicious home-style meals delivered right
            to your doorstep. Perfect for students and busy professionals.
          </p>
          

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/register"
              className="px-9 py-4 bg-orange-600 text-white rounded-full font-bold shadow-xl shadow-orange-600/30 hover:bg-orange-700 hover:-translate-y-1 transition-all duration-300 text-center">
              Start Subscription →
            </Link>
            <Link to="/menu"
              className={`px-9 py-4 rounded-full font-bold border transition-all duration-300 text-center ${
                dark ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                     : "bg-white border-gray-200 text-gray-800 hover:bg-orange-50"
              }`}>
              View Menu
            </Link>
          </div>
        </div>

        {/* RIGHT: Stacked Cards */}
        <div className="flex-1 flex flex-col justify-center items-center py-12">
          {/* Ambient glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 460, height: 460,
              background: "radial-gradient(circle, rgba(234,88,12,0.22) 0%, transparent 70%)",
              filter: "blur(55px)",
              zIndex: 0,
            }}
          />

          <div className="relative z-10">
            <StackedCards />
          </div>

          {/* Hover hint */}
          <p className="mt-14 text-[11px] font-bold tracking-[0.2em] uppercase"
            style={{ color: "rgba(255,255,255,0.35)" }}>
            Hover to explore · Click to select
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;