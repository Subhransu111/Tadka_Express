import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import {
    LayoutDashboard, UtensilsCrossed, CalendarCheck,
    Users, Image, Settings, LogOut, Flame, X, Menu,
    Sun, Moon, ChevronDown, Bike
} from "lucide-react";

const navItems = [
    { label: "Dashboard",     icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Deliveries",    icon: Bike,            path: "/admin/deliveries" },
    { label: "Subscriptions", icon: CalendarCheck,   path: "/admin/subscriptions" },
    { label: "Menu",          icon: UtensilsCrossed, path: "/admin/menu" },
    { label: "Users",         icon: Users,           path: "/admin/users" },
    { label: "Banners",       icon: Image,           path: "/admin/banners" },
    { label: "Settings",      icon: Settings,        path: "/admin/settings" },
];

function AdminSidebar({ isOpen, onClose, dark }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleNav = (path) => { navigate(path); onClose(); };
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={onClose} />}
            <aside className={`
                fixed top-0 left-0 z-50 h-full w-60 flex flex-col
                transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                ${dark ? "bg-[#0f0f0f] border-r border-white/[0.06]" : "bg-white border-r border-gray-100"}
            `}>
                {/* Brand */}
                <div className={`flex items-center justify-between px-4 py-4 border-b ${dark ? "border-white/[0.06]" : "border-gray-100"}`}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md shadow-orange-500/25">
                            <Flame className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>Tadka Express</h1>
                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Admin Panel</p>
                        </div>
                    </div>
                    <button onClick={onClose} className={`lg:hidden p-1.5 rounded-lg ${dark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-400"}`}>
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ label, icon: Icon, path }) => {
                        const isActive = location.pathname === path;
                        return (
                            <button key={path} onClick={() => handleNav(path)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative
                                    ${isActive
                                        ? dark ? "text-orange-400 font-medium" : "bg-orange-50 text-orange-600 font-medium"
                                        : dark ? "text-gray-400 hover:text-gray-100 hover:bg-white/[0.05]" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                                style={isActive && dark ? { backgroundColor: "rgba(249,115,22,0.08)" } : {}}>
                                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-orange-500" />}
                                <Icon className={`flex-shrink-0 ${isActive ? "text-orange-500" : ""}`} style={{ width: "1rem", height: "1rem" }} />
                                {label}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className={`px-3 py-3 border-t ${dark ? "border-white/[0.06]" : "border-gray-100"}`}>
                    <button onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                            ${dark ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}>
                        <LogOut style={{ width: "1rem", height: "1rem" }} /> Sign out
                    </button>
                </div>
            </aside>
        </>
    );
}

export default function AdminLayout({ children }) {
    const { dark, setDark } = useContext(ThemeContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <div className={`flex h-screen overflow-hidden ${dark ? "bg-[#0a0a0a]" : "bg-gray-50"}`}>
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} dark={dark} />
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top bar */}
                <header className={`sticky top-0 z-30 px-4 md:px-6 py-3 flex items-center justify-between gap-4 backdrop-blur-xl
                    ${dark ? "bg-[#0a0a0a]/80 border-b border-white/[0.06]" : "bg-white/80 border-b border-gray-200"}`}>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className={`lg:hidden p-2 rounded-xl ${dark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                            <Menu className="w-5 h-5" />
                        </button>
                        <span className={`text-sm font-semibold ${dark ? "text-gray-300" : "text-gray-700"}`}>Admin Panel</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setDark(!dark)} className={`p-2.5 rounded-xl ${dark ? "hover:bg-white/10 text-orange-400" : "hover:bg-gray-100 text-amber-500"}`}>
                            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white">
                                {storedUser?.name?.charAt(0)?.toUpperCase() || "A"}
                            </div>
                            <span className={`text-xs font-semibold hidden md:block ${dark ? "text-gray-200" : "text-gray-700"}`}>
                                {storedUser?.name?.split(" ")[0] || "Admin"}
                            </span>
                            <span className="text-[10px] font-bold text-red-400 uppercase hidden md:block">Admin</span>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}