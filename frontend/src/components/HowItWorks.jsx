import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const steps = [
  {
    step: "01",
    title: "Choose Your Plan",
    desc: "Select Basic for everyday comfort or Deluxe for premium ingredients. Customize protein preferences anytime.",
    icon: "📋",
    accent: "#EA580C",
    highlight: "Basic or Deluxe",
  },
  {
    step: "02",
    title: "Set Your Duration",
    desc: "Pick as little as 15 days or subscribe for the whole month. Pause or resume whenever you want.",
    icon: "📅",
    accent: "#C2410C",
    highlight: "15 days or monthly",
  },
  {
    step: "03",
    title: "Enjoy Fresh Meals",
    desc: "Get hot, fresh food delivered daily at your preferred time. No compromises on quality or taste.",
    icon: "🚚",
    accent: "#9A3412",
    highlight: "Daily at your door",
  },
];

const HowItWorks = () => {
  const { dark } = useContext(ThemeContext);

  return (
    <section
      id="how"
      className={`relative py-28 px-6 md:px-12 overflow-hidden transition-colors duration-500 ${
        dark ? "bg-[#0A0A0A]" : "bg-[#FFF8F2]"
      }`}
    >
      {/* ── Background decorative elements ── */}
      {/* Large faint circle top-right */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-15%", right: "-10%",
          width: 500, height: 500,
          borderRadius: "50%",
          background: dark
            ? "radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      {/* Faint circle bottom-left */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-10%", left: "-8%",
          width: 400, height: 400,
          borderRadius: "50%",
          background: dark
            ? "radial-gradient(circle, rgba(154,52,18,0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(154,52,18,0.08) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Connecting dashed line between cards (desktop only) */}
      <div
        className="absolute hidden md:block pointer-events-none"
        style={{
          top: "54%",
          left: "16%",
          right: "16%",
          height: 2,
          background: dark
            ? "repeating-linear-gradient(90deg, rgba(234,88,12,0.3) 0px, rgba(234,88,12,0.3) 12px, transparent 12px, transparent 24px)"
            : "repeating-linear-gradient(90deg, rgba(234,88,12,0.25) 0px, rgba(234,88,12,0.25) 12px, transparent 12px, transparent 24px)",
          zIndex: 0,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Section Header ── */}
        <div className="text-center mb-20">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 border text-sm font-bold"
            style={{
              background: dark ? "rgba(234,88,12,0.1)" : "rgba(234,88,12,0.08)",
              borderColor: dark ? "rgba(234,88,12,0.25)" : "rgba(234,88,12,0.2)",
              color: "#EA580C",
            }}>
            
          </div>

          <h2 className={`text-5xl md:text-6xl font-black tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>
            How It{" "}
            <span className="relative inline-block">
              <span className="text-orange-600">Works</span>
              {/* Underline accent */}
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
                <path d="M0 4 Q 50 8 100 4 Q 150 0 200 4"
                  stroke="#FBBF24" strokeWidth="3" fill="transparent" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className={`mt-5 text-lg max-w-xl mx-auto ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Simple, straightforward process to get fresh meals at your doorstep
          </p>
        </div>

        {/* ── Steps ── */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((s, i) => (
            <div
              key={i}
              className="group relative rounded-[28px] p-8 transition-all duration-500 hover:-translate-y-3 cursor-default"
              style={{
                background: dark
                  ? "linear-gradient(145deg, #161616, #1a1a1a)"
                  : "linear-gradient(145deg, #ffffff, #fff4ee)",
                border: dark
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid rgba(234,88,12,0.12)",
                boxShadow: dark
                  ? "0 4px 24px rgba(0,0,0,0.4)"
                  : "0 4px 24px rgba(234,88,12,0.08)",
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow: `0 0 0 2px ${s.accent}55, 0 20px 60px ${s.accent}25`,
                }}
              />

              {/* Giant step number watermark */}
              <div
                className="absolute -top-4 -right-2 text-[96px] font-black leading-none pointer-events-none select-none"
                style={{ color: s.accent, opacity: dark ? 0.07 : 0.06 }}
              >
                {s.step}
              </div>

              {/* Icon circle */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: `linear-gradient(135deg, ${s.accent}22, ${s.accent}11)`,
                  border: `1.5px solid ${s.accent}33`,
                }}
              >
                {s.icon}
              </div>

              {/* Step pill */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{
                  background: `${s.accent}18`,
                  color: s.accent,
                  border: `1px solid ${s.accent}30`,
                }}
              >
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-black"
                  style={{ background: s.accent }}
                >
                  {i + 1}
                </span>
                Step {s.step}
              </div>

              {/* Title */}
              <h3 className={`text-2xl font-extrabold mb-3 tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>
                {s.title}
              </h3>

              {/* Desc */}
              <p className={`text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}>
                {s.desc}
              </p>

              {/* Highlight chip */}
              <div
                className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: dark ? "rgba(255,255,255,0.04)" : "rgba(234,88,12,0.06)",
                  color: dark ? "rgba(255,255,255,0.5)" : "#92400E",
                  border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(234,88,12,0.15)",
                }}
              >
                ✦ {s.highlight}
              </div>

              {/* Bottom connector arrow (not on last card) */}
              {i < steps.length - 1 && (
                <div
                  className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full z-20 text-white text-sm font-black shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${s.accent}, ${steps[i + 1].accent})` }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-20 text-center">
          <p className={`mb-6 text-base ${dark ? "text-gray-500" : "text-gray-400"}`}>
            Ready to transform your daily meals?
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #EA580C, #C2410C)",
              boxShadow: "0 16px 48px rgba(234,88,12,0.35)",
            }}
          >
            <span>Get Started Today</span>
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;