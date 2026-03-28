import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import AdminLayout from "../../components/admin/AdminLayout";
import API_BASE from "../../config/api";
import { Shield, ShieldOff, Search, CheckCircle2, AlertTriangle, Crown } from "lucide-react";

export default function AdminManageAdmins() {
    const { dark } = useContext(ThemeContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [updating, setUpdating] = useState(null);
    const [message, setMessage] = useState(null);

    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isSuperAdmin = currentUser.role === "superadmin";

    useEffect(() => {
        const load = async () => {
            try {
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

    const handleRoleChange = async (user, newRole) => {
        const action = newRole === "admin" ? "promote to Admin" : "demote to User";
        if (!window.confirm(`Are you sure you want to ${action} "${user.name}"?`)) return;

        setUpdating(user._id);
        setMessage(null);
        try {
            const res = await fetch(`${API_BASE}/api/auth/update-role`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ phone: user.phone, newRole })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || "Failed");
            setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
            setMessage({ type: "success", text: `${user.name} is now ${newRole === "admin" ? "an Admin" : "a regular User"}` });
            setTimeout(() => setMessage(null), 4000);
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setUpdating(null);
        }
    };

    // Filter out current logged-in user from the list
    const othersOnly = users.filter(u => u._id !== currentUser._id);

    const filtered = othersOnly.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const superAdmins = filtered.filter(u => u.role === "superadmin");
    const admins      = filtered.filter(u => u.role === "admin");
    const members     = filtered.filter(u => u.role === "user" || !u.role);

    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";
    const input = dark
        ? "bg-white/[0.05] border-white/[0.08] text-gray-200 placeholder-gray-600 focus:border-orange-500/50"
        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-orange-400";

    function UserRow({ user, showActions }) {
        const isSA = user.role === "superadmin";
        return (
            <div className={`flex items-center gap-4 px-5 py-3.5 transition-colors
                ${dark ? "hover:bg-white/[0.02]" : "hover:bg-gray-50"}`}>
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0
                    ${isSA ? "bg-gradient-to-br from-amber-500 to-orange-600"
                    : user.role === "admin" ? "bg-gradient-to-br from-red-500 to-orange-600"
                    : "bg-gradient-to-br from-orange-400 to-red-500"}`}>
                    {user.name?.charAt(0)?.toUpperCase()}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-gray-900"}`}>{user.name}</p>
                        {isSA && <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                    </div>
                    <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        {user.phone}{user.email ? ` · ${user.email}` : ""}
                    </p>
                </div>
                {/* Role badge */}
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border flex-shrink-0
                    ${isSA ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : user.role === "admin" ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : dark ? "bg-white/5 text-gray-500 border-white/10" : "bg-gray-100 text-gray-400 border-gray-200"}`}>
                    {user.role === "superadmin" ? "Super Admin" : user.role === "admin" ? "Admin" : "User"}
                </span>
                {/* Actions — only superadmin can manage, and superadmins can't be demoted */}
                {showActions && isSuperAdmin && !isSA && (
                    user.role === "admin" ? (
                        <button onClick={() => handleRoleChange(user, "user")}
                            disabled={updating === user._id}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0
                                ${dark ? "bg-white/[0.06] text-gray-400 hover:bg-red-500/10 hover:text-red-400" : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"}`}>
                            <ShieldOff className="w-3.5 h-3.5" />
                            {updating === user._id ? "..." : "Revoke"}
                        </button>
                    ) : (
                        <button onClick={() => handleRoleChange(user, "admin")}
                            disabled={updating === user._id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-orange-500 hover:bg-orange-400 disabled:opacity-60 transition-colors flex-shrink-0">
                            <Shield className="w-3.5 h-3.5" />
                            {updating === user._id ? "..." : "Make Admin"}
                        </button>
                    )
                )}
                {/* Non-superadmin sees lock icon on admins */}
                {showActions && !isSuperAdmin && (
                    <span className={`text-xs px-2 py-1 rounded-lg ${dark ? "text-gray-600 bg-white/[0.03]" : "text-gray-300 bg-gray-50"}`}>
                        🔒
                    </span>
                )}
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-3xl">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <div>
                        <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>Manage Admins</h1>
                        <p className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                            {isSuperAdmin
                                ? "As superadmin you can promote users to admin or revoke access."
                                : "Only superadmin can promote or revoke admin access."}
                        </p>
                    </div>
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? "text-gray-500" : "text-gray-400"}`} />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search name or phone..."
                            className={`pl-9 pr-4 py-2 rounded-xl text-sm border outline-none w-52 ${input}`} />
                    </div>
                </div>

                {/* You (current user) */}
                <div className={`rounded-2xl p-4 mb-4 flex items-center gap-3 ${dark ? "bg-amber-500/5 border border-amber-500/15" : "bg-amber-50 border border-amber-200"}`}>
                    <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div>
                        <p className={`text-xs font-bold ${dark ? "text-amber-300" : "text-amber-700"}`}>
                            You ({currentUser.name}) — {currentUser.role === "superadmin" ? "Super Admin" : "Admin"}
                        </p>
                        <p className={`text-[11px] ${dark ? "text-amber-500/60" : "text-amber-600/70"}`}>
                            {currentUser.role === "superadmin"
                                ? "You have full control. Superadmin cannot be removed."
                                : "You are an admin. Only superadmin can manage roles."}
                        </p>
                    </div>
                </div>

                {message && (
                    <div className={`mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2
                        ${message.type === "success"
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                            : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
                        {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        {message.text}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Super Admins */}
                        {superAdmins.length > 0 && (
                            <div className={`rounded-2xl overflow-hidden ${card}`}>
                                <div className={`px-5 py-3 border-b flex items-center gap-2 ${dark ? "border-white/[0.06]" : "border-gray-100"}`}>
                                    <Crown className="w-4 h-4 text-amber-400" />
                                    <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                                        Super Admins ({superAdmins.length})
                                    </h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ml-1 ${dark ? "bg-white/[0.05] text-gray-500" : "bg-gray-100 text-gray-400"}`}>
                                        Cannot be removed
                                    </span>
                                </div>
                                <div className="divide-y divide-white/[0.04]">
                                    {superAdmins.map(u => <UserRow key={u._id} user={u} showActions={true} />)}
                                </div>
                            </div>
                        )}

                        {/* Admins */}
                        <div className={`rounded-2xl overflow-hidden ${card}`}>
                            <div className={`px-5 py-3 border-b flex items-center gap-2 ${dark ? "border-white/[0.06]" : "border-gray-100"}`}>
                                <Shield className="w-4 h-4 text-orange-500" />
                                <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                                    Admins ({admins.length})
                                </h3>
                            </div>
                            {admins.length === 0 ? (
                                <p className={`text-sm text-center py-6 ${dark ? "text-gray-500" : "text-gray-400"}`}>No other admins yet</p>
                            ) : (
                                <div className="divide-y divide-white/[0.04]">
                                    {admins.map(u => <UserRow key={u._id} user={u} showActions={true} />)}
                                </div>
                            )}
                        </div>

                        {/* All Users */}
                        <div className={`rounded-2xl overflow-hidden ${card}`}>
                            <div className={`px-5 py-3 border-b flex items-center gap-2 ${dark ? "border-white/[0.06]" : "border-gray-100"}`}>
                                <Shield className="w-4 h-4 text-gray-400" />
                                <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                                    Users ({members.length})
                                </h3>
                            </div>
                            {members.length === 0 ? (
                                <p className={`text-sm text-center py-6 ${dark ? "text-gray-500" : "text-gray-400"}`}>No users found</p>
                            ) : (
                                <div className="divide-y divide-white/[0.04]">
                                    {members.map(u => <UserRow key={u._id} user={u} showActions={true} />)}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="h-8" />
        </AdminLayout>
    );
}