import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import API_BASE from "../../config/api";
import {
    ShoppingBag, CalendarCheck, Star,
    ArrowRight, UtensilsCrossed, Users, TrendingUp,
    Clock, ChefHat, Bike, CheckCircle2, Package,
    Zap, Flame, Gift, AlertTriangle
} from "lucide-react";

function StatusBadge({ status, dark }) {
    const config = {
        delivered:        { icon: CheckCircle2, label: "Delivered",  light: "bg-emerald-50 text-emerald-700 border-emerald-200",  dark: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
        out_for_delivery: { icon: Bike,         label: "On the way", light: "bg-sky-50 text-sky-700 border-sky-200",              dark: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
        skipped:          { icon: Package,      label: "Skipped",    light: "bg-gray-100 text-gray-500 border-gray-200",          dark: "bg-white/5 text-gray-400 border-white/10" },
        pending:          { icon: Clock,        label: "Pending",    light: "bg-amber-50 text-amber-700 border-amber-200",        dark: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
        cancelled:        { icon: Package,      label: "Cancelled",  light: "bg-red-50 text-red-600 border-red-200",              dark: "bg-red-500/10 text-red-400 border-red-500/20" },
    };
    const c = config[status] || config.pending;
    const Icon = c.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${dark ? c.dark : c.light}`}>
            <Icon className="w-3 h-3" />{c.label}
        </span>
    );
}

function StatCard({ label, value, change, icon: Icon, gradient, lightBg, darkBg, lightText, darkText, dark, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`
                relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1
                ${onClick ? "cursor-pointer" : ""}
                ${dark
                    ? "bg-[#181818] border border-white/[0.07] shadow-xl shadow-black/50"
                    : "bg-white border border-gray-100/80 shadow-lg shadow-gray-200/70"
                }
            `}>
            <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-15 ${gradient}`} />
            <div className={`absolute top-0 right-0 w-14 h-14 rounded-bl-[2.5rem] opacity-[0.08] ${gradient}`} />
            <div className="relative">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${dark ? darkBg : lightBg}`}>
                    <Icon className={`w-5 h-5 ${dark ? darkText : lightText}`} />
                </div>
                <p className={`text-2xl font-bold tracking-tight mb-0.5 ${dark ? "text-white" : "text-gray-900"}`}>{value}</p>
                <p className={`text-[11px] font-medium uppercase tracking-wider mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
                <p className={`text-xs font-medium flex items-center gap-1 ${dark ? darkText : lightText}`}>
                    <TrendingUp className="w-3 h-3" />{change}
                </p>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { dark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // ── Get name from localStorage immediately ──
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const displayName = storedUser?.name?.split(" ")[0] || "there";
    const fullName = storedUser?.name || "User";

    // Location coverage check
    const locationStatus = sessionStorage.getItem("location_status");
    const isNotCovered = locationStatus === "not_covered";

    // ── Fix 1: Proper time-based greeting ──
    const hour = new Date().getHours();
    const greeting =
        hour >= 5  && hour < 12 ? "Good morning" :
        hour >= 12 && hour < 17 ? "Good afternoon" :
        hour >= 17 && hour < 21 ? "Good evening" :
        "Good night";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token");
                const res = await fetch(`${API_BASE}/api/auth/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const json = await res.json();
                setData(json.data);
            } catch {
                setData({
                    // Fix 1: Use name from localStorage, not email
                    profile: { name: fullName, rewardPoints: 0 },
                    stats: { totalOrders: 0, weeklyOrdersChange: 0 },
                    subscription: null,
                    recentOrders: []
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <DashboardLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                    <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>Loading dashboard...</p>
                </div>
            </div>
        </DashboardLayout>
    );

    // ── Fix 2: Removed Wallet, kept Reward Points ──
    const stats = [
        {
            label: "Total Orders",
            value: data?.stats?.totalOrders ?? 0,
            change: `+${data?.stats?.weeklyOrdersChange ?? 0} this week`,
            icon: ShoppingBag,
            gradient: "bg-orange-500", lightBg: "bg-orange-50", darkBg: "bg-orange-500/10",
            lightText: "text-orange-500", darkText: "text-orange-400",
            onClick: () => navigate("/dashboard/orders")
        },
        {
            label: "Active Plan",
            value: data?.subscription?.planType
                ? data.subscription.planType.charAt(0).toUpperCase() + data.subscription.planType.slice(1)
                : "None",
            change: data?.subscription
                ? `${(data.subscription.totalDays ?? 0) - (data.subscription.usedDays ?? 0)} meals left`
                : "No active plan",
            icon: CalendarCheck,
            gradient: "bg-violet-500", lightBg: "bg-violet-50", darkBg: "bg-violet-500/10",
            lightText: "text-violet-600", darkText: "text-violet-400",
            onClick: () => navigate("/dashboard/subscription")
        },
        {
            label: "Reward Points",
            value: data?.profile?.rewardPoints ?? 0,
            change: "Redeem on orders",
            icon: Star,
            gradient: "bg-amber-500", lightBg: "bg-amber-50", darkBg: "bg-amber-500/10",
            lightText: "text-amber-600", darkText: "text-amber-400",
            onClick: () => navigate("/dashboard/refer")
        },
        {
            label: "Refer & Earn",
            value: storedUser?.referralCode || "—",
            change: "Share your code",
            icon: Gift,
            gradient: "bg-pink-500", lightBg: "bg-pink-50", darkBg: "bg-pink-500/10",
            lightText: "text-pink-600", darkText: "text-pink-400",
            onClick: () => navigate("/dashboard/refer")
        },
    ];

    // ── Fix 3: Removed "Track Order" (no backend), Fix 4: Removed "₹100 each" ──
    const quickActions = [
        {
            label: "Today's Meal",
            desc: "Select or skip tomorrow",
            icon: ChefHat,
            image: "https://images.unsplash.com/photo-1589302168068-964664d93cb0?q=80&w=400&auto=format&fit=crop",
            path: "/dashboard/order"
        },
        {
            label: "My Orders",
            desc: "Your delivery history",
            icon: ShoppingBag,
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop",
            path: "/dashboard/orders"
        },
        {
            label: "View Menu",
            desc: "Explore cuisines",
            icon: UtensilsCrossed,
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop",
            path: "/dashboard/order"
        },
        {
            label: "Refer Friends",
            desc: "Earn reward points",   // Fix 4: removed "₹100 each"
            icon: Users,
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop",
            path: "/dashboard/refer"
        },
    ];

    const usedPct = data?.subscription
        ? Math.round(((data.subscription.usedDays ?? 0) / (data.subscription.totalDays ?? 1)) * 100)
        : 0;

    return (
        <DashboardLayout>

            {/* ── Not Available Banner ── */}
            {isNotCovered && (
                <div className="mb-5 px-5 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-amber-400">Service not available in your area yet</p>
                        <p className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                            We currently deliver in Bhubaneswar, Odisha. We're expanding soon — stay tuned!
                        </p>
                    </div>
                </div>
            )}

            {/* ── Welcome Banner ── */}
            <div className={`relative overflow-hidden rounded-3xl mb-7
                ${dark
                    ? "bg-[#181818] border border-white/[0.07] shadow-2xl shadow-black/60"
                    : "bg-white border border-orange-100 shadow-xl shadow-orange-100/50"
                }`}>
                <div className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2000&auto=format&fit=crop')" }} />
                <div className={`absolute inset-0 ${dark
                    ? "bg-gradient-to-r from-[#181818] via-[#181818]/96 to-[#181818]/55"
                    : "bg-gradient-to-r from-white via-white/96 to-white/55"}`} />
                <div className={`absolute -bottom-10 -right-10 w-72 h-72 rounded-full blur-3xl opacity-25 ${dark ? "bg-orange-600" : "bg-orange-300"}`} />
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10 ${dark ? "bg-red-500" : "bg-red-200"}`} />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-7 md:p-9">
                    <div>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border
                            ${dark ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-orange-50 text-orange-600 border-orange-200"}`}>
                            <Flame className="w-3 h-3" />
                            Tadka Express
                        </div>
                        {/* Fix 1: greeting uses time + name from localStorage (never email) */}
                        <h2 className={`text-3xl md:text-4xl font-bold tracking-tight mb-2 leading-tight ${dark ? "text-white" : "text-gray-900"}`}>
                            {greeting},<br />
                            <span className="text-orange-500">{displayName}.</span>
                        </h2>
                        <p className={`text-sm max-w-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-500"}`}>
                            Discover rich spices, authentic flavors, and the best meals delivered to your door.
                        </p>
                    </div>
                    {/* Fix 6: Order button navigates to order page */}
                    <button
                        onClick={() => navigate("/dashboard/order")}
                        className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm text-white
                        bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30
                        hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300">
                        <Zap className="w-4 h-4 fill-white" />
                        Order Your Next Meal
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ── Stats Grid (Fix 6: each card is clickable) ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
                {stats.map((s) => <StatCard key={s.label} {...s} dark={dark} />)}
            </div>

            {/* ── Quick Actions (Fix 6: each card navigates) ── */}
            <div className="mb-7">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className={`text-base font-semibold ${dark ? "text-white" : "text-gray-900"}`}>What are you craving?</h3>
                    <button
                        onClick={() => navigate("/dashboard/order")}
                        className={`text-xs font-medium flex items-center gap-1 ${dark ? "text-orange-400 hover:text-orange-300" : "text-orange-500 hover:text-orange-600"}`}>
                        Explore Full Menu <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={action.label}
                                onClick={() => navigate(action.path)}
                                className="group relative overflow-hidden text-left rounded-2xl aspect-[4/3] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/25">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url('${action.image}')` }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute inset-0 p-4 flex flex-col justify-end z-10">
                                    <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-2 backdrop-blur-sm">
                                        <Icon className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-white">{action.label}</h4>
                                    <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">{action.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Bottom Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Recent Orders */}
                <div className={`lg:col-span-2 rounded-2xl p-6
                    ${dark ? "bg-[#181818] border border-white/[0.07] shadow-xl shadow-black/40" : "bg-white border border-gray-100 shadow-lg shadow-gray-200/60"}`}>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className={`text-base font-semibold ${dark ? "text-white" : "text-gray-900"}`}>Recent Orders</h3>
                        {/* Fix 6: View all navigates */}
                        <button
                            onClick={() => navigate("/dashboard/orders")}
                            className={`text-xs font-medium ${dark ? "text-orange-400 hover:text-orange-300" : "text-orange-500 hover:text-orange-600"}`}>
                            View all →
                        </button>
                    </div>
                    <div className="space-y-2">
                        {data?.recentOrders?.length > 0 ? data.recentOrders.map((order, i) => (
                            <div key={order._id || i}
                                className={`flex items-center gap-3 p-3.5 rounded-xl transition-colors cursor-pointer
                                    ${dark ? "hover:bg-white/[0.04] border border-white/[0.04]" : "hover:bg-orange-50/40 border border-transparent hover:border-orange-100"}`}>
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${dark ? "bg-orange-500/10" : "bg-orange-50"}`}>
                                    <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`text-sm font-medium ${dark ? "text-white" : "text-gray-900"}`}>
                                            #{order._id ? order._id.substring(0, 6).toUpperCase() : `ORD00${i + 1}`}
                                        </span>
                                        <StatusBadge status={order.deliveryStatus || "pending"} dark={dark} />
                                    </div>
                                    <p className={`text-xs truncate ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                        {order.selectedItem || order.items || "Meal plan delivery"}
                                    </p>
                                </div>
                                <span className={`text-xs flex-shrink-0 ${dark ? "text-gray-600" : "text-gray-300"}`}>
                                    {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                </span>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${dark ? "bg-white/[0.04]" : "bg-gray-50"}`}>
                                    <ShoppingBag className={`w-6 h-6 ${dark ? "text-gray-600" : "text-gray-300"}`} />
                                </div>
                                <p className={`text-sm font-medium mb-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>No orders yet</p>
                                <p className={`text-xs mb-4 ${dark ? "text-gray-600" : "text-gray-300"}`}>Place your first order today</p>
                                <button
                                    onClick={() => navigate("/dashboard/order")}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-orange-500 hover:bg-orange-400 transition-colors">
                                    Order Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Subscription Card */}
                <div className={`relative rounded-2xl overflow-hidden
                    ${dark ? "bg-[#181818] border border-white/[0.07] shadow-xl shadow-black/40" : "bg-white border border-gray-100 shadow-lg shadow-gray-200/60"}`}>
                    <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-br from-orange-500 to-red-500 rounded-b-[3rem]" />
                    <div className="absolute top-0 left-0 right-0 h-28 bg-cover bg-center opacity-20 rounded-b-[3rem]"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=600&auto=format&fit=crop')" }} />
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-orange-300 blur-2xl opacity-40" />

                    <div className="relative z-10 p-6">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Meal Plan</span>
                                {data?.subscription && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30 uppercase tracking-wide">
                                        {data.subscription.planType}
                                    </span>
                                )}
                            </div>
                            <p className="text-2xl font-bold text-white">{data?.subscription ? "Active" : "No Plan"}</p>
                            {data?.subscription && (
                                <p className="text-xs text-white/60 mt-0.5">
                                    Until {new Date(data.subscription.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
                                </p>
                            )}
                        </div>

                        {data?.subscription ? (
                            <>
                                <div className={`rounded-xl p-4 mb-4 ${dark ? "bg-white/[0.05] border border-white/[0.07]" : "bg-gray-50 border border-gray-100"}`}>
                                    <div className="flex items-center justify-between mb-2.5">
                                        <span className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>Meals used</span>
                                        <span className="text-xs font-semibold text-orange-500">{data.subscription.usedDays ?? 0} / {data.subscription.totalDays}</span>
                                    </div>
                                    <div className={`w-full h-2 rounded-full ${dark ? "bg-white/10" : "bg-gray-200"}`}>
                                        <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 shadow-sm shadow-orange-500/30 transition-all duration-700"
                                            style={{ width: `${usedPct}%` }} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {[
                                        { val: (data.subscription.totalDays ?? 0) - (data.subscription.usedDays ?? 0), label: "Meals left" },
                                        { val: `${usedPct}%`, label: "Used" }
                                    ].map(({ val, label }) => (
                                        <div key={label} className={`rounded-xl p-3 ${dark ? "bg-white/[0.04]" : "bg-gray-50"}`}>
                                            <p className={`text-lg font-bold ${dark ? "text-white" : "text-gray-900"}`}>{val}</p>
                                            <p className={`text-[11px] ${dark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className={`rounded-xl p-5 mb-4 text-center ${dark ? "bg-white/[0.04] border border-white/[0.06]" : "bg-gray-50 border border-gray-100"}`}>
                                <span className="text-3xl mb-2 block">🍽️</span>
                                <p className={`text-sm font-medium mb-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>No active plan</p>
                                <p className={`text-xs ${dark ? "text-gray-600" : "text-gray-400"}`}>Subscribe to unlock daily meals</p>
                            </div>
                        )}

                        {/* Fix 6: Manage Plan navigates */}
                        <button
                            onClick={() => navigate("/dashboard/subscription")}
                            className="w-full py-3 rounded-xl font-semibold text-sm text-white
                            bg-gradient-to-r from-orange-500 to-orange-600 shadow-md shadow-orange-500/25
                            hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300">
                            {data?.subscription ? "Manage Plan" : "Get Started"}
                        </button>
                    </div>
                </div>
            </div>
            <div className="h-8" />
        </DashboardLayout>
    );
}