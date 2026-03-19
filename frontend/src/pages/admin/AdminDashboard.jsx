import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import AdminLayout from "../../components/admin/AdminLayout";
import API_BASE from "../../config/api";
import {
    Users, CalendarCheck, TrendingUp, SkipForward,
    ArrowRight, UtensilsCrossed, Clock, CheckCircle2,
    Bike, Package
} from "lucide-react";

function StatCard({ label, value, sub, icon: Icon, color, dark }) {
    const colors = {
        orange: { bg: dark ? "bg-orange-500/10" : "bg-orange-50", text: "text-orange-500" },
        violet: { bg: dark ? "bg-violet-500/10" : "bg-violet-50", text: "text-violet-500" },
        emerald:{ bg: dark ? "bg-emerald-500/10": "bg-emerald-50","text": "text-emerald-500" },
        red:    { bg: dark ? "bg-red-500/10"    : "bg-red-50",    text: "text-red-500" },
    };
    const c = colors[color] || colors.orange;
    return (
        <div className={`rounded-2xl p-5 transition-all hover:-translate-y-0.5
            ${dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${c.bg}`}>
                <Icon className={`w-5 h-5 ${c.text}`} />
            </div>
            <p className={`text-2xl font-extrabold mb-0.5 ${dark ? "text-white" : "text-gray-900"}`}>{value}</p>
            <p className={`text-[11px] font-medium uppercase tracking-wider mb-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
            {sub && <p className={`text-xs ${c.text}`}>{sub}</p>}
        </div>
    );
}

function StatusBadge({ status, dark }) {
    const cfg = {
        delivered:        { icon: CheckCircle2, label: "Delivered",  cls: dark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200" },
        out_for_delivery: { icon: Bike,         label: "Out",        cls: dark ? "bg-sky-500/10 text-sky-400 border-sky-500/20"             : "bg-sky-50 text-sky-700 border-sky-200" },
        skipped:          { icon: Package,      label: "Skipped",    cls: dark ? "bg-gray-500/10 text-gray-400 border-gray-500/20"           : "bg-gray-100 text-gray-500 border-gray-200" },
        pending:          { icon: Clock,        label: "Pending",    cls: dark ? "bg-amber-500/10 text-amber-400 border-amber-500/20"        : "bg-amber-50 text-amber-700 border-amber-200" },
    };
    const c = cfg[status] || cfg.pending;
    const Icon = c.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${c.cls}`}>
            <Icon className="w-2.5 h-2.5" />{c.label}
        </span>
    );
}

export default function AdminDashboard() {
    const { dark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    const todayStr = new Date().toISOString().split("T")[0];

    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const [statsRes, deliveryRes] = await Promise.all([
                    fetch(`${API_BASE}/api/analytics/dashboard`, { headers }),
                    fetch(`${API_BASE}/api/orders/admin/delivery/${todayStr}`, { headers }),
                ]);

                const statsData = await statsRes.json();
                const deliveryData = await deliveryRes.json();

                if (statsData.success) setStats(statsData.data);
                if (deliveryData.success) setDeliveries(deliveryData.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";

    if (loading) return (
        <AdminLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
        </AdminLayout>
    );

    const statCards = [
        { label: "Total Users",        value: stats?.totalUsers ?? 0,         sub: "Registered",     icon: Users,        color: "orange" },
        { label: "Active Subscribers", value: stats?.activeSubscribers ?? 0,  sub: "Active plans",   icon: CalendarCheck,color: "violet" },
        { label: "Total Revenue",      value: `₹${stats?.totalRevenue ?? 0}`, sub: "From active subs",icon: TrendingUp,  color: "emerald" },
        { label: "Skipped Today",      value: stats?.skippedToday ?? 0,       sub: "Meals skipped",  icon: SkipForward,  color: "red" },
    ];

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-6">
                <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>Admin Dashboard</h1>
                <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>
                    {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statCards.map(s => <StatCard key={s.label} {...s} dark={dark} />)}
            </div>

            {/* Today's Deliveries + Quick Links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Today's deliveries */}
                <div className={`lg:col-span-2 rounded-2xl p-5 ${card}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                            Today's Deliveries
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${dark ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
                                {deliveries.length}
                            </span>
                        </h3>
                        <button onClick={() => navigate("/admin/deliveries")}
                            className={`text-xs font-medium flex items-center gap-1 ${dark ? "text-orange-400" : "text-orange-500"}`}>
                            View all <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>

                    {deliveries.length === 0 ? (
                        <div className="text-center py-8">
                            <UtensilsCrossed className={`w-8 h-8 mx-auto mb-2 ${dark ? "text-gray-700" : "text-gray-300"}`} />
                            <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>No deliveries today</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {deliveries.slice(0, 8).map((order, i) => (
                                <div key={order._id || i}
                                    className={`flex items-center gap-3 p-3 rounded-xl ${dark ? "bg-white/[0.03] border border-white/[0.04]" : "bg-gray-50 border border-gray-100"}`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${dark ? "bg-orange-500/10" : "bg-orange-50"}`}>
                                        <UtensilsCrossed className="w-3.5 h-3.5 text-orange-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-semibold truncate ${dark ? "text-white" : "text-gray-900"}`}>
                                            {order.userId?.name || "Unknown"}
                                        </p>
                                        <p className={`text-[10px] ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                            {order.selectedItem || "Meal"} · {order.planType}
                                        </p>
                                    </div>
                                    <StatusBadge status={order.deliveryStatus} dark={dark} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick links */}
                <div className="space-y-3">
                    <h3 className={`text-sm font-bold px-1 ${dark ? "text-white" : "text-gray-900"}`}>Quick Actions</h3>
                    {[
                        { label: "Manage Menu",      sub: "Add or disable items",     path: "/admin/menu",          color: "text-orange-500", bg: dark ? "bg-orange-500/10" : "bg-orange-50" },
                        { label: "View Subscribers", sub: "Active subscriptions",     path: "/admin/subscriptions", color: "text-violet-500", bg: dark ? "bg-violet-500/10" : "bg-violet-50" },
                        { label: "Upload Banner",    sub: "Update landing page",      path: "/admin/banners",       color: "text-sky-500",    bg: dark ? "bg-sky-500/10"    : "bg-sky-50" },
                        { label: "Settings",         sub: "Pricing & WhatsApp times", path: "/admin/settings",      color: "text-emerald-500",bg: dark ? "bg-emerald-500/10": "bg-emerald-50" },
                        { label: "Users",            sub: "All registered users",     path: "/admin/users",         color: "text-pink-500",   bg: dark ? "bg-pink-500/10"   : "bg-pink-50" },
                    ].map(({ label, sub, path, color, bg }) => (
                        <button key={path} onClick={() => navigate(path)}
                            className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all hover:-translate-y-0.5 ${card}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
                                    <ArrowRight className={`w-3.5 h-3.5 ${color}`} />
                                </div>
                                <div className="text-left">
                                    <p className={`text-xs font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{label}</p>
                                    <p className={`text-[10px] ${dark ? "text-gray-500" : "text-gray-400"}`}>{sub}</p>
                                </div>
                            </div>
                            <ArrowRight className={`w-3.5 h-3.5 ${dark ? "text-gray-600" : "text-gray-300"}`} />
                        </button>
                    ))}
                </div>
            </div>
            <div className="h-8" />
        </AdminLayout>
    );
}