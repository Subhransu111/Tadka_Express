import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const steps = [
  {
    step: "01",
    title: "Choose Your Plan",
    desc: "Select Basic for everyday comfort, Deluxe for premium choice, or Royal for the ultimate experience.",
    icon: "📋",
    color: "#2d6a4f",
    highlight: "Basic, Deluxe or Royal",
  },
  {
    step: "02",
    title: "Set Your Duration",
    desc: "Pick as little as 15 days or subscribe for the whole month. Pause or skip any day you want.",
    icon: "📅",
    color: "#ea580c",
    highlight: "Min. 15 days",
  },
  {
    step: "03",
    title: "Enjoy Fresh Meals",
    desc: "Get hot, fresh food delivered daily. Deluxe users select their meal every evening via WhatsApp.",
    icon: "🚚",
    color: "#7c3aed",
    highlight: "Daily at your door",
  },
];

const HowItWorks = () => {
  const { dark } = useContext(ThemeContext);

  return (
    <section id="how" className={`relative py-24 px-6 overflow-hidden transition-colors
      ${dark ? "bg-[#0a0a0a]" : "bg-white"}`}>

      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ background: "#2d6a4f" }} />

      {/* Dashed connector line */}
      <div className="absolute hidden md:block pointer-events-none"
        style={{
          top: "54%", left: "18%", right: "18%", height: 2,
          background: dark
            ? "repeating-linear-gradient(90deg,rgba(45,106,79,0.3) 0px,rgba(45,106,79,0.3) 12px,transparent 12px,transparent 24px)"
            : "repeating-linear-gradient(90deg,rgba(45,106,79,0.2) 0px,rgba(45,106,79,0.2) 12px,transparent 12px,transparent 24px)",
        }} />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4 border"
            style={{ background: "rgba(45,106,79,0.08)", borderColor: "rgba(45,106,79,0.2)", color: "#2d6a4f" }}>
            ✦ Simple Process
          </div>
          <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
            How It <span style={{ color: "#2d6a4f" }}>Works</span>
          </h2>
          <p className={`text-base max-w-md mx-auto ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Simple, straightforward process to get fresh meals at your doorstep every day.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-7 relative">
          {steps.map((s, i) => (
            <div key={i}
              className={`group relative rounded-3xl p-7 transition-all duration-300 hover:-translate-y-2
                ${dark ? "bg-[#161616] border border-white/[0.06]" : "bg-white border border-gray-100 shadow-sm hover:shadow-lg"}`}
              style={{ boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.3)" : undefined }}>

              {/* Step watermark */}
              <div className="absolute -top-3 -right-1 text-[80px] font-black leading-none pointer-events-none select-none opacity-[0.04]"
                style={{ color: s.color }}>
                {s.step}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                style={{ background: `${s.color}12`, border: `1.5px solid ${s.color}25` }}>
                {s.icon}
              </div>

              {/* Step badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold mb-3"
                style={{ background: `${s.color}12`, color: s.color, border: `1px solid ${s.color}25` }}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-black"
                  style={{ background: s.color }}>{i + 1}</span>
                Step {s.step}
              </div>

              <h3 className={`text-xl font-extrabold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>{s.title}</h3>
              <p className={`text-sm leading-relaxed mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>{s.desc}</p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: dark ? "rgba(255,255,255,0.04)" : `${s.color}08`,
                  color: dark ? "rgba(255,255,255,0.4)" : s.color,
                  border: `1px solid ${s.color}20`,
                }}>
                ✦ {s.highlight}
              </div>

              {/* Arrow between cards */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center rounded-full z-20 text-white text-xs font-black shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${s.color}, ${steps[i+1].color})` }}>
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white transition-all hover:scale-105 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #2d6a4f, #1b4332)", boxShadow: "0 12px 40px rgba(45,106,79,0.3)" }}>
            Get Started Today →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;