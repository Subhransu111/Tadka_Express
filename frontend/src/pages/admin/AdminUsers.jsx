import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import AdminLayout from "../../components/admin/AdminLayout";
import API_BASE from "../../config/api";
import { Users, Search } from "lucide-react";

export default function AdminUsers() {
    const { dark } = useContext(ThemeContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE}/api/auth/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setUsers(data.data || []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const filtered = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";
    const input = dark ? "bg-white/[0.05] border-white/[0.08] text-gray-200 placeholder-gray-600 focus:border-orange-500/50" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-orange-400";

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                    Users <span className={`text-sm font-normal ${dark ? "text-gray-500" : "text-gray-400"}`}>({users.length} total)</span>
                </h1>
                <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? "text-gray-500" : "text-gray-400"}`} />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search name, phone..."
                        className={`pl-9 pr-4 py-2 rounded-xl text-sm border outline-none transition-all w-56 ${input}`} />
                </div>
            </div>

            <div className={`rounded-2xl overflow-hidden ${card}`}>
                {loading ? (
                    <div className="flex justify-center py-12"><div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" /></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className={`w-8 h-8 mx-auto mb-2 ${dark ? "text-gray-700" : "text-gray-300"}`} />
                        <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>No users found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`text-[11px] font-bold uppercase tracking-wider ${dark ? "text-gray-500 border-b border-white/[0.06]" : "text-gray-400 border-b border-gray-100"}`}>
                                    {["Name", "Phone", "Email", "Referral Code", "Points", "Joined"].map(h => (
                                        <th key={h} className="text-left px-4 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((user, i) => (
                                    <tr key={user._id || i} className={`border-t transition-colors ${dark ? "border-white/[0.04] hover:bg-white/[0.02]" : "border-gray-50 hover:bg-gray-50"}`}>
                                        <td className={`px-4 py-3 text-xs font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{user.name}</td>
                                        <td className={`px-4 py-3 text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{user.phone}</td>
                                        <td className={`px-4 py-3 text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{user.email || "—"}</td>
                                        <td className={`px-4 py-3 text-xs font-mono font-medium ${dark ? "text-orange-400" : "text-orange-500"}`}>{user.referralCode || "—"}</td>
                                        <td className={`px-4 py-3 text-xs ${dark ? "text-amber-400" : "text-amber-500"}`}>{user.rewardPoints || 0}</td>
                                        <td className={`px-4 py-3 text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>{new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
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