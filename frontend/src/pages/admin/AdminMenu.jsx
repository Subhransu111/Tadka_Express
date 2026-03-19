import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import AdminLayout from "../../components/admin/AdminLayout";
import API_BASE from "../../config/api";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, X } from "lucide-react";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const PLANS = ["basic","deluxe","royal"];

function MenuModal({ item, onClose, onSave, dark }) {
    const [form, setForm] = useState({
        planType: item?.planType || "basic",
        itemName: item?.itemName || "",
        components: item?.components?.join(", ") || "",
        availableDays: item?.availableDays || [...DAYS],
        price: item?.price || "",
        optionNumber: item?.optionNumber || 1,
    });

    const toggleDay = (day) => {
        setForm(f => ({
            ...f,
            availableDays: f.availableDays.includes(day)
                ? f.availableDays.filter(d => d !== day)
                : [...f.availableDays, day]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...form,
            components: form.components.split(",").map(c => c.trim()).filter(Boolean),
            price: form.price ? Number(form.price) : undefined,
            optionNumber: Number(form.optionNumber),
        });
    };

    const input = dark
        ? "bg-white/[0.05] border-white/[0.08] text-gray-200 placeholder-gray-600 focus:border-orange-500/50"
        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:bg-white";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-2xl p-6 ${dark ? "bg-[#1a1a1a] border border-white/[0.08]" : "bg-white border border-gray-100 shadow-2xl"}`}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className={`text-base font-bold ${dark ? "text-white" : "text-gray-900"}`}>{item ? "Edit Item" : "Add Menu Item"}</h3>
                    <button onClick={onClose} className={`p-1.5 rounded-lg ${dark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={`text-xs font-semibold mb-1 block ${dark ? "text-gray-400" : "text-gray-500"}`}>Plan</label>
                            <select value={form.planType} onChange={e => setForm(f => ({...f, planType: e.target.value}))}
                                className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${input}`}>
                                {PLANS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={`text-xs font-semibold mb-1 block ${dark ? "text-gray-400" : "text-gray-500"}`}>Option #</label>
                            <input type="number" min={1} value={form.optionNumber} onChange={e => setForm(f => ({...f, optionNumber: e.target.value}))}
                                className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${input}`} />
                        </div>
                    </div>
                    <div>
                        <label className={`text-xs font-semibold mb-1 block ${dark ? "text-gray-400" : "text-gray-500"}`}>Item Name *</label>
                        <input required value={form.itemName} onChange={e => setForm(f => ({...f, itemName: e.target.value}))}
                            placeholder="e.g. Chicken Biryani"
                            className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${input}`} />
                    </div>
                    <div>
                        <label className={`text-xs font-semibold mb-1 block ${dark ? "text-gray-400" : "text-gray-500"}`}>Components (comma separated) *</label>
                        <input required value={form.components} onChange={e => setForm(f => ({...f, components: e.target.value}))}
                            placeholder="Rice, Chicken curry, Salad, Pickle"
                            className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${input}`} />
                    </div>
                    {form.planType === "royal" && (
                        <div>
                            <label className={`text-xs font-semibold mb-1 block ${dark ? "text-gray-400" : "text-gray-500"}`}>Price (₹)</label>
                            <input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))}
                                className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${input}`} />
                        </div>
                    )}
                    <div>
                        <label className={`text-xs font-semibold mb-2 block ${dark ? "text-gray-400" : "text-gray-500"}`}>Available Days</label>
                        <div className="flex flex-wrap gap-1.5">
                            {DAYS.map(day => (
                                <button type="button" key={day} onClick={() => toggleDay(day)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors
                                        ${form.availableDays.includes(day)
                                            ? "bg-orange-500 text-white"
                                            : dark ? "bg-white/[0.06] text-gray-400 hover:bg-white/10" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        }`}>
                                    {day.slice(0,3)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${dark ? "bg-white/[0.06] text-gray-300 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-400 transition-colors">
                            {item ? "Save Changes" : "Add Item"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminMenu() {
    const { dark } = useContext(ThemeContext);
    const [items, setItems] = useState([]);
    const [planFilter, setPlanFilter] = useState("basic");
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | "add" | item object
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    const loadMenu = async (plan = planFilter) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/menu/${plan}`);
            const data = await res.json();
            if (data.success) setItems(data.data || []);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadMenu(planFilter); }, [planFilter]);

    const handleSave = async (form) => {
        try {
            const isEdit = modal && modal._id;
            const res = await fetch(
                isEdit ? `${API_BASE}/api/menu/${modal._id}` : `${API_BASE}/api/menu`,
                { method: isEdit ? "PUT" : "POST", headers, body: JSON.stringify(form) }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed");
            setModal(null);
            loadMenu();
        } catch (err) { setError(err.message); }
    };

    const handleToggle = async (item) => {
        try {
            await fetch(`${API_BASE}/api/menu/${item._id}`, {
                method: "PUT", headers,
                body: JSON.stringify({ isAvailable: !item.isAvailable })
            });
            loadMenu();
        } catch (err) { setError(err.message); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this menu item?")) return;
        try {
            await fetch(`${API_BASE}/api/menu/${id}`, { method: "DELETE", headers });
            loadMenu();
        } catch (err) { setError(err.message); }
    };

    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";

    return (
        <AdminLayout>
            {modal !== null && (
                <MenuModal item={modal === "add" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} dark={dark} />
            )}

            <div className="flex items-center justify-between mb-6">
                <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>Menu Management</h1>
                <button onClick={() => setModal("add")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-400 transition-colors">
                    <Plus className="w-4 h-4" /> Add Item
                </button>
            </div>

            {/* Plan tabs */}
            <div className="flex gap-2 mb-5">
                {PLANS.map(p => (
                    <button key={p} onClick={() => setPlanFilter(p)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all
                            ${planFilter === p ? "bg-orange-500 text-white" : dark ? "bg-white/[0.06] text-gray-400 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        {p}
                    </button>
                ))}
            </div>

            {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

            {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" /></div>
            ) : items.length === 0 ? (
                <div className={`rounded-2xl p-10 text-center ${card}`}>
                    <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>No {planFilter} menu items yet.</p>
                    <button onClick={() => setModal("add")} className="mt-3 text-sm text-orange-500 hover:text-orange-400 font-medium">Add first item →</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                        <div key={item._id} className={`rounded-2xl p-4 ${card} ${!item.isAvailable ? "opacity-50" : ""}`}>
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                    <p className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>{item.itemName}</p>
                                    {item.price && <p className="text-xs text-orange-500 font-semibold">₹{item.price}</p>}
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    <button onClick={() => handleToggle(item)} title={item.isAvailable ? "Disable" : "Enable"}
                                        className={`p-1.5 rounded-lg transition-colors ${dark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                                        {item.isAvailable
                                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            : <XCircle className="w-4 h-4 text-red-400" />}
                                    </button>
                                    <button onClick={() => setModal(item)} className={`p-1.5 rounded-lg transition-colors ${dark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className={`p-1.5 rounded-lg transition-colors ${dark ? "hover:bg-red-500/10 text-gray-500 hover:text-red-400" : "hover:bg-red-50 text-gray-400 hover:text-red-500"}`}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            {item.components?.length > 0 && (
                                <p className={`text-xs mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>{item.components.join(" · ")}</p>
                            )}
                            <div className="flex flex-wrap gap-1">
                                {item.availableDays?.map(d => (
                                    <span key={d} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${dark ? "bg-white/[0.06] text-gray-500" : "bg-gray-100 text-gray-400"}`}>{d.slice(0,3)}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="h-8" />
        </AdminLayout>
    );
}