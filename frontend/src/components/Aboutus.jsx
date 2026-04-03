import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

import { Leaf, UtensilsCrossed, Timer, ShieldCheck } from "lucide-react";
const FOOD_IMG = "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop";

const AboutUs = () => {
  const { dark } = useContext(ThemeContext);

  const stats = [
    { val: "500+", label: "Happy Customers" },
    { val: "2+",   label: "Years Serving" },
    { val: "15+",  label: "Menu Items" },
    { val: "4.8★", label: "Avg Rating" },
  ];

const values = [
    { 
      icon: <Leaf size={24} className="text-green-500" />, 
      title: "Fresh Ingredients",  
      desc: "We source fresh vegetables and proteins daily from local markets." 
    },
    { 
      icon: <UtensilsCrossed size={24} className="text-orange-500" />, 
      title: "Home Style Cooking", 
      desc: "Every meal is cooked with the same love and care as home." 
    },
    { 
      icon: <Timer size={24} className="text-blue-500" />, 
      title: "Always On Time",      
      desc: "We take punctuality seriously. Your meal arrives fresh, every time." 
    },
    { 
      icon: <ShieldCheck size={24} className="text-emerald-500" />, 
      title: "Hygiene First",       
      desc: "FSSAI certified kitchen with strict hygiene protocols daily." 
    },
  ];

  return (
    <section id="about" className={`relative py-24 px-6 overflow-hidden transition-colors
      ${dark ? "bg-[#0F0F0F]" : "bg-white"}`}>

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          
          <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
            About <span style={{ color: "#2d6a4f" }}>Tadka Express</span>
          </h2>
          <p className={`text-base max-w-xl mx-auto ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Started with a simple mission — bring the taste of home to every student and working professional in Bhubaneswar.
          </p>
        </div>

        {/* Two column layout */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">

          {/* Left — image */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl pointer-events-none"
              style={{ background: "rgba(45,106,79,0.08)", border: "1.5px solid rgba(45,106,79,0.15)" }} />
            <img src={FOOD_IMG} alt="Our Kitchen"
              className="relative z-10 w-full h-72 md:h-96 object-cover rounded-3xl shadow-2xl" />
            
          </div>

          {/* Right — text */}
          <div>
            <h3 className={`text-2xl md:text-3xl font-extrabold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>
              Ghar ka khana, <span style={{ color: "#2d6a4f" }}>delivered daily</span>
            </h3>
            <p className={`text-base leading-relaxed mb-4 ${dark ? "text-gray-400" : "text-gray-600"}`}>
              Tadka Express was born out of the frustration of eating unhealthy, expensive food every day. We believe everyone deserves a wholesome, homemade meal — regardless of how busy their schedule is.
            </p>
            <p className={`text-base leading-relaxed mb-7 ${dark ? "text-gray-400" : "text-gray-600"}`}>
              Based in Bhubaneswar, Odisha, we serve students, working professionals, and families with fresh, nutritious meals cooked daily in our hygienic kitchen.
            </p>

            

            <Link to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #2d6a4f, #1b4332)", boxShadow: "0 8px 24px rgba(45,106,79,0.3)" }}>
              Start Your Subscription →
            </Link>
          </div>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {values.map(({ icon, title, desc }) => (
            <div key={title}
              className={`rounded-2xl p-5 text-center transition-all hover:-translate-y-1
                ${dark ? "bg-[#161616] border border-white/[0.06]" : "bg-gray-50 border border-gray-100 hover:shadow-md"}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3
                ${dark ? "bg-white/[0.05]" : "bg-white shadow-sm"}`}
                style={{ border: "1.5px solid rgba(45,106,79,0.15)" }}>
                {icon}
              </div>
              <h4 className={`text-sm font-bold mb-1.5 ${dark ? "text-white" : "text-gray-900"}`}>{title}</h4>
              <p className={`text-xs leading-relaxed ${dark ? "text-gray-500" : "text-gray-500"}`}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;