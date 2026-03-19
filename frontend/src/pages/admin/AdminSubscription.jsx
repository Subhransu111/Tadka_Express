import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import AdminLayout from "../../components/admin/AdminLayout";
import API_BASE from "../../config/api";
import { Settings, Save, CheckCircle2 } from "lucide-react";

export default function AdminSettings() {
    const { dark } = useContext(ThemeContext);
    const [form, setForm] = useState({
        basicPerDay: 90, deluxePerDay: 130,
        whatsappStart: "16:00", whatsappEnd: "22:00",
        isServiceActive: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE}/api/settings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && data.settings) {
                    const s = data.settings;
                    setForm({
                        basicPerDay: s.pricing?.basicPerDay ?? 90,
                        deluxePerDay: s.pricing?.deluxePerDay ?? 130,
                        whatsappStart: s.whatsappWindow?.startTime ?? "16:00",
                        whatsappEnd: s.whatsappWindow?.endTime ?? "22:00",
                        isServiceActive: s.isServiceActive ?? true,
                    });
                }
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true); setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    pricing: { basicPerDay: Number(form.basicPerDay), deluxePerDay: Number(form.deluxePerDay) },
                    whatsappWindow: { startTime: form.whatsappStart, endTime: form.whatsappEnd },
                    isServiceActive: form.isServiceActive,
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed");
            setSaved(true); setTimeout(() => setSaved(false), 3000);
        } catch (err) { setError(err.message); }
        finally { setSaving(false); }
    };

    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";
    const input = dark ? "bg-white/[0.05] border-white/[0.08] text-gray-200 focus:border-orange-500/50" : "bg-gray-50 border-gray-200 text-gray-800 focus:border-orange-400 focus:bg-white";

    if (loading) return (
        <AdminLayout><div className="flex justify-center min-h-[60vh] items-center"><div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" /></div></AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="max-w-xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>Settings</h1>
                    <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-400 disabled:opacity-60 transition-colors">
                        <Save className="w-4 h-4" />{saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                {saved && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Settings saved successfully!
                    </div>
                )}
                {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

                {/* Pricing */}
                <div className={`rounded-2xl p-6 mb-4 ${card}`}>
                    <h3 className={`text-sm font-bold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>Pricing</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Basic Plan (₹/day)", key: "basicPerDay" },
                            { label: "Deluxe Plan (₹/day)", key: "deluxePerDay" },
                        ].map(({ label, key }) => (
                            <div key={key}>
                                <label className={`text-xs font-semibold mb-1.5 block ${dark ? "text-gray-400" : "text-gray-500"}`}>{label}</label>
                                <input type="number" value={form[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${input}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* WhatsApp window */}
                <div className={`rounded-2xl p-6 mb-4 ${card}`}>
                    <h3 className={`text-sm font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>WhatsApp Reminder Window</h3>
                    <p className={`text-xs mb-4 ${dark ? "text-gray-500" : "text-gray-400"}`}>Deluxe users receive meal selection reminder in this window</p>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Start Time", key: "whatsappStart" },
                            { label: "End Time",   key: "whatsappEnd" },
                        ].map(({ label, key }) => (
                            <div key={key}>
                                <label className={`text-xs font-semibold mb-1.5 block ${dark ? "text-gray-400" : "text-gray-500"}`}>{label}</label>
                                <input type="time" value={form[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${input}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Service toggle */}
                <div className={`rounded-2xl p-6 ${card}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>Service Status</h3>
                            <p className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>Toggle to pause all new orders</p>
                        </div>
                        <button onClick={() => setForm(f => ({...f, isServiceActive: !f.isServiceActive}))}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${form.isServiceActive ? "bg-orange-500" : dark ? "bg-white/10" : "bg-gray-200"}`}>
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${form.isServiceActive ? "translate-x-6" : "translate-x-0.5"}`} />
                        </button>
                    </div>
                    <p className={`text-xs mt-2 font-medium ${form.isServiceActive ? "text-emerald-400" : "text-red-400"}`}>
                        Service is currently {form.isServiceActive ? "active" : "paused"}
                    </p>
                </div>
            </div>
            <div className="h-8" />
        </AdminLayout>
    );
}