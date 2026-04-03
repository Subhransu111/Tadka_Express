import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import AdminLayout from "../../components/admin/AdminLayout";
import API_BASE from "../../config/api";
import { Crown, Search } from "lucide-react";

export default function AdminSubscription() {
    const { dark } = useContext(ThemeContext);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem("token");
                // Assuming there's an admin endpoint for subscriptions
                const res = await fetch(`${API_BASE}/api/subscriptions/admin/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setSubscriptions(data.data || []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const filtered = subscriptions.filter(s =>
        s.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.planType?.toLowerCase().includes(search.toLowerCase()) ||
        s.status?.toLowerCase().includes(search.toLowerCase())
    );

    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";
    const input = dark ? "bg-white/[0.05] border-white/[0.08] text-gray-200 placeholder-gray-600 focus:border-orange-500/50" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-orange-400";

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                    Subscriptions <span className={`text-sm font-normal ${dark ? "text-gray-500" : "text-gray-400"}`}>({subscriptions.length} total)</span>
                </h1>
                <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? "text-gray-500" : "text-gray-400"}`} />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search user, plan..."
                        className={`pl-9 pr-4 py-2 rounded-xl text-sm border outline-none transition-all w-56 ${input}`} />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filtered.map(sub => (
                        <div key={sub._id} className={`p-4 rounded-xl ${card}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className={`font-medium ${dark ? "text-white" : "text-gray-900"}`}>
                                        {sub.userId?.name || 'Unknown User'}
                                    </h3>
                                    <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                                        {sub.planType} • {sub.totalDays} days • ₹{sub.totalPrice}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        sub.status === 'active' ? 'bg-green-100 text-green-800' :
                                        sub.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {sub.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}