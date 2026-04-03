import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon, Menu, X } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { dark, setDark } = useContext(ThemeContext);

  const links = [
    { label: "Home", href: "/" },
    { label: "Order", href: "#pricing" },
    { label: "How It Works", href: "#how" },
    { label: "About", href: "#about" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300
      ${dark
        ? "bg-[#0F0F0F]/80 border-b border-white/5 backdrop-blur-xl"
        : "bg-white/90 border-b border-gray-100 backdrop-blur-xl shadow-sm"
      }`}>
      
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* --- Logo (Left) --- */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 bg-orange-500 text-white flex items-center justify-center rounded-xl font-bold shadow-md shadow-orange-500/30 group-hover:rotate-6 transition-transform text-lg">
            🍲
          </div>
          <span className={`text-xl font-black tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>
            Tadka <span className="text-orange-400">Express</span>
          </span>
        </Link>

        {/* --- Desktop Links (Center - Hidden on Mobile) --- */}
        <div className={`hidden md:flex items-center gap-8 text-sm font-semibold ${dark ? "text-gray-300" : "text-gray-600"}`}>
          {links.map(l => (
            l.href.startsWith("#")
              ? <a key={l.label} href={l.href} className="hover:text-orange-500 transition-colors">{l.label}</a>
              : <Link key={l.label} to={l.href} className="hover:text-orange-500 transition-colors">{l.label}</Link>
          ))}
        </div>

        {/* --- Right Actions Group --- */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Theme Toggle (Visible on BOTH Desktop & Mobile) */}
          <button 
            onClick={() => setDark(!dark)}
            className={`p-2 rounded-lg transition-all active:scale-90 ${dark ? "bg-white/5 text-yellow-400 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            aria-label="Toggle Theme"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Desktop Only Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login"
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all
                ${dark ? "border-white/10 text-white hover:bg-white/5" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
              Login
            </Link>
            <Link to="/register"
              className="px-5 py-2 bg-orange-500 text-white text-sm font-bold rounded-full shadow-md shadow-orange-500/25 hover:bg-orange-400 hover:scale-105 transition-all">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle (Only visible on Mobile) */}
          <button 
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-lg transition-colors ${dark ? "text-white" : "text-gray-700"}`}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- Mobile Dropdown Menu --- */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 border-t
        ${open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}
        ${dark ? "bg-[#161616] border-white/5" : "bg-white border-gray-100"}`}>
        
        <div className="flex flex-col px-6 py-5 space-y-4">
          {links.map(l => (
            l.href.startsWith("#")
              ? <a key={l.label} href={l.href} onClick={() => setOpen(false)} className={`text-sm font-semibold transition-colors hover:text-orange-500 ${dark ? "text-gray-300" : "text-gray-700"}`}>{l.label}</a>
              : <Link key={l.label} to={l.href} onClick={() => setOpen(false)} className={`text-sm font-semibold transition-colors hover:text-orange-500 ${dark ? "text-gray-300" : "text-gray-700"}`}>{l.label}</Link>
          ))}
          
          <div className="flex gap-3 pt-2">
            <Link to="/login" onClick={() => setOpen(false)} 
              className={`flex-1 text-center py-2.5 rounded-full text-sm font-semibold border transition-all
                ${dark ? "border-white/10 text-white hover:bg-white/5" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
              Login
            </Link>
            <Link to="/register" onClick={() => setOpen(false)} 
              className="flex-1 text-center py-2.5 rounded-full bg-orange-500 text-white text-sm font-bold shadow-md shadow-orange-500/20 hover:bg-orange-400 active:scale-95 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;