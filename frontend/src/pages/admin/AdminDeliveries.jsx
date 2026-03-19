import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import AdminLayout from "../../components/admin/AdminLayout";
import API_BASE from "../../config/api";
import { ChevronLeft, ChevronRight, Bike, CheckCircle2, Clock, Package, UtensilsCrossed } from "lucide-react";

function StatusBadge({ status, dark }) {
    const cfg = {
        delivered:        { label: "Delivered",  cls: dark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200" },
        out_for_delivery: { label: "On the way", cls: dark ? "bg-sky-500/10 text-sky-400 border-sky-500/20"             : "bg-sky-50 text-sky-700 border-sky-200" },
        skipped:          { label: "Skipped",    cls: dark ? "bg-gray-500/10 text-gray-400 border-gray-500/20"           : "bg-gray-100 text-gray-500 border-gray-200" },
        pending:          { label: "Pending",    cls: dark ? "bg-amber-500/10 text-amber-400 border-amber-500/20"        : "bg-amber-50 text-amber-700 border-amber-200" },
    };
    const c = cfg[status] || cfg.pending;
    return <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${c.cls}`}>{c.label}</span>;
}

export default function AdminDeliveries() {
    const { dark } = useContext(ThemeContext);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [orders, setOrders] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };
                const [ordersRes, summaryRes] = await Promise.all([
                    fetch(`${API_BASE}/api/orders/admin/delivery/${date}`, { headers }),
                    fetch(`${API_BASE}/api/orders/admin/summary/${date}`, { headers }),
                ]);
                const ordersData = await ordersRes.json();
                const summaryData = await summaryRes.json();
                if (ordersData.success) setOrders(ordersData.data || []);
                if (summaryData.success) setSummary(summaryData.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [date]);

    const changeDate = (days) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        setDate(d.toISOString().split("T")[0]);
    };

    const filtered = filter === "all" ? orders : orders.filter(o =>
        filter === "skipped" ? o.isSkipped : o.deliveryStatus === filter
    );

    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>Deliveries</h1>
                {/* Date navigator */}
                <div className={`flex items-center gap-2 rounded-xl p-1 ${dark ? "bg-white/[0.05]" : "bg-gray-100"}`}>
                    <button onClick={() => changeDate(-1)} className={`p-1.5 rounded-lg transition-colors ${dark ? "hover:bg-white/10 text-gray-400" : "hover:bg-white text-gray-500"}`}>
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className={`text-sm font-semibold px-2 min-w-[120px] text-center ${dark ? "text-white" : "text-gray-900"}`}>
                        {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <button onClick={() => changeDate(1)} className={`p-1.5 rounded-lg transition-colors ${dark ? "hover:bg-white/10 text-gray-400" : "hover:bg-white text-gray-500"}`}>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Summary cards */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    {[
                        { label: "Basic Meals",   value: summary.basic || 0,                               color: "text-orange-500" },
                        { label: "Deluxe Meals",  value: Object.values(summary.deluxe || {}).reduce((a,b) => a+b, 0), color: "text-violet-500" },
                        { label: "Skipped",       value: orders.filter(o => o.isSkipped).length,           color: "text-red-400" },
                        { label: "Total",         value: orders.length,                                    color: "text-emerald-500" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className={`rounded-xl p-4 ${card}`}>
                            <p className={`text-xl font-extrabold mb-0.5 ${color}`}>{value}</p>
                            <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Filter tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {["all", "pending", "out_for_delivery", "delivered", "skipped"].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize
                            ${filter === f ? "bg-orange-500 text-white" : dark ? "bg-white/[0.06] text-gray-400 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        {f.replace("_", " ")}
                    </button>
                ))}
            </div>

            {/* Orders table */}
            <div className={`rounded-2xl overflow-hidden ${card}`}>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12">
                        <UtensilsCrossed className={`w-8 h-8 mx-auto mb-2 ${dark ? "text-gray-700" : "text-gray-300"}`} />
                        <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>No orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`text-[11px] font-bold uppercase tracking-wider ${dark ? "text-gray-500 border-b border-white/[0.06]" : "text-gray-400 border-b border-gray-100"}`}>
                                    {["Customer", "Phone", "Plan", "Meal", "Address", "Status"].map(h => (
                                        <th key={h} className="text-left px-4 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {filtered.map((order, i) => (
                                    <tr key={order._id || i} className={`transition-colors ${dark ? "hover:bg-white/[0.02]" : "hover:bg-gray-50"}`}>
                                        <td className={`px-4 py-3 text-xs font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{order.userId?.name || "—"}</td>
                                        <td className={`px-4 py-3 text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{order.userId?.phone || "—"}</td>
                                        <td className={`px-4 py-3 text-xs capitalize ${dark ? "text-gray-300" : "text-gray-600"}`}>{order.planType}</td>
                                        <td className={`px-4 py-3 text-xs ${dark ? "text-gray-300" : "text-gray-600"}`}>{order.isSkipped ? "Skipped" : order.selectedItem || "—"}</td>
                                        <td className={`px-4 py-3 text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                            {order.userId?.address?.street ? `${order.userId.address.street}${order.userId.address.landmark ? `, ${order.userId.address.landmark}` : ""}` : "—"}
                                        </td>
                                        <td className="px-4 py-3"><StatusBadge status={order.deliveryStatus} dark={dark} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="h-8" />
        </AdminLayout>
    );
}