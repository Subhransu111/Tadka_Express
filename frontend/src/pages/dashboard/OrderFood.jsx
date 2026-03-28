import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import API_BASE from "../../config/api";
import { UtensilsCrossed, CheckCircle2, Info, ArrowRight, ChefHat } from "lucide-react";

const PLAN_LABELS = { basic: "Basic", deluxe: "Deluxe", royal: "Royal" };

function MenuItemCard({ item, selected, onSelect, dark }) {
    return (
        <button onClick={() => onSelect(item)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200
                ${selected
                    ? "border-orange-500 shadow-md shadow-orange-500/10"
                    : dark ? "border-white/[0.07] hover:border-white/20" : "border-gray-200 hover:border-orange-200"
                }
                ${dark ? "bg-[#181818]" : "bg-white"}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        {selected && <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />}
                        <h4 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>{item.itemName}</h4>
                    </div>
                    {item.components?.length > 0 && (
                        <p className={`text-xs leading-relaxed ${dark ? "text-gray-500" : "text-gray-400"}`}>
                            {item.components.join(" · ")}
                        </p>
                    )}
                    {item.availableDays?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {item.availableDays.map(d => (
                                <span key={d} className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                                    ${dark ? "bg-white/[0.06] text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                                    {d.slice(0, 3)}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                {item.price && (
                    <span className="text-sm font-bold text-orange-500 flex-shrink-0">₹{item.price}</span>
                )}
            </div>
        </button>
    );
}

export default function OrderFoodPage() {
    const { dark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Not authenticated");

                // Get active subscription
                const subRes = await fetch(`${API_BASE}/api/auth/subscriptions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const subData = await subRes.json();
                const active = subData.data?.find(s => s.status === "active");
                setSubscription(active || null);

                if (active) {
                    // Get menu for plan
                    const menuRes = await fetch(`${API_BASE}/api/menu/${active.planType}`);
                    const menuData = await menuRes.json();
                    setMenuItems(menuData.data || []);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubmit = async (isSkipped = false) => {
        if (!isSkipped && !selectedItem) return setError("Please select a meal");
        setSubmitting(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/orders/select-meal`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    date: tomorrow.toISOString(),
                    selectedItem: isSkipped ? "skipped" : selectedItem.itemName,
                    planType: subscription.planType,
                    isSkipped,
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to submit");
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";

    if (loading) return (
        <DashboardLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">
                <h1 className={`text-xl font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>Today's Meal</h1>
                <p className={`text-sm mb-6 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                    {subscription?.planType === "basic" ? "Confirm or skip tomorrow's delivery" : "Select your meal for"} <span className="text-orange-500 font-medium">{tomorrowStr}</span>
                </p>

                {/* Success state */}
                {success && (
                    <div className={`rounded-2xl p-8 text-center ${card}`}>
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className={`text-lg font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>
                            Meal Selected!
                        </h3>
                        <p className={`text-sm mb-5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                            Your meal for tomorrow has been confirmed.
                        </p>
                        <button onClick={() => navigate("/dashboard")}
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-400 transition-colors">
                            Back to Dashboard
                        </button>
                    </div>
                )}

                {/* Info note for deluxe/royal users */}
                {!success && subscription && subscription.planType !== "basic" && (
                    <div className={`mb-4 px-4 py-3 rounded-xl text-xs flex items-start gap-2
                        ${dark ? "bg-white/[0.03] border border-white/[0.06] text-gray-400" : "bg-orange-50 border border-orange-100 text-gray-600"}`}>
                        <span className="flex-shrink-0 mt-0.5">💡</span>
                        <span>
                            <strong>Deluxe & Royal users</strong> — select tomorrow's meal before 10 PM. 
                            You'll also get a WhatsApp reminder between 4–10 PM daily.
                        </span>
                    </div>
                )}
                {/* No subscription */}
                {!success && !subscription && (
                    <div className={`rounded-2xl p-10 text-center ${card}`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${dark ? "bg-white/[0.04]" : "bg-orange-50"}`}>
                            <ChefHat className="w-7 h-7 text-orange-500" />
                        </div>
                        <h3 className={`text-base font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>No Active Subscription</h3>
                        <p className={`text-sm mb-5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                            You need an active meal plan to order food.
                        </p>
                        <button onClick={() => navigate("/dashboard/subscription")}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-400 transition-colors mx-auto">
                            Get a Plan <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Has subscription */}
                {!success && subscription && (
                    <>
                        {/* Plan badge */}
                        <div className={`rounded-2xl p-4 mb-5 flex items-center justify-between ${card}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${dark ? "bg-orange-500/10" : "bg-orange-50"}`}>
                                    <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                                </div>
                                <div>
                                    <p className={`text-sm font-semibold capitalize ${dark ? "text-white" : "text-gray-900"}`}>
                                        {PLAN_LABELS[subscription.planType]} Plan
                                    </p>
                                    <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                        {subscription.totalDays - (subscription.usedDays || 0)} meals remaining
                                    </p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Active
                            </span>
                        </div>

                        {error && (
                            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                                <Info className="w-4 h-4 flex-shrink-0" />{error}
                            </div>
                        )}

                        {/* Basic plan — no selection needed */}
                        {subscription.planType === "basic" && (
                            <div className={`rounded-2xl p-6 mb-5 text-center ${card}`}>
                                <p className={`text-sm mb-1 font-semibold ${dark ? "text-white" : "text-gray-900"}`}>Basic Plan — Chef's Choice</p>
                                <p className={`text-xs mb-4 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                    Your meal is prepared fresh daily by our chef. No selection needed.
                                </p>
                                <div className={`rounded-xl p-4 mb-4 ${dark ? "bg-white/[0.04]" : "bg-orange-50"}`}>
                                    <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>
                                        Dal · Sabji · Rice or Roti · Salad
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Deluxe/Royal — show menu options */}
                        {(subscription.planType === "deluxe" || subscription.planType === "royal") && (
                            <div className={`rounded-2xl p-5 mb-5 ${card}`}>
                                <h3 className={`text-sm font-bold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>
                                    Choose your meal for tomorrow
                                </h3>
                                {menuItems.length === 0 ? (
                                    <p className={`text-sm text-center py-6 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                        No menu items available yet. Check back later.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {menuItems.map(item => (
                                            <MenuItemCard
                                                key={item._id}
                                                item={item}
                                                selected={selectedItem?._id === item._id}
                                                onSelect={setSelectedItem}
                                                dark={dark}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-3">
                            <button
                                onClick={() => handleSubmit(false)}
                                disabled={submitting || (subscription.planType !== "basic" && !selectedItem)}
                                className="w-full py-3.5 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                {submitting ? "Confirming..." : subscription.planType === "basic" ? "Confirm Tomorrow's Meal" : "Confirm Selection"}
                            </button>
                            <button
                                onClick={() => handleSubmit(true)}
                                disabled={submitting}
                                className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors
                                    ${dark ? "bg-white/[0.06] text-gray-300 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                                Skip Tomorrow's Meal
                            </button>
                        </div>

                        <p className={`text-xs text-center mt-3 ${dark ? "text-gray-600" : "text-gray-400"}`}>
                            You can change your selection until 10 PM today
                        </p>
                    </>
                )}
            </div>
            <div className="h-10" />
        </DashboardLayout>
    );
}