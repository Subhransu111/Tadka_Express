import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const reviews = [
  { name: "Rahul Sharma",    role: "Software Engineer",    text: "Tadka Express has completely changed my daily routine. The food tastes homemade, fresh, and always arrives on time. Highly recommended!", rating: 5 },
  { name: "Priya Nayak",     role: "Medical Student",      text: "As a hostel student I was spending so much on food. Now I eat healthy every day at ₹90. Best decision I made this year!", rating: 5 },
  { name: "Ankit Mohanty",   role: "Working Professional", text: "The Deluxe plan is worth every rupee. I get to choose my meal every evening and it arrives hot the next day. Love it!", rating: 5 },
];

const Testimonials = () => {
  const { dark } = useContext(ThemeContext);

  return (
    <section className={`py-24 px-6 transition-colors ${dark ? "bg-[#0a0a0a]" : "bg-[#f5f9f0]"}`}>
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4 border"
            style={{ background: "rgba(45,106,79,0.08)", borderColor: "rgba(45,106,79,0.2)", color: "#2d6a4f" }}>
            ⭐ Customer Reviews
          </div>
          <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
            What Our <span style={{ color: "#2d6a4f" }}>Customers Say</span>
          </h2>
          <p className={`text-base ${dark ? "text-gray-400" : "text-gray-500"}`}>Real feedback from real customers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i}
              className={`rounded-3xl p-6 transition-all hover:-translate-y-1
                ${dark ? "bg-[#161616] border border-white/[0.06]" : "bg-white border border-gray-100 shadow-sm hover:shadow-md"}`}>
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array(r.rating).fill(0).map((_, j) => (
                  <span key={j} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className={`text-sm leading-relaxed mb-5 italic ${dark ? "text-gray-300" : "text-gray-600"}`}>
                "{r.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #2d6a4f, #1b4332)" }}>
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>{r.name}</p>
                  <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;