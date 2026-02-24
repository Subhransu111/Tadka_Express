import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const plans = [
  {
    name: "Basic",
    price: "₹90",
    per: "/day",
    tag: null,
    accent: "#EA580C",
    emoji: "🍱",
    tagline: "Perfect for everyday comfort",
    highlights: [
      "Rice / Roti",
      "Dal + Veg Curry",
      "Raita / Achar / Salad",
      "Free Delivery",
    ],
  },
  {
    name: "Deluxe",
    price: "₹130",
    per: "/day",
    tag: "Most Popular",
    accent: "#C2410C",
    emoji: "👑",
    tagline: "Premium ingredients, more choice",
    highlights: [
      "Everything in Basic",
      "Paneer / Mushroom Choice",
      "Egg / Chicken / Fish Option",
      "Daily Item Selection",
    ],
  },
];

function CheckIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="8" cy="8" r="8" fill={color} fillOpacity="0.15" />
      <path d="M4.5 8L7 10.5L11.5 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PricingSection() {
  const { dark } = useContext(ThemeContext);

  return (
    <section
      id="pricing"
      className={`relative py-28 px-6 overflow-hidden transition-colors duration-500 ${
        dark ? "bg-[#0F0F0F]" : "bg-[#FFF4EC]"
      }`}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(234,88,12,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-5 border"
            style={{
              background: dark ? "rgba(234,88,12,0.1)" : "rgba(234,88,12,0.08)",
              borderColor: "rgba(234,88,12,0.25)",
              color: "#EA580C",
            }}
          >
            
          </div>

          <h2 className={`text-5xl md:text-6xl font-black tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>
            Choose Your{" "}
            <span className="relative inline-block">
              <span className="text-orange-600">Plan</span>
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 160 8" preserveAspectRatio="none">
                <path d="M0 4 Q 40 8 80 4 Q 120 0 160 4"
                  stroke="#FBBF24" strokeWidth="3" fill="transparent" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className={`mt-5 text-lg max-w-xl mx-auto ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Flexible subscriptions for every appetite — pause or cancel anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => {
            const isPopular = plan.tag === "Most Popular";

            return (
              <div
                key={i}
                className="relative rounded-[28px] overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2"
                style={{
                  background: isPopular
                    ? "linear-gradient(160deg, #EA580C, #9A3412)"
                    : dark
                    ? "linear-gradient(145deg, #161616, #1c1c1c)"
                    : "linear-gradient(145deg, #ffffff, #fff8f4)",
                  border: isPopular
                    ? "none"
                    : dark
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "1px solid rgba(234,88,12,0.15)",
                  boxShadow: isPopular
                    ? "0 30px 80px rgba(194,65,12,0.4)"
                    : dark
                    ? "0 8px 32px rgba(0,0,0,0.4)"
                    : "0 8px 32px rgba(234,88,12,0.1)",
                }}
              >
                {/* Popular tag */}
                {plan.tag && (
                  <div
                    className="text-center text-xs font-black py-2 tracking-widest uppercase"
                    style={{ background: "rgba(0,0,0,0.2)", color: "rgba(255,255,255,0.9)" }}
                  >
                    ✦ {plan.tag} ✦
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  {/* Plan header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ background: isPopular ? "rgba(255,255,255,0.15)" : `${plan.accent}18` }}
                    >
                      {plan.emoji}
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold"
                        style={{ color: isPopular ? "#fff" : dark ? "#fff" : "#1a1a1a" }}>
                        {plan.name} Plan
                      </h3>
                      <p className="text-xs font-medium"
                        style={{ color: isPopular ? "rgba(255,255,255,0.6)" : dark ? "#6b7280" : "#9ca3af" }}>
                        {plan.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-5xl font-black"
                      style={{ color: isPopular ? "#fff" : plan.accent }}>
                      {plan.price}
                    </span>
                    <span className="text-sm font-semibold ml-1"
                      style={{ color: isPopular ? "rgba(255,255,255,0.6)" : dark ? "#6b7280" : "#9ca3af" }}>
                      {plan.per}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="mb-5 h-px"
                    style={{
                      background: isPopular
                        ? "rgba(255,255,255,0.15)"
                        : dark ? "rgba(255,255,255,0.06)" : "rgba(234,88,12,0.1)",
                    }}
                  />

                  {/* Highlights — short list only */}
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.highlights.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm font-medium"
                        style={{ color: isPopular ? "rgba(255,255,255,0.88)" : dark ? "#d1d5db" : "#374151" }}>
                        <CheckIcon color={isPopular ? "#fff" : plan.accent} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* See full menu link */}
                  <Link
                    to="/menu"
                    className="text-center text-xs font-semibold mb-4 underline underline-offset-2 opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: isPopular ? "#fff" : plan.accent }}
                  >
                    See full menu details →
                  </Link>

                  {/* CTA */}
                  <Link
                    to="/register"
                    className="block text-center py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
                    style={
                      isPopular
                        ? { background: "#fff", color: "#C2410C", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }
                        : {
                            background: "linear-gradient(135deg, #EA580C, #9A3412)",
                            color: "#fff",
                            boxShadow: "0 8px 24px rgba(234,88,12,0.35)",
                          }
                    }
                  >
                    Select {plan.name} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom trust line */}
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {["Free Delivery", "Pause Anytime", "No Hidden Charges", "Daily Fresh"].map((t) => (
            <div key={t} className="flex items-center gap-2 text-sm font-semibold"
              style={{ color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
              {t}
            </div>
          ))}
        </div>

        {/* Royal plan teaser */}
        <div
          className="mt-10 mx-auto max-w-xl rounded-2xl px-6 py-4 flex items-center justify-between gap-4"
          style={{
            background: dark ? "rgba(234,88,12,0.08)" : "rgba(234,88,12,0.07)",
            border: "1px dashed rgba(234,88,12,0.3)",
          }}
        >
          <div>
            <p className="font-bold text-sm" style={{ color: "#EA580C" }}>🎖️ Royal Plan available too!</p>
            <p className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>
              7 rotating premium menus · ₹140–170/day
            </p>
          </div>
          <Link
            to="/menu"
            className="shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #EA580C, #9A3412)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(234,88,12,0.3)",
            }}
          >
            View All Plans →
          </Link>
        </div>

      </div>
    </section>
  );
}

export default PricingSection;