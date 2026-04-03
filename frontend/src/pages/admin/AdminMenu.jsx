import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import AdminLayout from "../../components/admin/AdminLayout";
import API_BASE from "../../config/api";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, X, Download } from "lucide-react";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const PLANS = ["basic","deluxe","royal"];

// ── Actual menu from the photo ──
const SEED_MENU = [
    // BASIC
    { planType: "basic", optionNumber: 1, itemName: "Basic Daily Thali", price: 90,
      components: ["Rice/Roti", "Dal/Dalfry/Dalma", "Seasonal Mix Veg/Chhole/Alu Gobi/Soyabean Curry", "Paneer/Mushroom", "Bundi Raita/Achar+Papad", "Ambula Rai/Salad"],
      availableDays: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },

    // DELUXE
    { planType: "deluxe", optionNumber: 1, itemName: "Deluxe Daily Thali", price: 130,
      components: ["Paneer/Mushroom/Egg/Chicken/Fish Curry", "Rice/Roti", "Dal/Dalfry/Dalma", "Seasonal Mix Veg/Chhole/Alu Gobi/Soyabean Curry", "Bundi Raita/Achar+Papad", "Ambula Rai/Salad"],
      subOptions: [{ componentIndex: 0, choices: ["Paneer Curry", "Mushroom Curry", "Egg Curry", "Chicken Curry", "Fish Curry"] }],
      availableDays: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },

    // ROYAL — 7 sets
    { planType: "royal", optionNumber: 1, itemName: "Set 1 — Thali Special", price: 150,
      components: ["Paneer/Mushroom/Egg/Chicken/Fish", "Rice/Ruti", "Dal/Dal-fry", "Mix Veg - Seasonal", "Bundi Raita", "Salad"],
      subOptions: [{ componentIndex: 0, choices: ["Paneer", "Mushroom", "Egg", "Chicken", "Fish"] }],
      availableDays: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
    { planType: "royal", optionNumber: 2, itemName: "Set 2 — Paratha Special", price: 140,
      components: ["Alu Paratha", "Curd - Plain", "Mix Veg - Seasonal", "Achar", "Papad", "Salad"],
      subOptions: [],
      availableDays: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
    { planType: "royal", optionNumber: 3, itemName: "Set 3 — Bhature Special", price: 150,
      components: ["Bhature", "Chole", "Lassi (Plain/Sabja/Mango) / Butter Milk / Coke", "Sweet", "Salad"],
      subOptions: [{ componentIndex: 2, choices: ["Lassi Plain", "Lassi Sabja", "Lassi Mango", "Butter Milk", "Coke"] }],
      availableDays: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
    { planType: "royal", optionNumber: 4, itemName: "Set 4 — Biryani Special", price: 160,
      components: ["Biryani - Veg/Chicken", "Salan", "Coke", "Raita", "Salad"],
      subOptions: [{ componentIndex: 0, choices: ["Veg Biryani", "Chicken Biryani"] }],
      availableDays: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
    { planType: "royal", optionNumber: 5, itemName: "Set 5 — Chilly Special", price: 160,
      components: ["Chilly - Paneer/Mushroom/Chicken", "Laccha Paratha 2pc / Tawa Ruti 4pc", "Coke", "Sweet", "Salad"],
      subOptions: [{ componentIndex: 0, choices: ["Chilly Paneer", "Chilly Mushroom", "Chilly Chicken"] }, { componentIndex: 1, choices: ["Laccha Paratha 2pc", "Tawa Ruti 4pc"] }],
      availableDays: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
    { planType: "royal", optionNumber: 6, itemName: "Set 6 — Manchurian + Fried Rice", price: 165,
      components: ["Gobi Manchurian / Chilly Chicken", "Fried Rice (Veg/Egg/Egg-Chicken)", "Coke", "Sweet", "Salad"],
      subOptions: [{ componentIndex: 0, choices: ["Gobi Manchurian", "Chilly Chicken"] }, { componentIndex: 1, choices: ["Veg Fried Rice", "Egg Fried Rice", "Egg-Chicken Fried Rice"] }],
      availableDays: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
    { planType: "royal", optionNumber: 7, itemName: "Set 7 — Manchurian + Noodles", price: 170,
      components: ["Gobi Manchurian / Chilly Chicken", "Noodles (Veg/Egg/Egg-Chicken)", "Coke", "Sweet", "Salad"],
      subOptions: [{ componentIndex: 0, choices: ["Gobi Manchurian", "Chilly Chicken"] }, { componentIndex: 1, choices: ["Veg Noodles", "Egg Noodles", "Egg-Chicken Noodles"] }],
      availableDays: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
];

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
            <div className={`w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto
                ${dark ? "bg-[#1a1a1a] border border-white/[0.08]" : "bg-white border border-gray-100 shadow-2xl"}`}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className={`text-base font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                        {item ? "Edit Item" : "Add Menu Item"}
                    </h3>
                    <button onClick={onClose} className={`p-1.5 rounded-lg ${dark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                        <X className="w-4 h-4" />
                    </button>
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
                            <input type="number" min={1} value={form.optionNumber}
                                onChange={e => setForm(f => ({...f, optionNumber: e.target.value}))}
                                className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${input}`} />
                        </div>
                    </div>
                    <div>
                        <label className={`text-xs font-semibold mb-1 block ${dark ? "text-gray-400" : "text-gray-500"}`}>Item Name *</label>
                        <input required value={form.itemName} onChange={e => setForm(f => ({...f, itemName: e.target.value}))}
                            placeholder="e.g. Biryani Special"
                            className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${input}`} />
                    </div>
                    <div>
                        <label className={`text-xs font-semibold mb-1 block ${dark ? "text-gray-400" : "text-gray-500"}`}>
                            Components <span className="font-normal opacity-60">(comma separated)</span>
                        </label>
                        <textarea required value={form.components} rows={3}
                            onChange={e => setForm(f => ({...f, components: e.target.value}))}
                            placeholder="Rice, Dal, Paneer Curry, Salad..."
                            className={`w-full px-3 py-2 rounded-xl text-sm border outline-none resize-none ${input}`} />
                    </div>
                    <div>
                        <label className={`text-xs font-semibold mb-1 block ${dark ? "text-gray-400" : "text-gray-500"}`}>
                            Price (₹) {form.planType !== "royal" && <span className="font-normal opacity-60">(auto-filled from settings)</span>}
                        </label>
                        <input type="number" value={form.price}
                            onChange={e => setForm(f => ({...f, price: e.target.value}))}
                            placeholder={form.planType === "basic" ? "90" : form.planType === "deluxe" ? "130" : "140-170"}
                            className={`w-full px-3 py-2 rounded-xl text-sm border outline-none ${input}`} />
                    </div>
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
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors
                                ${dark ? "bg-white/[0.06] text-gray-300 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                            Cancel
                        </button>
                        <button type="submit"
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-400 transition-colors">
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
    const [modal, setModal] = useState(null);
    const [error, setError] = useState("");
    const [seeding, setSeeding] = useState(false);
    const [seedSuccess, setSeedSuccess] = useState(false);

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

    // Seed all menu items from the actual menu photo
    const handleSeedMenu = async () => {
        if (!window.confirm(`This will add ${SEED_MENU.length} menu items (Basic + Deluxe + 7 Royal sets) from your actual menu. Continue?`)) return;
        setSeeding(true);
        setError("");
        let successCount = 0;
        for (const item of SEED_MENU) {
            try {
                const res = await fetch(`${API_BASE}/api/menu`, {
                    method: "POST", headers,
                    body: JSON.stringify(item)
                });
                if (res.ok) successCount++;
            } catch {}
        }
        setSeeding(false);
        setSeedSuccess(true);
        setTimeout(() => setSeedSuccess(false), 4000);
        loadMenu(planFilter);
    };

    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";

    return (
        <AdminLayout>
            {modal !== null && (
                <MenuModal item={modal === "add" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} dark={dark} />
            )}

            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>Menu Management</h1>
                <div className="flex gap-2">
                    {/* Seed from actual menu */}
                    <button onClick={handleSeedMenu} disabled={seeding}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors
                            ${dark ? "border-white/[0.08] text-gray-300 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                        <Download className="w-4 h-4" />
                        {seeding ? "Adding..." : "Load Menu from Photo"}
                    </button>
                    <button onClick={() => setModal("add")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-400 transition-colors">
                        <Plus className="w-4 h-4" /> Add Item
                    </button>
                </div>
            </div>

            {seedSuccess && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                    ✅ Menu loaded successfully! All items from your subscription plan are now added.
                </div>
            )}
            {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
            )}

            {/* Info box about the menu */}
            <div className={`rounded-xl p-4 mb-5 flex items-start gap-3 ${dark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-orange-50 border border-orange-100"}`}>
                <span className="text-lg flex-shrink-0">📋</span>
                <div>
                    <p className={`text-xs font-semibold ${dark ? "text-gray-300" : "text-gray-700"}`}>
                        Your menu: Basic (₹90) · Deluxe (₹130) · Royal Set 1–7 (₹140–170)
                    </p>
                    <p className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-500"}`}>
                        Click "Load Menu from Photo" to auto-fill all items from your subscription plan card, or add items manually.
                    </p>
                </div>
            </div>

            {/* Plan tabs */}
            <div className="flex gap-2 mb-5">
                {PLANS.map(p => (
                    <button key={p} onClick={() => setPlanFilter(p)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all
                            ${planFilter === p
                                ? p === "royal" ? "bg-purple-500 text-white" : p === "deluxe" ? "bg-violet-500 text-white" : "bg-orange-500 text-white"
                                : dark ? "bg-white/[0.06] text-gray-400 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}>
                        {p} {p === "royal" && "🎖️"}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                </div>
            ) : items.length === 0 ? (
                <div className={`rounded-2xl p-10 text-center ${card}`}>
                    <p className={`text-sm mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        No {planFilter} menu items yet.
                    </p>
                    <div className="flex gap-2 justify-center">
                        <button onClick={handleSeedMenu}
                            className={`text-sm font-medium px-4 py-2 rounded-xl border transition-colors
                                ${dark ? "border-white/10 text-gray-400 hover:bg-white/5" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                            Load from photo
                        </button>
                        <button onClick={() => setModal("add")}
                            className="text-sm text-orange-500 hover:text-orange-400 font-medium px-4 py-2">
                            Add manually →
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                        <div key={item._id}
                            className={`rounded-2xl p-4 transition-all ${card} ${!item.isAvailable ? "opacity-50" : ""}`}>
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        {item.optionNumber && (
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded
                                                ${dark ? "bg-white/[0.06] text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                                                #{item.optionNumber}
                                            </span>
                                        )}
                                        <p className={`text-sm font-bold truncate ${dark ? "text-white" : "text-gray-900"}`}>
                                            {item.itemName}
                                        </p>
                                    </div>
                                    {item.price && (
                                        <p className="text-xs font-bold text-orange-500">₹{item.price}</p>
                                    )}
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    <button onClick={() => handleToggle(item)} title={item.isAvailable ? "Disable" : "Enable"}
                                        className={`p-1.5 rounded-lg transition-colors ${dark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                                        {item.isAvailable
                                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            : <XCircle className="w-4 h-4 text-red-400" />}
                                    </button>
                                    <button onClick={() => setModal(item)}
                                        className={`p-1.5 rounded-lg transition-colors ${dark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => handleDelete(item._id)}
                                        className={`p-1.5 rounded-lg transition-colors ${dark ? "hover:bg-red-500/10 text-gray-500 hover:text-red-400" : "hover:bg-red-50 text-gray-400 hover:text-red-500"}`}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            {item.components?.length > 0 && (
                                <p className={`text-xs leading-relaxed mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                    {item.components.join(" · ")}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-1">
                                {item.availableDays?.map(d => (
                                    <span key={d} className={`text-[10px] px-1.5 py-0.5 rounded font-medium
                                        ${dark ? "bg-white/[0.06] text-gray-500" : "bg-gray-100 text-gray-400"}`}>
                                        {d.slice(0,3)}
                                    </span>
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