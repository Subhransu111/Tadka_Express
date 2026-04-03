import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import API_BASE from "../../config/api";
import {
    CalendarCheck, CheckCircle2, ChevronLeft, ChevronRight,
    Zap, ArrowRight, Info, UtensilsCrossed
} from "lucide-react";

const PLANS = [
    {
        id: "basic", name: "Basic", pricePerDay: 90, color: "orange",
        description: "Fixed daily meal — no choices needed",
        features: ["1 meal per day (chef's choice)", "Dal, sabji, rice/roti", "Skip any day", "WhatsApp notification"],
        notIncluded: ["Meal selection", "Priority delivery"],
    },
    {
        id: "deluxe", name: "Deluxe", pricePerDay: 130, color: "violet",
        description: "Choose your protein daily via WhatsApp",
        features: ["1 meal per day (you choose)", "Dal, sabji, rice/roti + extras", "Daily WhatsApp reminder (4PM–10PM)", "Skip any day", "Priority delivery"],
        notIncluded: [], badge: "Popular",
    },
    {
        id: "royal", name: "Royal", pricePerDay: 140, priceMax: 170, color: "purple",
        description: "7 rotating premium sets — pick daily",
        features: ["1 premium meal (you choose)", "7 rotating premium sets", "Special weekend menu", "Dessert included", "Daily WhatsApp reminder", "Priority delivery"],
        notIncluded: [], badge: "Premium",
    },
];

const MIN_DAYS = 15;

function getDatesInMonth(year, month) {
    const days = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

// Sub-option selector for a single menu item
function SubOptionSelector({ item, selectedSubs, onChange, dark }) {
    if (!item.subOptions?.length) return null;
    return (
        <div className="mt-3 space-y-2">
            {item.subOptions.map((sub, si) => (
                <div key={si}>
                    <p className={`text-[11px] font-semibold mb-1.5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                        Choose {item.components[sub.componentIndex]?.split("/")[0]}:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {sub.choices.map(choice => (
                            <button key={choice} type="button"
                                onClick={() => onChange(si, choice)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all
                                    ${selectedSubs?.[si] === choice
                                        ? "bg-orange-500 text-white shadow-sm"
                                        : dark ? "bg-white/[0.07] text-gray-300 hover:bg-white/15" : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                                    }`}>
                                {choice}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function CalendarPicker({ selectedDates, onChange, dark }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const days = getDatesInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDayOfWeek = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const monthName = viewDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

    const toggleDate = (date) => {
        if (date < today) return;
        const key = date.toDateString();
        const exists = selectedDates.find(d => d.toDateString() === key);
        if (exists) onChange(selectedDates.filter(d => d.toDateString() !== key));
        else onChange([...selectedDates, date].sort((a, b) => a - b));
    };

    const canGoPrev = viewDate > new Date(today.getFullYear(), today.getMonth(), 1);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                    disabled={!canGoPrev}
                    className={`p-1.5 rounded-lg ${!canGoPrev ? "opacity-30 cursor-not-allowed" : dark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                    <ChevronLeft className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`} />
                </button>
                <span className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>{monthName}</span>
                <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                    className={`p-1.5 rounded-lg ${dark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                    <ChevronRight className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`} />
                </button>
            </div>
            <div className="grid grid-cols-7 mb-2">
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                    <div key={d} className={`text-center text-[11px] font-bold py-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array(firstDayOfWeek).fill(null).map((_, i) => <div key={`e${i}`} />)}
                {days.map(date => {
                    const isPast = date < today;
                    const isSelected = selectedDates.some(d => d.toDateString() === date.toDateString());
                    const isToday = date.toDateString() === today.toDateString();
                    return (
                        <button key={date.toDateString()} onClick={() => toggleDate(date)} disabled={isPast}
                            className={`aspect-square rounded-xl text-xs font-semibold transition-all
                                ${isPast ? "opacity-25 cursor-not-allowed" : "cursor-pointer"}
                                ${isSelected ? "bg-orange-500 text-white shadow-md scale-105"
                                : isToday ? dark ? "border border-orange-500/50 text-orange-400" : "border border-orange-400 text-orange-600"
                                : dark ? "hover:bg-white/10 text-gray-300" : "hover:bg-orange-50 text-gray-700"}`}>
                            {date.getDate()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function SubscriptionPage() {
    const { dark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedDates, setSelectedDates] = useState([]);
    const [preOrders, setPreOrders] = useState({}); // { dateKey: { item, subSelections: { [subOptionIndex]: choice } } }
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const totalDays = selectedDates.length;
    const plan = PLANS.find(p => p.id === selectedPlan);
    const isRoyal = selectedPlan === "royal";
    const isChoice = selectedPlan === "deluxe" || selectedPlan === "royal";

    // Calculate total from pre-orders for royal (uses actual item prices), fallback to plan price
    const computedTotal = () => {
        if (!plan || totalDays === 0) return { min: 0, max: 0, exact: null };
        if (isRoyal) {
            const entries = Object.values(preOrders);
            const preOrderedDays = entries.length;
            const preOrderTotal = entries.reduce((sum, e) => sum + (e.item?.price || plan.pricePerDay), 0);
            const remainingDays = totalDays - preOrderedDays;
            const minTotal = preOrderTotal + remainingDays * plan.pricePerDay;
            const maxTotal = preOrderTotal + remainingDays * plan.priceMax;
            // If all days pre-ordered, show exact
            if (remainingDays === 0) return { min: preOrderTotal, max: preOrderTotal, exact: preOrderTotal };
            return { min: minTotal, max: maxTotal, exact: null };
        }
        const total = plan.pricePerDay * totalDays;
        return { min: total, max: total, exact: total };
    };

    const totals = computedTotal();
    const startDate = selectedDates[0];
    const endDate = selectedDates[selectedDates.length - 1];

    const handleProceedToCalendar = async () => {
        if (!selectedPlan) return setError("Please select a plan");
        setError("");
        if (isChoice && menuItems.length === 0) {
            try {
                const res = await fetch(`${API_BASE}/api/menu/${selectedPlan}`);
                const data = await res.json();
                if (data.success) setMenuItems(data.data || []);
            } catch {}
        }
        setStep(2);
    };

    const handleProceedToPreOrder = () => {
        if (totalDays < MIN_DAYS) return setError(`Select at least ${MIN_DAYS} days`);
        setError("");
        if (isChoice) setStep(3);
        else setStep(4);
    };

    const handleSetPreOrder = (dateKey, item) => {
        setPreOrders(p => ({
            ...p,
            [dateKey]: { item, subSelections: p[dateKey]?.subSelections || {} }
        }));
    };

    const handleSetSubOption = (dateKey, subIndex, choice) => {
        setPreOrders(p => ({
            ...p,
            [dateKey]: {
                ...p[dateKey],
                subSelections: { ...(p[dateKey]?.subSelections || {}), [subIndex]: choice }
            }
        }));
    };

    // Build final selectedItem string including sub-choices
    const buildSelectedItem = (dateKey) => {
        const entry = preOrders[dateKey];
        if (!entry?.item) return "chef_choice";
        const { item, subSelections } = entry;
        if (!item.subOptions?.length || !Object.keys(subSelections).length) return item.itemName;
        const subs = Object.values(subSelections).join(" + ");
        return `${item.itemName} (${subs})`;
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/subscriptions/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ planType: selectedPlan, totalDays, startDate: startDate.toISOString() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create subscription");

            // Save pre-orders
            const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
            for (const [dateKey, entry] of Object.entries(preOrders)) {
                const date = new Date(dateKey);
                await fetch(`${API_BASE}/api/orders/select-meal`, {
                    method: "PATCH", headers,
                    body: JSON.stringify({
                        date: date.toISOString(),
                        selectedItem: buildSelectedItem(dateKey),
                        planType: selectedPlan,
                        isSkipped: false,
                        orderType: "subscription"
                    })
                }).catch(() => {});
            }
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";
    const totalSteps = isChoice ? 4 : 3;

    return (
        <DashboardLayout>
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => step > 1 ? setStep(step - 1) : navigate("/dashboard")}
                    className={`p-2 rounded-xl transition-colors ${dark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                        {step === 1 ? "Choose Your Plan" : step === 2 ? "Select Meal Days" : step === 3 && isChoice ? "Pre-Select Your Meals" : "Confirm & Pay"}
                    </h1>
                    <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>Step {step} of {totalSteps}</p>
                </div>
            </div>

            {/* Step bar */}
            <div className="flex gap-2 mb-7">
                {Array(totalSteps).fill(0).map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300
                        ${i + 1 <= step ? "bg-orange-500" : dark ? "bg-white/10" : "bg-gray-200"}`} />
                ))}
            </div>

            {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                    <Info className="w-4 h-4 flex-shrink-0" />{error}
                </div>
            )}

            {/* ── Step 1: Plan ── */}
            {step === 1 && (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
                        {PLANS.map(p => {
                            const isSelected = selectedPlan === p.id;
                            const accentColor = p.color === "violet" ? "#7c3aed" : p.color === "purple" ? "#6d28d9" : "#ea580c";
                            return (
                                <button key={p.id} onClick={() => setSelectedPlan(p.id)}
                                    className={`relative text-left rounded-2xl p-6 border-2 transition-all duration-200
                                        ${isSelected ? "shadow-lg" : dark ? "border-white/[0.07] hover:border-white/20" : "border-gray-200 hover:border-orange-200"}
                                        ${dark ? "bg-[#181818]" : "bg-white"}`}
                                    style={{ borderColor: isSelected ? accentColor : undefined }}>
                                    {p.badge && (
                                        <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
                                            style={{ background: accentColor }}>
                                            {p.badge}
                                        </span>
                                    )}
                                    {isSelected && <CheckCircle2 className="absolute top-4 left-4 w-5 h-5" style={{ color: accentColor }} />}
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                        style={{ background: `${accentColor}15` }}>
                                        <CalendarCheck className="w-5 h-5" style={{ color: accentColor }} />
                                    </div>
                                    <h3 className={`text-lg font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>{p.name}</h3>
                                    <p className={`text-xs mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>{p.description}</p>
                                    <div className="mb-4">
                                        <span className="text-2xl font-extrabold" style={{ color: accentColor }}>
                                            {p.id === "royal" ? `₹${p.pricePerDay}–₹${p.priceMax}` : `₹${p.pricePerDay}`}
                                        </span>
                                        <span className={`text-xs ml-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>/day</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {p.features.map(f => (
                                            <li key={f} className="flex items-start gap-2 text-xs">
                                                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-emerald-500" />
                                                <span className={dark ? "text-gray-300" : "text-gray-600"}>{f}</span>
                                            </li>
                                        ))}
                                        {p.notIncluded.map(f => (
                                            <li key={f} className="flex items-start gap-2 text-xs opacity-35">
                                                <span className="w-3.5 mt-0.5 flex-shrink-0 text-center">✕</span>
                                                <span className={dark ? "text-gray-400" : "text-gray-500"}>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </button>
                            );
                        })}
                    </div>
                    <div className={`rounded-xl p-4 mb-6 flex items-start gap-3 ${dark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-orange-50 border border-orange-100"}`}>
                        <Info className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <p className={`text-xs leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>
                            Minimum <strong>15 days</strong>. Skip any meal (max 2 skips per period). Payment collected before activation.
                        </p>
                    </div>
                    <button onClick={handleProceedToCalendar}
                        className="w-full py-3.5 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-400 transition-colors flex items-center justify-center gap-2">
                        Continue to Select Days <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* ── Step 2: Calendar ── */}
            {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className={`lg:col-span-2 rounded-2xl p-6 ${card}`}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className={`text-base font-bold ${dark ? "text-white" : "text-gray-900"}`}>Select Meal Days</h3>
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${totalDays >= MIN_DAYS ? "bg-emerald-500/10 text-emerald-400" : dark ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                                {totalDays} / {MIN_DAYS}+ days
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-5">
                            {[15,20,25,30].map(n => (
                                <button key={n} onClick={() => {
                                    const today = new Date(); today.setHours(0,0,0,0);
                                    const dates = []; let d = new Date(today);
                                    while (dates.length < n) { d = new Date(d); d.setDate(d.getDate()+1); dates.push(new Date(d)); }
                                    setSelectedDates(dates);
                                }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${dark ? "bg-white/5 hover:bg-orange-500/20 text-gray-300 hover:text-orange-400" : "bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600"}`}>
                                    Next {n} days
                                </button>
                            ))}
                            {selectedDates.length > 0 && (
                                <button onClick={() => setSelectedDates([])} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10">Clear all</button>
                            )}
                        </div>
                        <CalendarPicker selectedDates={selectedDates} onChange={setSelectedDates} dark={dark} />
                    </div>

                    {/* Summary */}
                    <div className="space-y-4">
                        <div className={`rounded-2xl p-5 ${card}`}>
                            <h4 className={`text-sm font-bold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>Summary</h4>
                            <div className="space-y-3">
                                {[
                                    { label: "Plan", value: plan?.name },
                                    { label: "Price/day", value: isRoyal ? `₹${plan?.pricePerDay}–₹${plan?.priceMax}` : `₹${plan?.pricePerDay}` },
                                    { label: "Days", value: <span className={totalDays >= MIN_DAYS ? "text-emerald-400" : "text-orange-400"}>{totalDays}</span> },
                                    startDate && { label: "Starts", value: startDate?.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) },
                                    endDate && { label: "Ends", value: endDate?.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) },
                                ].filter(Boolean).map(({ label, value }) => (
                                    <div key={label} className="flex justify-between text-sm">
                                        <span className={dark ? "text-gray-400" : "text-gray-500"}>{label}</span>
                                        <span className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{value}</span>
                                    </div>
                                ))}
                                <div className={`border-t pt-3 ${dark ? "border-white/10" : "border-gray-100"}`}>
                                    <div className="flex justify-between items-start">
                                        <span className={`font-bold ${dark ? "text-white" : "text-gray-900"}`}>{isRoyal ? "Est. Total" : "Total"}</span>
                                        <div className="text-right">
                                            <span className="font-extrabold text-orange-500 text-lg">
                                                {isRoyal ? `₹${totals.min}–₹${totals.max}` : `₹${totals.min}`}
                                            </span>
                                            {isRoyal && <p className="text-[10px] text-gray-500">Based on set chosen</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleProceedToPreOrder} disabled={totalDays < MIN_DAYS}
                            className="w-full py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                            {isChoice ? "Next: Pre-Select Meals" : "Continue"} <ArrowRight className="w-4 h-4" />
                        </button>
                        {totalDays < MIN_DAYS && totalDays > 0 && (
                            <p className="text-center text-xs text-amber-400">Select {MIN_DAYS - totalDays} more day{MIN_DAYS - totalDays !== 1 ? "s" : ""}</p>
                        )}
                    </div>
                </div>
            )}

            {/* ── Step 3: Pre-Order (Deluxe/Royal) ── */}
            {step === 3 && isChoice && (
                <div>
                    <div className={`rounded-xl p-3 mb-5 flex items-start gap-2 text-xs ${dark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-orange-50 border border-orange-100"}`}>
                        <Info className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className={dark ? "text-gray-400" : "text-gray-600"}>
                            Optionally pre-select your meal for each day. You can change or skip daily during {isRoyal ? "the WhatsApp window" : "4PM–10PM"}. 
                            {isRoyal && " Royal total updates based on your set selections below."}
                        </span>
                    </div>

                    {/* Live total for royal */}
                    {isRoyal && (
                        <div className={`rounded-xl p-4 mb-5 flex items-center justify-between ${card}`}>
                            <div>
                                <p className={`text-xs font-semibold ${dark ? "text-gray-400" : "text-gray-500"}`}>
                                    Pre-orders: {Object.keys(preOrders).length}/{totalDays} days
                                </p>
                                <p className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                    Unselected days: ₹{plan.pricePerDay}–₹{plan.priceMax}/day
                                </p>
                            </div>
                            <div className="text-right">
                                <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>{totals.exact ? "Exact Total" : "Est. Total"}</p>
                                <p className="text-lg font-extrabold text-orange-500">
                                    {totals.exact ? `₹${totals.exact}` : `₹${totals.min}–₹${totals.max}`}
                                </p>
                            </div>
                        </div>
                    )}

                    {menuItems.length === 0 ? (
                        <div className={`rounded-2xl p-8 text-center ${card}`}>
                            <UtensilsCrossed className={`w-8 h-8 mx-auto mb-2 ${dark ? "text-gray-600" : "text-gray-300"}`} />
                            <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>No menu items added yet.</p>
                            <p className={`text-xs mt-1 ${dark ? "text-gray-600" : "text-gray-300"}`}>You can still proceed and select meals daily via WhatsApp.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 mb-6">
                            {selectedDates.map(date => {
                                const key = date.toDateString();
                                const preOrder = preOrders[key];
                                return (
                                    <div key={key} className={`rounded-2xl p-5 ${card}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <p className={`text-xs font-bold ${dark ? "text-gray-300" : "text-gray-700"}`}>
                                                {date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                                            </p>
                                            {preOrder?.item && (
                                                <span className="text-xs text-orange-400 font-semibold">
                                                    ✓ {preOrder.item.itemName} {preOrder.item.price ? `· ₹${preOrder.item.price}` : ""}
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {[...menuItems].sort((a,b) => (a.optionNumber||0)-(b.optionNumber||0)).map(item => (
                                                <button key={item._id}
                                                    onClick={() => handleSetPreOrder(key, item)}
                                                    className={`text-left p-3 rounded-xl border transition-all text-xs
                                                        ${preOrder?.item?._id === item._id
                                                            ? "border-orange-500 bg-orange-500/10"
                                                            : dark ? "border-white/[0.07] hover:border-white/20" : "border-gray-200 hover:border-orange-300"}`}>
                                                    <p className={`font-semibold mb-0.5 ${dark ? "text-white" : "text-gray-900"}`}>
                                                        {item.optionNumber ? `Set ${item.optionNumber}: ` : ""}{item.itemName}
                                                    </p>
                                                    {item.price && <span className="text-orange-400 font-bold">₹{item.price}</span>}
                                                    {item.components?.length > 0 && (
                                                        <p className={`text-[10px] mt-1 ${dark ? "text-gray-600" : "text-gray-400"}`}>
                                                            {item.components.slice(0,2).join(" · ")}{item.components.length > 2 ? "..." : ""}
                                                        </p>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        {/* Sub-options for selected item */}
                                        {preOrder?.item?.subOptions?.length > 0 && (
                                            <SubOptionSelector
                                                item={preOrder.item}
                                                selectedSubs={preOrder.subSelections || {}}
                                                onChange={(si, choice) => handleSetSubOption(key, si, choice)}
                                                dark={dark}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button onClick={() => setStep(2)} className={`flex-1 py-3 rounded-xl text-sm font-semibold ${dark ? "bg-white/[0.06] text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                            ← Back
                        </button>
                        <button onClick={() => setStep(4)} className="flex-1 py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-400 transition-colors flex items-center justify-center gap-2">
                            Review & Pay <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* ── Step 4: Confirm & Pay ── */}
            {step === 4 && (
                <div className="max-w-lg mx-auto">
                    <div className={`rounded-2xl p-6 mb-5 ${card}`}>
                        <h3 className={`text-base font-bold mb-5 ${dark ? "text-white" : "text-gray-900"}`}>Order Summary</h3>
                        <div className="space-y-4">
                            <div className={`flex items-center gap-3 p-4 rounded-xl ${dark ? "bg-white/[0.04]" : "bg-gray-50"}`}>
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${dark ? "bg-orange-500/10" : "bg-orange-50"}`}>
                                    <CalendarCheck className="w-4 h-4 text-orange-500" />
                                </div>
                                <div>
                                    <p className={`text-sm font-semibold capitalize ${dark ? "text-white" : "text-gray-900"}`}>{plan?.name} Plan</p>
                                    <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                        {isRoyal ? `₹${plan?.pricePerDay}–₹${plan?.priceMax}/day` : `₹${plan?.pricePerDay}/day`}
                                    </p>
                                </div>
                            </div>
                            {[
                                { label: "Total days", value: `${totalDays} days` },
                                { label: "Start date", value: startDate?.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                                { label: "End date", value: endDate?.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                                isChoice && { label: "Pre-orders set", value: `${Object.keys(preOrders).length} / ${totalDays} days` },
                            ].filter(Boolean).map(({ label, value }) => (
                                <div key={label} className="flex justify-between text-sm">
                                    <span className={dark ? "text-gray-400" : "text-gray-500"}>{label}</span>
                                    <span className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{value}</span>
                                </div>
                            ))}
                            <div className={`border-t pt-4 ${dark ? "border-white/10" : "border-gray-100"}`}>
                                <div className="flex justify-between items-start">
                                    <span className={`font-bold ${dark ? "text-white" : "text-gray-900"}`}>{isRoyal && !totals.exact ? "Est. Total" : "Total Amount"}</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-extrabold text-orange-500">
                                            {totals.exact ? `₹${totals.exact}` : `₹${totals.min}–₹${totals.max}`}
                                        </span>
                                        {isRoyal && !totals.exact && <p className="text-[11px] text-gray-500 mt-0.5">Exact bill per daily selection</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isRoyal && (
                        <div className={`rounded-xl p-4 mb-4 flex items-start gap-3 ${dark ? "bg-purple-500/5 border border-purple-500/20" : "bg-purple-50 border border-purple-100"}`}>
                            <Info className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                            <p className={`text-xs leading-relaxed ${dark ? "text-purple-300" : "text-purple-700"}`}>
                                <strong>Royal Plan:</strong> Price varies per set (₹{plan?.pricePerDay}–₹{plan?.priceMax}/day).
                                {totals.exact ? ` Based on your pre-selections, total is ₹${totals.exact}.` : " Unselected days billed at set's actual price."}
                            </p>
                        </div>
                    )}

                    <div className={`rounded-xl p-4 mb-5 flex items-start gap-3 ${dark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-blue-50 border border-blue-100"}`}>
                        <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className={`text-xs ${dark ? "text-gray-400" : "text-blue-700"}`}>
                            Payment via <strong>Razorpay</strong>. Subscription activates after payment.
                        </p>
                    </div>

                    <button onClick={handleSubmit} disabled={loading}
                        className="w-full py-4 rounded-xl font-extrabold text-white text-base bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                        <Zap className="w-5 h-5 fill-white" />
                        {loading ? "Processing..." : totals.exact ? `Pay ₹${totals.exact}` : `Pay ₹${totals.min}–₹${totals.max}`}
                    </button>
                    <p className={`text-center text-xs mt-3 ${dark ? "text-gray-600" : "text-gray-400"}`}>By proceeding you agree to our subscription terms</p>
                </div>
            )}

            <div className="h-10" />
        </DashboardLayout>
    );
}