import { Link } from "react-router-dom";
import { useState, useContext } from "react"; 
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon, Menu, X } from "lucide-react"; 

function Navbar() {
  const [open, setOpen] = useState(false);
  const { dark, setDark } = useContext(ThemeContext);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 backdrop-blur-md 
  ${dark 
    ? "bg-[#0F0F0F]/40 border-b border-white/5" 
    : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-orange-600 text-white flex items-center justify-center rounded-xl font-bold shadow-lg group-hover:rotate-12 transition-transform">
            🍲
          </div>
          <span className={`text-2xl font-black tracking-tighter transition-colors
            ${dark ? "text-white" : "text-[#3E2723]"}`}>
            TADKA <span className="text-orange-600">EXPRESS</span>
          </span>
        </Link>

        {/* Desktop Links - Dynamic Colors */}
        <div className={`hidden md:flex items-center gap-8 font-bold text-sm tracking-widest
          ${dark ? "text-gray-300" : "text-gray-700"}`}>
          <a href="#how" className="hover:text-orange-600 transition">HOW IT WORKS</a>
          <a href="#pricing" className="hover:text-orange-600 transition">PRICING</a>
          <a href="#menu" className="hover:text-orange-600 transition">MENU</a>
        </div>

        {/* Desktop Buttons & Toggle */}
        <div className="hidden md:flex items-center gap-5">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setDark(!dark)}
            className={`p-2.5 rounded-full transition-all duration-300 
              ${dark ? "bg-white/5 text-yellow-400 hover:bg-white/10" : "bg-orange-50 text-orange-600 hover:bg-orange-100 rotate-90"}`}
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link
            to="/login"
            className={`px-6 py-2 rounded-full font-bold transition-all border
              ${dark 
                ? "border-white/10 text-white hover:bg-white/5" 
                : "border-orange-200 text-[#3E2723] hover:bg-orange-50"}`}
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-7 py-2.5 bg-orange-600 text-white font-bold rounded-full shadow-lg shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden text-2xl transition-colors ${dark ? "text-white" : "text-gray-800"}`}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu - Artistic & Theme Aware */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 border-t
        ${open ? "max-h-96 opacity-100 py-6" : "max-h-0 opacity-0 py-0"}
        ${dark ? "bg-[#161616] border-white/5" : "bg-white border-orange-100"}`}>
        
        <div className="flex flex-col px-8 space-y-5 font-bold">
          <a href="#how" className={`${dark ? "text-gray-300" : "text-gray-700"}`}>How It Works</a>
          <a href="#pricing" className={`${dark ? "text-gray-300" : "text-gray-700"}`}>Pricing</a>
          <a href="#menu" className={`${dark ? "text-gray-300" : "text-gray-700"}`}>Menu</a>

          <div className="pt-4 flex flex-col gap-4">
            <Link to="/login" className="text-orange-600">Login</Link>
            <Link to="/register" className="bg-orange-600 text-white text-center py-3 rounded-2xl">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;