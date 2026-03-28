import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import API_BASE from "../config/api";

const STATIC_PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 90,
    tag: null,
    emoji: "🍱",
    tagline: "Perfect for everyday comfort",
    color: "#2d6a4f",
    highlights: [
      "Rice / Roti daily",
      "Dal + Veg Curry",
      "Raita / Achar / Salad",
      "Free Delivery",
      "Skip any day",
    ],
  },
  {
    id: "deluxe",
    name: "Deluxe",
    price: 130,
    tag: "Most Popular",
    emoji: "👑",
    tagline: "Premium choice, daily selection",
    color: "#ea580c",
    highlights: [
      "Everything in Basic",
      "Paneer / Mushroom Option",
      "Egg / Chicken / Fish Choice",
      "Daily Meal Selection via WhatsApp",
      "Priority Delivery",
    ],
  },
  {
    id: "royal",
    name: "Royal",
    price: 155,
    tag: "Premium",
    emoji: "🎖️",
    tagline: "7 rotating premium menus",
    color: "#7c3aed",
    highlights: [
      "Everything in Deluxe",
      "7 Rotating Premium Sets",
      "Special Weekend Menu",
      "Dessert included",
      "Dedicated Support",
    ],
  },
];

function CheckIcon({ color }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="8" cy="8" r="8" fill={color} fillOpacity="0.12" />
      <path d="M4.5 8L7 10.5L11.5 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PricingSection() {
  const { dark } = useContext(ThemeContext);
  const [prices, setPrices] = useState({ basicPerDay: 90, deluxePerDay: 130 });

  // Fetch live pricing from backend settings
  useEffect(() => {
    fetch(`${API_BASE}/api/settings`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.settings?.pricing) {
          setPrices(d.settings.pricing);
        }
      })
      .catch(() => {}); // silently fallback to static
  }, []);

  const plans = STATIC_PLANS.map(p => ({
    ...p,
    price: p.id === "basic" ? prices.basicPerDay : p.id === "deluxe" ? prices.deluxePerDay : p.price,
  }));

  return (
    <section id="pricing" className={`relative py-24 px-6 overflow-hidden transition-colors duration-500
      ${dark ? "bg-[#0F0F0F]" : "bg-[#f5f9f0]"}`}>

      {/* bg circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "#2d6a4f" }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "#ea580c" }} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4 border"
            style={{
              background: "rgba(45,106,79,0.08)",
              borderColor: "rgba(45,106,79,0.2)",
              color: "#2d6a4f",
            }}>
            💰 Flexible Plans
          </div>
          <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
            Choose Your <span style={{ color: "#2d6a4f" }}>Plan</span>
          </h2>
          <p className={`text-base max-w-lg mx-auto ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Flexible subscriptions for every appetite — pause or cancel anytime. Minimum 15 days.
          </p>
        </div>

        {/* Cards — 3 columns */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {plans.map((plan) => {
            const isPopular = plan.tag === "Most Popular";
            const isPremium = plan.tag === "Premium";

            return (
              <div key={plan.id}
                className={`relative rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2
                  ${isPopular ? "" : dark ? "border border-white/[0.07]" : "border border-gray-200"}`}
                style={{
                  background: isPopular
                    ? `linear-gradient(160deg, ${plan.color}, #c2410c)`
                    : isPremium
                    ? dark ? "linear-gradient(145deg, #1a1020, #160d24)" : "linear-gradient(145deg, #faf5ff, #f3e8ff)"
                    : dark ? "linear-gradient(145deg, #161616, #1c1c1c)" : "#ffffff",
                  boxShadow: isPopular
                    ? `0 25px 60px ${plan.color}40`
                    : isPremium
                    ? `0 25px 60px ${plan.color}25`
                    : dark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.06)",
                }}>

                {/* Tag banner */}
                {plan.tag && (
                  <div className="text-center text-[11px] font-black py-2 uppercase tracking-widest"
                    style={{
                      background: isPopular ? "rgba(0,0,0,0.15)" : `${plan.color}20`,
                      color: isPopular ? "rgba(255,255,255,0.9)" : plan.color,
                    }}>
                    ✦ {plan.tag} ✦
                  </div>
                )}

                <div className="p-7 flex flex-col flex-1">
                  {/* Plan header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: isPopular ? "rgba(255,255,255,0.15)" : `${plan.color}15` }}>
                      {plan.emoji}
                    </div>
                    <div>
                      <h3 className={`text-lg font-extrabold ${isPopular ? "text-white" : dark ? "text-white" : "text-gray-900"}`}>
                        {plan.name} Plan
                      </h3>
                      <p className={`text-xs ${isPopular ? "text-white/60" : dark ? "text-gray-500" : "text-gray-400"}`}>
                        {plan.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <span className={`text-4xl font-black ${isPopular ? "text-white" : ""}`}
                      style={{ color: isPopular ? undefined : plan.color }}>
                      ₹{plan.price}
                    </span>
                    <span className={`text-sm font-medium ml-1 ${isPopular ? "text-white/60" : dark ? "text-gray-500" : "text-gray-400"}`}>
                      /day
                    </span>
                    <p className={`text-xs mt-1 ${isPopular ? "text-white/50" : dark ? "text-gray-600" : "text-gray-400"}`}>
                      Min. 15 days · ₹{plan.price * 15} for 15 days
                    </p>
                  </div>

                  <div className="h-px mb-5"
                    style={{ background: isPopular ? "rgba(255,255,255,0.15)" : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1 mb-7">
                    {plan.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm"
                        style={{ color: isPopular ? "rgba(255,255,255,0.88)" : dark ? "#d1d5db" : "#374151" }}>
                        <CheckIcon color={isPopular ? "#fff" : plan.color} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link to="/register"
                    className="block text-center py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                    style={
                      isPopular
                        ? { background: "#fff", color: plan.color, boxShadow: "0 6px 20px rgba(0,0,0,0.2)" }
                        : {
                            background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
                            color: "#fff",
                            boxShadow: `0 6px 20px ${plan.color}35`,
                          }
                    }>
                    Select {plan.name} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-5">
          {["Free Delivery", "Pause Anytime", "No Hidden Charges", "Daily Fresh", "Min. 15 Days"].map(t => (
            <div key={t} className="flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingSection;