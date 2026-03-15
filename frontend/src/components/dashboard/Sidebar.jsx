import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import {
    LayoutDashboard, UtensilsCrossed, ClipboardList,
    CalendarCheck, Wallet, Gift, User, HeadphonesIcon,
    LogOut, X, Flame,
} from "lucide-react";

const navItems = [
    { label: "Dashboard",    icon: LayoutDashboard, path: "/dashboard" },
    { label: "Order Food",   icon: UtensilsCrossed, path: "/dashboard/order" },
    { label: "My Orders",    icon: ClipboardList,   path: "/dashboard/orders" },
    { label: "Subscription", icon: CalendarCheck,   path: "/dashboard/subscription" },
    { label: "Wallet",       icon: Wallet,          path: "/dashboard/wallet" },
    { label: "Refer & Earn", icon: Gift,            path: "/dashboard/refer" },
    { label: "Profile",      icon: User,            path: "/dashboard/profile" },
    { label: "Support",      icon: HeadphonesIcon,  path: "/dashboard/support" },
];

export default function Sidebar({ isOpen, onClose }) {
    const { dark } = useContext(ThemeContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleNav = (path) => { navigate(path); onClose(); };
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = storedUser?.name || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={onClose} />
            )}

            <aside className={`
                fixed top-0 left-0 z-50 h-full w-64 flex flex-col
                transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:static lg:z-auto
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                ${dark
                    ? "bg-[#0f0f0f] border-r border-white/[0.06]"
                    : "bg-white border-r border-gray-100"
                }
            `}>
                {/* Brand */}
                <div className={`flex items-center justify-between px-5 py-5 border-b
                    ${dark ? "border-white/[0.06]" : "border-gray-100"}`}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md shadow-orange-500/25">
                            <Flame className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-sm font-bold tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>
                                Tadka Express
                            </h1>
                            <p className="text-[10px] font-medium text-orange-500 uppercase tracking-widest">Food Delivery</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className={`lg:hidden p-1.5 rounded-lg transition-colors ${dark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-400"}`}>
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <button key={item.path} onClick={() => handleNav(item.path)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 relative group
                                    ${isActive
                                        ? dark
                                            ? "bg-orange-500/12 text-orange-400 font-medium"
                                            : "bg-orange-50 text-orange-600 font-medium"
                                        : dark
                                            ? "text-gray-400 hover:text-gray-100 hover:bg-white/[0.05]"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                                style={isActive ? { backgroundColor: dark ? "rgba(249,115,22,0.08)" : undefined } : {}}>
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-orange-500" />
                                )}
                                <Icon className={`flex-shrink-0 transition-colors ${isActive ? "text-orange-500" : ""}`}
                                    style={{ width: "1rem", height: "1rem" }} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* User + Logout */}
                <div className={`px-3 py-3 border-t ${dark ? "border-white/[0.06]" : "border-gray-100"}`}>
                    {/* User info */}
                    <div className={`flex items-center gap-3 px-3 py-3 rounded-xl mb-1
                        ${dark ? "bg-white/[0.04]" : "bg-gray-50"}`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                            {userInitial}
                        </div>
                        <div className="min-w-0">
                            <p className={`text-sm font-semibold truncate ${dark ? "text-gray-100" : "text-gray-900"}`}>{userName}</p>
                            <p className="text-[10px] text-orange-400 font-medium uppercase tracking-wide">Member</p>
                        </div>
                    </div>

                    <button onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                            ${dark ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}>
                        <LogOut style={{ width: "1rem", height: "1rem" }} />
                        Sign out
                    </button>
                </div>
            </aside>
        </>
    );
}