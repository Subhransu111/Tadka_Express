import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { Menu, Search, Bell, Sun, Moon, ChevronDown, LogOut, User } from "lucide-react";

export default function TopNavbar({ onMenuToggle }) {
    const { dark, setDark } = useContext(ThemeContext);
    const [searchFocused, setSearchFocused] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = storedUser?.name || "User";
    const userInitial = userName.charAt(0).toUpperCase();
    const roleBadge = storedUser?.role === "admin" ? "Admin" : "Member";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header className={`sticky top-0 z-30 w-full px-4 md:px-6 py-3 flex items-center justify-between gap-4 backdrop-blur-xl transition-colors duration-300
            ${dark ? "bg-[#0f0f0f]/90 border-b border-white/[0.06]" : "bg-white/90 border-b border-gray-100"}`}>

            {/* Left */}
            <div className="flex items-center gap-3 flex-1">
                <button onClick={onMenuToggle}
                    className={`lg:hidden p-2 rounded-xl transition-colors ${dark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                    <Menu className="w-5 h-5" />
                </button>
                <div className={`relative hidden sm:flex items-center flex-1 max-w-sm transition-all duration-300 ${searchFocused ? "max-w-md" : ""}`}>
                    <Search className={`absolute left-3 w-4 h-4 transition-colors ${searchFocused ? "text-orange-500" : dark ? "text-gray-500" : "text-gray-400"}`} />
                    <input type="text" placeholder="Search orders, food..."
                        onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                        className={`w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-all duration-300
                            ${dark
                                ? "bg-white/[0.06] text-gray-200 placeholder-gray-500 border border-white/[0.08] focus:border-orange-500/40 focus:bg-white/10"
                                : "bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 focus:border-orange-300 focus:bg-white focus:shadow-sm focus:shadow-orange-100"
                            }`} />
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5">
                {/* Bell */}
                <button className={`relative p-2.5 rounded-xl transition-colors
                    ${dark ? "hover:bg-white/10 text-gray-400 hover:text-orange-400" : "hover:bg-gray-100 text-gray-500 hover:text-orange-500"}`}>
                    <Bell className="w-4.5 h-4.5" style={{ width: "1.1rem", height: "1.1rem" }} />
                    <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 bg-orange-500 ${dark ? "border-[#0f0f0f]" : "border-white"}`} />
                </button>

                {/* Theme toggle */}
                <button onClick={() => setDark(!dark)}
                    className={`p-2.5 rounded-xl transition-all duration-200
                        ${dark ? "hover:bg-white/10 text-orange-400" : "hover:bg-gray-100 text-amber-500"}`}>
                    {dark ? <Sun className="w-4.5 h-4.5" style={{ width: "1.1rem", height: "1.1rem" }} />
                           : <Moon className="w-4.5 h-4.5" style={{ width: "1.1rem", height: "1.1rem" }} />}
                </button>

                {/* Divider */}
                <div className={`w-px h-5 mx-1 ${dark ? "bg-white/10" : "bg-gray-200"}`} />

                {/* User dropdown */}
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl transition-colors
                            ${dark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-sm font-bold text-white shadow-sm shadow-orange-500/20">
                            {userInitial}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className={`text-sm font-semibold leading-tight ${dark ? "text-gray-100" : "text-gray-900"}`}>
                                {userName.split(" ")[0]}
                            </p>
                            <p className="text-[10px] font-medium tracking-wide text-orange-400 uppercase">{roleBadge}</p>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 hidden md:block transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""} ${dark ? "text-gray-500" : "text-gray-400"}`} />
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                            <div className={`absolute right-0 top-full mt-2 w-44 rounded-2xl shadow-xl border py-1.5 z-50
                                ${dark ? "bg-[#1a1a1a] border-white/[0.08] shadow-black/60" : "bg-white border-gray-100 shadow-gray-200/80"}`}>
                                {/* User info header */}
                                <div className={`px-4 py-2.5 mb-1 border-b ${dark ? "border-white/[0.06]" : "border-gray-100"}`}>
                                    <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{userName}</p>
                                    <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>{roleBadge}</p>
                                </div>
                                <button onClick={() => { setDropdownOpen(false); navigate("/dashboard/profile"); }}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2
                                        ${dark ? "text-gray-300 hover:bg-white/[0.06]" : "text-gray-700 hover:bg-gray-50"}`}>
                                    <User className="w-3.5 h-3.5" />
                                    My Profile
                                </button>
                                <div className={`my-1 border-t ${dark ? "border-white/[0.06]" : "border-gray-100"}`} />
                                <button onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-red-400 hover:bg-red-500/10 transition-colors rounded-b-xl">
                                    <LogOut className="w-3.5 h-3.5" />
                                    Sign out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}