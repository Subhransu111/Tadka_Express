import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import API_BASE from "../../config/api";
import { ShoppingBag, CheckCircle2, Bike, Package, Clock, UtensilsCrossed, Filter } from "lucide-react";

function StatusBadge({ status, dark }) {
    const config = {
        delivered:        { icon: CheckCircle2, label: "Delivered",  cls: dark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200" },
        out_for_delivery: { icon: Bike,         label: "On the way", cls: dark ? "bg-sky-500/10 text-sky-400 border-sky-500/20"             : "bg-sky-50 text-sky-700 border-sky-200" },
        skipped:          { icon: Package,      label: "Skipped",    cls: dark ? "bg-gray-500/10 text-gray-400 border-gray-500/20"           : "bg-gray-100 text-gray-500 border-gray-200" },
        pending:          { icon: Clock,        label: "Pending",    cls: dark ? "bg-amber-500/10 text-amber-400 border-amber-500/20"        : "bg-amber-50 text-amber-700 border-amber-200" },
        cancelled:        { icon: Package,      label: "Cancelled",  cls: dark ? "bg-red-500/10 text-red-400 border-red-500/20"             : "bg-red-50 text-red-600 border-red-200" },
        preparing:        { icon: Clock,        label: "Preparing",  cls: dark ? "bg-violet-500/10 text-violet-400 border-violet-500/20"    : "bg-violet-50 text-violet-700 border-violet-200" },
    };
    const c = config[status] || config.pending;
    const Icon = c.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${c.cls}`}>
            <Icon className="w-3 h-3" />{c.label}
        </span>
    );
}

const FILTERS = ["All", "Delivered", "Pending", "Skipped"];

export default function MyOrdersPage() {
    const { dark } = useContext(ThemeContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE}/api/auth/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setOrders(data.data);
                else throw new Error(data.error);
            } catch (err) {
                setError("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filtered = filter === "All"
        ? orders
        : orders.filter(o => o.deliveryStatus?.toLowerCase() === filter.toLowerCase());

    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";

    if (loading) return (
        <DashboardLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>My Orders</h1>
                <span className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>{orders.length} total</span>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-5 flex-wrap">
                <Filter className={`w-4 h-4 self-center ${dark ? "text-gray-500" : "text-gray-400"}`} />
                {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all
                            ${filter === f
                                ? "bg-orange-500 text-white shadow-sm"
                                : dark ? "bg-white/[0.06] text-gray-400 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}>
                        {f}
                    </button>
                ))}
            </div>

            {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
            )}

            {/* Orders list */}
            {filtered.length === 0 ? (
                <div className={`rounded-2xl p-12 text-center ${card}`}>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${dark ? "bg-white/[0.04]" : "bg-gray-50"}`}>
                        <ShoppingBag className={`w-7 h-7 ${dark ? "text-gray-600" : "text-gray-300"}`} />
                    </div>
                    <p className={`text-sm font-semibold mb-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>No orders found</p>
                    <p className={`text-xs ${dark ? "text-gray-600" : "text-gray-300"}`}>
                        {filter === "All" ? "Your order history will appear here" : `No ${filter.toLowerCase()} orders`}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((order, i) => (
                        <div key={order._id || i}
                            className={`rounded-2xl p-4 transition-all hover:-translate-y-0.5 ${card}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${dark ? "bg-orange-500/10" : "bg-orange-50"}`}>
                                    <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                                            #{order._id?.substring(0, 8).toUpperCase() || `ORD00${i + 1}`}
                                        </span>
                                        <StatusBadge status={order.deliveryStatus || "pending"} dark={dark} />
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize
                                            ${dark ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                                            {order.planType}
                                        </span>
                                    </div>
                                    <p className={`text-xs truncate ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                        {order.selectedItem || "Meal plan delivery"}
                                        {order.isSkipped && " · Skipped"}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 text-right">
                                    <p className={`text-xs font-semibold ${dark ? "text-gray-300" : "text-gray-700"}`}>
                                        {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                    </p>
                                    <p className={`text-[10px] ${dark ? "text-gray-600" : "text-gray-400"}`}>
                                        {new Date(order.date).toLocaleDateString("en-IN", { weekday: "short" })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="h-10" />
        </DashboardLayout>
    );
}