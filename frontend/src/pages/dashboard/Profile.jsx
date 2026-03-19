import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import API_BASE from "../../config/api";
import { User, Phone, Mail, MapPin, Save, CheckCircle2, Pencil } from "lucide-react";

export default function ProfilePage() {
    const { dark } = useContext(ThemeContext);
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", street: "", landmark: "", pincode: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setProfile(data.data);
                    setForm({
                        name: data.data.name || "",
                        email: data.data.email || "",
                        street: data.data.address?.street || "",
                        landmark: data.data.address?.landmark || "",
                        pincode: data.data.address?.pincode || "",
                    });
                }
            } catch (err) {
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/auth/profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    address: { street: form.street, landmark: form.landmark, pincode: form.pincode }
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update");
            setProfile(data.data);
            // Update localStorage name
            const stored = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...stored, name: form.name }));
            setSaved(true);
            setEditing(false);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";
    const input = dark
        ? "bg-white/[0.05] border-white/[0.08] text-gray-200 placeholder-gray-600 focus:border-orange-500/50"
        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:bg-white";

    if (loading) return (
        <DashboardLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
        </DashboardLayout>
    );

    const initial = profile?.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>My Profile</h1>
                    {!editing ? (
                        <button onClick={() => setEditing(true)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors
                                ${dark ? "bg-white/[0.06] hover:bg-white/10 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                            <Pencil className="w-3.5 h-3.5" /> Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={() => setEditing(false)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors
                                    ${dark ? "bg-white/[0.06] hover:bg-white/10 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-400 disabled:opacity-60 transition-colors">
                                <Save className="w-3.5 h-3.5" />
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    )}
                </div>

                {saved && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
                    </div>
                )}
                {error && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
                )}

                {/* Avatar + basic info */}
                <div className={`rounded-2xl p-6 mb-4 ${card}`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg shadow-orange-500/20">
                            {initial}
                        </div>
                        <div>
                            <p className={`text-lg font-bold ${dark ? "text-white" : "text-gray-900"}`}>{profile?.name}</p>
                            <p className={`text-sm capitalize ${dark ? "text-orange-400" : "text-orange-500"}`}>{profile?.role}</p>
                            <p className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                Member since {new Date(profile?.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                                <User className="w-3.5 h-3.5" /> Full Name
                            </label>
                            <input name="name" value={form.name} onChange={handleChange} disabled={!editing}
                                className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${input} disabled:opacity-60 disabled:cursor-not-allowed`} />
                        </div>

                        {/* Phone — read only */}
                        <div>
                            <label className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                                <Phone className="w-3.5 h-3.5" /> Phone Number
                            </label>
                            <input value={profile?.phone || ""} disabled
                                className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none opacity-50 cursor-not-allowed ${input}`} />
                            <p className={`text-[10px] mt-1 ${dark ? "text-gray-600" : "text-gray-400"}`}>Phone number cannot be changed</p>
                        </div>

                        {/* Email */}
                        <div>
                            <label className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                                <Mail className="w-3.5 h-3.5" /> Email Address <span className="font-normal opacity-50">(optional)</span>
                            </label>
                            <input name="email" value={form.email} onChange={handleChange} disabled={!editing}
                                placeholder="your@email.com"
                                className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${input} disabled:opacity-60 disabled:cursor-not-allowed`} />
                        </div>
                    </div>
                </div>

                {/* Delivery Address */}
                <div className={`rounded-2xl p-6 mb-4 ${card}`}>
                    <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${dark ? "text-white" : "text-gray-900"}`}>
                        <MapPin className="w-4 h-4 text-orange-500" /> Delivery Address
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className={`text-xs font-semibold mb-1.5 block ${dark ? "text-gray-400" : "text-gray-500"}`}>Street / Area</label>
                            <input name="street" value={form.street} onChange={handleChange} disabled={!editing}
                                placeholder="e.g. 42 MG Road, Lakshmisagar"
                                className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${input} disabled:opacity-60 disabled:cursor-not-allowed`} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={`text-xs font-semibold mb-1.5 block ${dark ? "text-gray-400" : "text-gray-500"}`}>Landmark</label>
                                <input name="landmark" value={form.landmark} onChange={handleChange} disabled={!editing}
                                    placeholder="Near City Mall"
                                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${input} disabled:opacity-60 disabled:cursor-not-allowed`} />
                            </div>
                            <div>
                                <label className={`text-xs font-semibold mb-1.5 block ${dark ? "text-gray-400" : "text-gray-500"}`}>Pincode</label>
                                <input name="pincode" value={form.pincode} onChange={handleChange} disabled={!editing}
                                    placeholder="751001" maxLength={6}
                                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${input} disabled:opacity-60 disabled:cursor-not-allowed`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className={`rounded-2xl p-6 ${card}`}>
                    <h3 className={`text-sm font-bold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>Account Info</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Reward Points", value: profile?.rewardPoints ?? 0, color: "text-amber-400" },
                            { label: "Referral Code", value: profile?.referralCode || "—", color: "text-orange-400" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className={`rounded-xl p-4 ${dark ? "bg-white/[0.04]" : "bg-gray-50"}`}>
                                <p className={`text-base font-bold ${color}`}>{value}</p>
                                <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-10" />
        </DashboardLayout>
    );
}