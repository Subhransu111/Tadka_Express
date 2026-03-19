import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import AdminLayout from "../../components/admin/AdminLayout";
import API_BASE from "../../config/api";
import { CalendarCheck, Filter } from "lucide-react";

const STATUS_COLORS = {
    active:          { cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    expired:         { cls: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
    pending_payment: { cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    cancelled:       { cls: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export default function AdminSubscriptions() {
    const { dark } = useContext(ThemeContext);
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE}/api/auth/admin/subscriptions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setSubs(data.data || []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const filtered = filter === "all" ? subs : subs.filter(s => s.status === filter);
    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                    Subscriptions <span className={`text-sm font-normal ${dark ? "text-gray-500" : "text-gray-400"}`}>({subs.length} total)</span>
                </h1>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-5 flex-wrap items-center">
                <Filter className={`w-4 h-4 ${dark ? "text-gray-500" : "text-gray-400"}`} />
                {["all", "active", "pending_payment", "expired", "cancelled"].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all
                            ${filter === f ? "bg-orange-500 text-white" : dark ? "bg-white/[0.06] text-gray-400 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        {f.replace("_", " ")}
                    </button>
                ))}
            </div>

            <div className={`rounded-2xl overflow-hidden ${card}`}>
                {loading ? (
                    <div className="flex justify-center py-12"><div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" /></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12">
                        <CalendarCheck className={`w-8 h-8 mx-auto mb-2 ${dark ? "text-gray-700" : "text-gray-300"}`} />
                        <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>No subscriptions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`text-[11px] font-bold uppercase tracking-wider ${dark ? "text-gray-500 border-b border-white/[0.06]" : "text-gray-400 border-b border-gray-100"}`}>
                                    {["User", "Phone", "Plan", "Days", "Price", "Start", "End", "Status"].map(h => (
                                        <th key={h} className="text-left px-4 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((sub, i) => {
                                    const sc = STATUS_COLORS[sub.status] || STATUS_COLORS.pending_payment;
                                    return (
                                        <tr key={sub._id || i} className={`border-t transition-colors ${dark ? "border-white/[0.04] hover:bg-white/[0.02]" : "border-gray-50 hover:bg-gray-50"}`}>
                                            <td className={`px-4 py-3 text-xs font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{sub.userId?.name || "—"}</td>
                                            <td className={`px-4 py-3 text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{sub.userId?.phone || "—"}</td>
                                            <td className={`px-4 py-3 text-xs capitalize font-medium ${dark ? "text-orange-400" : "text-orange-500"}`}>{sub.planType}</td>
                                            <td className={`px-4 py-3 text-xs ${dark ? "text-gray-300" : "text-gray-600"}`}>{sub.totalDays}d ({sub.usedDays || 0} used)</td>
                                            <td className={`px-4 py-3 text-xs font-semibold ${dark ? "text-white" : "text-gray-900"}`}>₹{sub.totalPrice}</td>
                                            <td className={`px-4 py-3 text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{new Date(sub.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                                            <td className={`px-4 py-3 text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{sub.endDate ? new Date(sub.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${sc.cls}`}>
                                                    {sub.status.replace("_", " ")}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="h-8" />
        </AdminLayout>
    );
}