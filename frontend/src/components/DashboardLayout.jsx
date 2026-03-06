import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard, UtensilsCrossed, CalendarDays, ClipboardList,
    User, Wallet, Settings, ChefHat, Truck, BarChart3, Image,
    Users, Sun, Moon, LogOut, Menu, X, ChevronLeft, ChevronRight
} from "lucide-react";

const userNav = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/dashboard/subscription", label: "My Subscription", icon: CalendarDays },
    { path: "/dashboard/menu", label: "Today's Menu", icon: UtensilsCrossed },
    { path: "/dashboard/orders", label: "Order History", icon: ClipboardList },
    { path: "/dashboard/profile", label: "My Profile", icon: User },
    { path: "/dashboard/wallet", label: "Wallet & Rewards", icon: Wallet },
];

const adminNav = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/menu", label: "Menu Management", icon: UtensilsCrossed },
    { path: "/admin/subscriptions", label: "Subscriptions", icon: CalendarDays },
    { path: "/admin/deliveries", label: "Delivery List", icon: Truck },
    { path: "/admin/kitchen", label: "Kitchen Summary", icon: ChefHat },
    { path: "/admin/banners", label: "Banners", icon: Image },
    { path: "/admin/settings", label: "Settings", icon: Settings },
];

function DashboardLayout({ children }) {
    const { dark, setDark } = useContext(ThemeContext);
    const { user, logout, isAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = isAdmin ? adminNav : userNav;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const initials = user?.name
        ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    return (
        <div className={`min-h-screen flex transition-colors duration-300 ${dark ? "bg-[#0A0A0A]" : "bg-[#F8F6F3]"}`}>

            {/* ── SIDEBAR (Desktop) ── */}
            <aside className={`hidden md:flex flex-col fixed top-0 left-0 h-full z-40 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${dark ? "bg-[#111111] border-r border-white/5" : "bg-white border-r border-orange-100"}`}>

                {/* Logo */}
                <div className={`flex items-center gap-3 px-5 py-6 ${collapsed ? "justify-center" : ""}`}>
                    <div className="w-10 h-10 bg-orange-600 text-white flex items-center justify-center rounded-xl font-bold text-lg shrink-0 shadow-lg shadow-orange-600/20">
                        🍲
                    </div>
                    {!collapsed && (
                        <span className={`text-lg font-black tracking-tight transition-colors ${dark ? "text-white" : "text-[#3E2723]"}`}>
                            TADKA <span className="text-orange-600">EXPRESS</span>
                        </span>
                    )}
                </div>

                {/* Role badge */}
                {!collapsed && (
                    <div className="px-5 mb-4">
                        <span className={`text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full
              ${isAdmin ? "bg-red-500/10 text-red-400" : "bg-orange-500/10 text-orange-500"}`}>
                            {isAdmin ? "ADMIN" : "USER"} PANEL
                        </span>
                    </div>
                )}

                {/* Nav Items */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const active = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group
                  ${collapsed ? "justify-center" : ""}
                  ${active
                                        ? dark
                                            ? "bg-orange-600/15 text-orange-400 shadow-sm"
                                            : "bg-orange-50 text-orange-600 shadow-sm"
                                        : dark
                                            ? "text-gray-400 hover:text-white hover:bg-white/5"
                                            : "text-gray-500 hover:text-gray-800 hover:bg-orange-50/50"
                                    }`}
                            >
                                <Icon size={20} className={`shrink-0 transition-transform group-hover:scale-110 ${active ? "text-orange-500" : ""}`} />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`mx-3 mb-3 p-2 rounded-xl transition-all flex items-center justify-center
            ${dark ? "hover:bg-white/5 text-gray-500" : "hover:bg-orange-50 text-gray-400"}`}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className={`mx-3 mb-5 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
            ${collapsed ? "justify-center" : ""}
            ${dark ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}
                >
                    <LogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </aside>

            {/* ── MOBILE TOP BAR ── */}
            <div className={`md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 backdrop-blur-xl
        ${dark ? "bg-[#111111]/90 border-b border-white/5" : "bg-white/90 border-b border-orange-100"}`}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-600 text-white flex items-center justify-center rounded-lg font-bold text-sm">🍲</div>
                    <span className={`text-base font-black ${dark ? "text-white" : "text-[#3E2723]"}`}>
                        TADKA <span className="text-orange-600">EXPRESS</span>
                    </span>
                </div>
                <button onClick={() => setMobileOpen(!mobileOpen)} className={dark ? "text-white" : "text-gray-800"}>
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* ── MOBILE DRAWER ── */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div
                        className={`absolute top-0 left-0 bottom-0 w-72 pt-16 pb-6 px-4 overflow-y-auto
              ${dark ? "bg-[#111111]" : "bg-white"}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Role badge */}
                        <div className="mb-4 px-1">
                            <span className={`text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full
                ${isAdmin ? "bg-red-500/10 text-red-400" : "bg-orange-500/10 text-orange-500"}`}>
                                {isAdmin ? "ADMIN" : "USER"} PANEL
                            </span>
                        </div>

                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const active = location.pathname === item.path;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                      ${active
                                                ? dark ? "bg-orange-600/15 text-orange-400" : "bg-orange-50 text-orange-600"
                                                : dark ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-gray-800 hover:bg-orange-50/50"
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <button
                            onClick={handleLogout}
                            className={`mt-6 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                ${dark ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}

            {/* ── MAIN CONTENT ── */}
            <main className={`flex-1 transition-all duration-300
        ${collapsed ? "md:ml-20" : "md:ml-64"}
        pt-16 md:pt-0`}>

                {/* Top Bar (Desktop) */}
                <header className={`hidden md:flex items-center justify-between px-8 py-4 sticky top-0 z-30 backdrop-blur-xl
          ${dark ? "bg-[#0A0A0A]/80 border-b border-white/5" : "bg-[#F8F6F3]/80 border-b border-orange-50"}`}>
                    <div>
                        <h2 className={`text-lg font-bold ${dark ? "text-white" : "text-gray-800"}`}>
                            {navItems.find(i => i.path === location.pathname)?.label || "Dashboard"}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setDark(!dark)}
                            className={`p-2.5 rounded-full transition-all
                ${dark ? "bg-white/5 text-yellow-400 hover:bg-white/10" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}
                        >
                            {dark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-orange-600/20">
                                {initials}
                            </div>
                            <div>
                                <p className={`text-sm font-semibold leading-tight ${dark ? "text-white" : "text-gray-800"}`}>{user?.name || "User"}</p>
                                <p className={`text-[11px] ${dark ? "text-gray-500" : "text-gray-400"}`}>{isAdmin ? "Administrator" : "Member"}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default DashboardLayout;
