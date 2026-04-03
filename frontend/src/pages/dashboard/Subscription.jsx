import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import API_BASE from "../../config/api";
import {
    CalendarCheck, CheckCircle2, ChevronLeft, ChevronRight,
    Zap, Star, ArrowRight, Info
} from "lucide-react";

const PLANS = [
    {
        id: "basic",
        name: "Basic",
        pricePerDay: 90,
        color: "orange",
        description: "Fixed daily meal — no choices needed",
        features: [
            "1 meal per day (chef's choice)",
            "Dal, sabji, rice/roti",
            "Skip any day",
            "WhatsApp delivery notification",
        ],
        notIncluded: ["Meal selection", "Priority delivery"],
    },
    {
        id: "deluxe",
        name: "Deluxe",
        pricePerDay: 130,
        color: "violet",
        description: "Choose your meal every day via WhatsApp",
        features: [
            "1 meal per day (you choose)",
            "Dal, sabji, rice/roti + extras",
            "Daily WhatsApp reminder (4PM–10PM)",
            "Skip any day",
            "Priority delivery",
        ],
        notIncluded: [],
        badge: "Popular",
    },
    {
        id: "royal",
        name: "Royal",
        pricePerDay: 140, // minimum — sets range from 140-170
        priceMax: 170,
        color: "purple",
        description: "7 rotating premium menus with extras",
        features: [
            "1 premium meal per day (you choose)",
            "7 rotating premium sets",
            "Special weekend menu",
            "Dessert included",
            "Daily WhatsApp reminder (4PM–10PM)",
            "Skip any day",
            "Priority + dedicated delivery",
        ],
        notIncluded: [],
        badge: "Premium",
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
        if (exists) {
            onChange(selectedDates.filter(d => d.toDateString() !== key));
        } else {
            onChange([...selectedDates, date].sort((a, b) => a - b));
        }
    };

    const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    const canGoPrev = viewDate > new Date(today.getFullYear(), today.getMonth(), 1);

    return (
        <div>
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} disabled={!canGoPrev}
                    className={`p-1.5 rounded-lg transition-colors ${!canGoPrev ? "opacity-30 cursor-not-allowed" : dark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                    <ChevronLeft className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`} />
                </button>
                <span className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>{monthName}</span>
                <button onClick={nextMonth} className={`p-1.5 rounded-lg transition-colors ${dark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                    <ChevronRight className={`w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`} />
                </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                    <div key={d} className={`text-center text-[11px] font-bold py-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>{d}</div>
                ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
                {Array(firstDayOfWeek).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                {days.map((date) => {
                    const isPast = date < today;
                    const isSelected = selectedDates.some(d => d.toDateString() === date.toDateString());
                    const isToday = date.toDateString() === today.toDateString();

                    return (
                        <button
                            key={date.toDateString()}
                            onClick={() => toggleDate(date)}
                            disabled={isPast}
                            className={`
                                aspect-square rounded-xl text-xs font-semibold transition-all duration-150
                                ${isPast ? "opacity-25 cursor-not-allowed" : "cursor-pointer"}
                                ${isSelected
                                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/30 scale-105"
                                    : isToday
                                        ? dark ? "border border-orange-500/50 text-orange-400" : "border border-orange-400 text-orange-600"
                                        : dark ? "hover:bg-white/10 text-gray-300" : "hover:bg-orange-50 text-gray-700"
                                }
                            `}>
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
    const [step, setStep] = useState(1); // 1: plan, 2: calendar, 3: confirm
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedDates, setSelectedDates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const totalDays = selectedDates.length;
    const plan = PLANS.find(p => p.id === selectedPlan);
    // Royal uses min price for estimate (actual price varies per set chosen)
    const totalPrice = plan ? plan.pricePerDay * totalDays : 0;
    const totalPriceMax = plan?.priceMax ? plan.priceMax * totalDays : totalPrice;
    const isRoyal = plan?.id === "royal";
    const startDate = selectedDates[0];
    const endDate = selectedDates[selectedDates.length - 1];

    // Quick select helpers
    const selectNext = (n) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dates = [];
        let d = new Date(today);
        while (dates.length < n) {
            d = new Date(d);
            d.setDate(d.getDate() + 1);
            dates.push(new Date(d));
        }
        setSelectedDates(dates);
    };

    const handleProceedToCalendar = () => {
        if (!selectedPlan) return setError("Please select a plan");
        setError("");
        setStep(2);
    };

    const handleProceedToConfirm = () => {
        if (totalDays < MIN_DAYS) return setError(`Please select at least ${MIN_DAYS} days`);
        setError("");
        setStep(3);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/subscriptions/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    planType: selectedPlan,
                    totalDays,
                    startDate: startDate.toISOString(),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create subscription");
            // TODO: Integrate Razorpay here with data.order
            // For now navigate to dashboard with success
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const card = (dark)
        ? "bg-[#181818] border border-white/[0.07]"
        : "bg-white border border-gray-100 shadow-sm";

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => step > 1 ? setStep(step - 1) : navigate("/dashboard")}
                    className={`p-2 rounded-xl transition-colors ${dark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                        {step === 1 ? "Choose Your Plan" : step === 2 ? "Select Meal Days" : "Confirm & Pay"}
                    </h1>
                    <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        Step {step} of 3
                    </p>
                </div>
            </div>

            {/* Step indicator */}
            <div className="flex gap-2 mb-7">
                {[1, 2, 3].map(s => (
                    <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300
                        ${s <= step ? "bg-orange-500" : dark ? "bg-white/10" : "bg-gray-200"}`} />
                ))}
            </div>

            {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* ── Step 1: Plan Selection ── */}
            {step === 1 && (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
                        {PLANS.map((p) => {
                            const isSelected = selectedPlan === p.id;
                            return (
                                <button key={p.id} onClick={() => setSelectedPlan(p.id)}
                                    className={`
                                        relative text-left rounded-2xl p-6 border-2 transition-all duration-200
                                        ${isSelected
                                            ? "border-orange-500 shadow-lg shadow-orange-500/10"
                                            : dark ? "border-white/[0.07] hover:border-white/20" : "border-gray-200 hover:border-orange-200"
                                        }
                                        ${dark ? "bg-[#181818]" : "bg-white"}
                                    `}>
                                    {p.badge && (
                                        <span className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider
                                            ${p.color === "purple" ? "bg-purple-500" : p.color === "violet" ? "bg-violet-500" : "bg-orange-500"}`}>
                                            {p.badge}
                                        </span>
                                    )}
                                    {isSelected && (
                                        <div className="absolute top-4 left-4">
                                            <CheckCircle2 className="w-5 h-5 text-orange-500" />
                                        </div>
                                    )}
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${dark ? "bg-orange-500/10" : "bg-orange-50"}`}>
                                        <CalendarCheck className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <h3 className={`text-lg font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>{p.name}</h3>
                                    <p className={`text-xs mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>{p.description}</p>
                                    <div className="mb-4">
                                        <span className="text-2xl font-extrabold text-orange-500">₹{p.pricePerDay}</span>
                                        <span className={`text-xs ml-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>/day</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {p.features.map(f => (
                                            <li key={f} className="flex items-start gap-2 text-xs">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className={dark ? "text-gray-300" : "text-gray-600"}>{f}</span>
                                            </li>
                                        ))}
                                        {p.notIncluded.map(f => (
                                            <li key={f} className="flex items-start gap-2 text-xs opacity-40">
                                                <span className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-center">✕</span>
                                                <span className={dark ? "text-gray-400" : "text-gray-500"}>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </button>
                            );
                        })}
                    </div>

                    {/* Pricing note */}
                    <div className={`rounded-xl p-4 mb-6 flex items-start gap-3 ${dark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-orange-50 border border-orange-100"}`}>
                        <Info className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <p className={`text-xs leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>
                            Minimum subscription is <strong>15 days</strong>. You can skip any meal day — skipped days are not charged.
                            Payment is collected before activation.
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
                    {/* Calendar */}
                    <div className={`lg:col-span-2 rounded-2xl p-6 ${card}`}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className={`text-base font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                                Select Your Meal Days
                            </h3>
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                totalDays >= MIN_DAYS
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : dark ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-500"
                            }`}>
                                {totalDays} / {MIN_DAYS}+ days
                            </span>
                        </div>

                        {/* Quick select */}
                        <div className="flex flex-wrap gap-2 mb-5">
                            {[15, 20, 25, 30].map(n => (
                                <button key={n} onClick={() => selectNext(n)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                                        ${dark ? "bg-white/5 hover:bg-orange-500/20 text-gray-300 hover:text-orange-400" : "bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600"}`}>
                                    Next {n} days
                                </button>
                            ))}
                            {selectedDates.length > 0 && (
                                <button onClick={() => setSelectedDates([])}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
                                    Clear all
                                </button>
                            )}
                        </div>

                        <CalendarPicker selectedDates={selectedDates} onChange={setSelectedDates} dark={dark} />
                    </div>

                    {/* Summary sidebar */}
                    <div className="space-y-4">
                        <div className={`rounded-2xl p-5 ${card}`}>
                            <h4 className={`text-sm font-bold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>Summary</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className={dark ? "text-gray-400" : "text-gray-500"}>Plan</span>
                                    <span className={`font-semibold capitalize ${dark ? "text-white" : "text-gray-900"}`}>{plan?.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className={dark ? "text-gray-400" : "text-gray-500"}>Price/day</span>
                                    <span className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                                        {plan?.id === "royal" ? `₹${plan.pricePerDay}–₹${plan.priceMax}` : `₹${plan?.pricePerDay}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className={dark ? "text-gray-400" : "text-gray-500"}>Days selected</span>
                                    <span className={`font-semibold ${totalDays >= MIN_DAYS ? "text-emerald-400" : "text-orange-400"}`}>{totalDays}</span>
                                </div>
                                {startDate && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className={dark ? "text-gray-400" : "text-gray-500"}>Starts</span>
                                            <span className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                                                {startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className={dark ? "text-gray-400" : "text-gray-500"}>Ends</span>
                                            <span className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                                                {endDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                            </span>
                                        </div>
                                    </>
                                )}
                                <div className={`border-t pt-3 ${dark ? "border-white/10" : "border-gray-100"}`}>
                                    <div className="flex justify-between items-start">
                                        <span className={`font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                                            {isRoyal ? "Est. Total" : "Total"}
                                        </span>
                                        <div className="text-right">
                                            <span className="font-extrabold text-orange-500 text-lg">
                                                {isRoyal ? `₹${totalPrice}–₹${totalPriceMax}` : `₹${totalPrice}`}
                                            </span>
                                            {isRoyal && (
                                                <p className="text-[10px] text-gray-500 mt-0.5">Based on set chosen daily</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleProceedToConfirm} disabled={totalDays < MIN_DAYS}
                            className="w-full py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                            Confirm Days <ArrowRight className="w-4 h-4" />
                        </button>
                        {totalDays < MIN_DAYS && totalDays > 0 && (
                            <p className="text-center text-xs text-amber-400">
                                Select {MIN_DAYS - totalDays} more day{MIN_DAYS - totalDays !== 1 ? "s" : ""} to continue
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* ── Step 3: Confirm & Pay ── */}
            {step === 3 && (
                <div className="max-w-lg mx-auto">
                    <div className={`rounded-2xl p-6 mb-5 ${card}`}>
                        <h3 className={`text-base font-bold mb-5 ${dark ? "text-white" : "text-gray-900"}`}>Order Summary</h3>

                        <div className="space-y-4">
                            {/* Plan */}
                            <div className={`flex items-center justify-between p-4 rounded-xl ${dark ? "bg-white/[0.04]" : "bg-gray-50"}`}>
                                <div className="flex items-center gap-3">
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
                            </div>

                            {/* Details */}
                            {[
                                { label: "Total days", value: `${totalDays} days` },
                                { label: "Start date", value: startDate?.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                                { label: "End date",   value: endDate?.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between text-sm">
                                    <span className={dark ? "text-gray-400" : "text-gray-500"}>{label}</span>
                                    <span className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{value}</span>
                                </div>
                            ))}

                            <div className={`border-t pt-4 ${dark ? "border-white/10" : "border-gray-100"}`}>
                                <div className="flex justify-between items-start">
                                    <span className={`font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                                        {isRoyal ? "Est. Total" : "Total Amount"}
                                    </span>
                                    <div className="text-right">
                                        <span className="text-2xl font-extrabold text-orange-500">
                                            {isRoyal ? `₹${totalPrice}–₹${totalPriceMax}` : `₹${totalPrice}`}
                                        </span>
                                        {isRoyal && (
                                            <p className="text-[11px] text-gray-500 mt-0.5">Varies by set chosen</p>
                                        )}
                                    </div>
                                </div>
                                {!isRoyal && (
                                    <p className={`text-xs mt-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                        Inclusive of all taxes
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Royal note */}
                    {isRoyal && (
                        <div className={`rounded-xl p-4 mb-4 flex items-start gap-3 ${dark ? "bg-purple-500/5 border border-purple-500/20" : "bg-purple-50 border border-purple-100"}`}>
                            <Info className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                            <p className={`text-xs leading-relaxed ${dark ? "text-purple-300" : "text-purple-700"}`}>
                                <strong>Royal Plan:</strong> Price varies per set (₹{plan?.pricePerDay}–₹{plan?.priceMax}/day).
                                You select your set daily via WhatsApp. The estimated total shown is based on the minimum price.
                                Exact billing is calculated per day based on your selection.
                            </p>
                        </div>
                    )}
                    {/* Razorpay note */}
                    <div className={`rounded-xl p-4 mb-5 flex items-start gap-3 ${dark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-blue-50 border border-blue-100"}`}>
                        <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className={`text-xs leading-relaxed ${dark ? "text-gray-400" : "text-blue-700"}`}>
                            Payment is processed securely via <strong>Razorpay</strong>. Your subscription activates immediately after payment.
                        </p>
                    </div>

                    <button onClick={handleSubmit} disabled={loading}
                        className="w-full py-4 rounded-xl font-extrabold text-white text-base
                            bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25
                            hover:shadow-orange-500/40 hover:-translate-y-0.5 disabled:opacity-60
                            transition-all duration-300 flex items-center justify-center gap-2">
                        <Zap className="w-5 h-5 fill-white" />
                        {loading ? "Processing..." : isRoyal ? `Pay ₹${totalPrice}–₹${totalPriceMax}` : `Pay ₹${totalPrice}`}
                    </button>

                    <p className={`text-center text-xs mt-3 ${dark ? "text-gray-600" : "text-gray-400"}`}>
                        By proceeding you agree to our subscription terms
                    </p>
                </div>
            )}

            <div className="h-10" />
        </DashboardLayout>
    );
}