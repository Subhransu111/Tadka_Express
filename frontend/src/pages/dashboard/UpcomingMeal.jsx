import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import API_BASE from "../../config/api";
import {
    UtensilsCrossed, CheckCircle2, Info, ArrowRight,
    ChefHat, SkipForward, Clock, AlertTriangle, CalendarCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PLAN_LABELS = { basic: "Basic", deluxe: "Deluxe", royal: "Royal" };
const MAX_SKIPS = 2;

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
                    <div className="flex items-center gap-2 mb-1">
                        {selected && <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />}
                        {item.optionNumber && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400">
                                Set {item.optionNumber}
                            </span>
                        )}
                        <h4 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>{item.itemName}</h4>
                    </div>
                    {item.components?.length > 0 && (
                        <p className={`text-xs leading-relaxed ${dark ? "text-gray-500" : "text-gray-400"}`}>
                            {item.components.join(" · ")}
                        </p>
                    )}
                </div>
                {item.price && (
                    <span className="text-sm font-bold text-orange-500 flex-shrink-0">₹{item.price}</span>
                )}
            </div>
        </button>
    );
}


// Sub-option selector
function SubOptionSelector({ item, selectedSubs, onChange, dark }) {
    if (!item?.subOptions?.length) return null;
    return (
        <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
            {item.subOptions.map((sub, si) => (
                <div key={si}>
                    <p className={`text-[11px] font-semibold mb-1.5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                        Choose your {item.components?.[sub.componentIndex]?.split("/")[0] || "option"}:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {sub.choices.map(choice => (
                            <button key={choice} type="button"
                                onClick={() => onChange(si, choice)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all
                                    ${selectedSubs?.[si] === choice
                                        ? "bg-orange-500 text-white"
                                        : dark ? "bg-white/[0.07] text-gray-300 hover:bg-white/15" : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600"}`}>
                                {choice}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function UpcomingMealPage() {
    const { dark } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [subscription, setSubscription] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [existingOrder, setExistingOrder] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [subSelections, setSubSelections] = useState({});
    const [skipCount, setSkipCount] = useState(0);
    const [skipsRemaining, setSkipsRemaining] = useState(MAX_SKIPS);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null); // "confirmed" | "skipped" | "changed"
    const [error, setError] = useState("");
    const [withinWindow, setWithinWindow] = useState(false);
    const [settings, setSettings] = useState({ startTime: "16:00", endTime: "22:00" });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const tomorrowStr = tomorrow.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

    // Check if current time is within admin's change window
    const checkWindow = (s) => {
        const now = new Date();
        const [sh, sm] = s.startTime.split(":").map(Number);
        const [eh, em] = s.endTime.split(":").map(Number);
        const nowMins = now.getHours() * 60 + now.getMinutes();
        const startMins = sh * 60 + sm;
        const endMins = eh * 60 + em;
        return nowMins >= startMins && nowMins <= endMins;
    };

    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Not authenticated");
                const headers = { Authorization: `Bearer ${token}` };

                // Load settings for window check
                const [settingsRes, upcomingRes, subsRes] = await Promise.all([
                    fetch(`${API_BASE}/api/settings`),
                    fetch(`${API_BASE}/api/orders/upcoming`, { headers }),
                    fetch(`${API_BASE}/api/auth/subscriptions`, { headers }),
                ]);

                const settingsData = await settingsRes.json();
                const upcomingData = await upcomingRes.json();
                const subsData = await subsRes.json();

                if (settingsData.success) {
                    const w = settingsData.settings?.whatsappWindow || { startTime: "16:00", endTime: "22:00" };
                    setSettings(w);
                    setWithinWindow(checkWindow(w));
                }

                if (upcomingData.success) {
                    setExistingOrder(upcomingData.data.order);
                    setSubscription(upcomingData.data.subscription);
                    setSkipCount(upcomingData.data.skipCount);
                    setSkipsRemaining(upcomingData.data.skipsRemaining);

                    if (upcomingData.data.subscription) {
                        const menuRes = await fetch(`${API_BASE}/api/menu/${upcomingData.data.subscription.planType}`);
                        const menuData = await menuRes.json();
                        setMenuItems(menuData.data || []);
                    }
                } else if (subsData.success) {
                    const active = subsData.data?.find(s => s.status === "active");
                    setSubscription(active || null);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSubmit = async (isSkipped = false) => {
        if (!isSkipped && subscription?.planType !== "basic" && !selectedItem) {
            return setError("Please select a meal first");
        }
        setSubmitting(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/orders/select-meal`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    date: tomorrow.toISOString(),
                    selectedItem: isSkipped ? "skipped" : (
                        selectedItem && Object.keys(subSelections).length > 0
                            ? `${selectedItem.itemName} (${Object.values(subSelections).join(" + ")})`
                            : selectedItem?.itemName || "chef_choice"
                    ),
                    planType: subscription.planType,
                    isSkipped,
                    orderType: "subscription"
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed");
            setSkipCount(data.skipCount ?? skipCount);
            setSkipsRemaining(data.skipsRemaining ?? skipsRemaining);
            setExistingOrder(data.order);
            setSuccess(isSkipped ? "skipped" : existingOrder ? "changed" : "confirmed");
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

                {/* Header */}
                <div className="mb-6">
                    <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>Upcoming Meal</h1>
                    <p className={`text-sm mt-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        Tomorrow — <span className="text-orange-500 font-medium">{tomorrowStr}</span>
                    </p>
                </div>

                {/* No subscription */}
                {!subscription && (
                    <div className={`rounded-2xl p-10 text-center ${card}`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${dark ? "bg-white/[0.04]" : "bg-orange-50"}`}>
                            <ChefHat className="w-7 h-7 text-orange-500" />
                        </div>
                        <h3 className={`text-base font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>No Active Subscription</h3>
                        <p className={`text-sm mb-5 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                            Subscribe to a plan to manage your upcoming meals.
                        </p>
                        <button onClick={() => navigate("/dashboard/subscription")}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-400 transition-colors mx-auto">
                            Get a Plan <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {subscription && (
                    <>
                        {/* Plan + Skip counter */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className={`rounded-2xl p-4 ${card}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <CalendarCheck className="w-4 h-4 text-orange-500" />
                                    <span className={`text-xs font-semibold ${dark ? "text-gray-400" : "text-gray-500"}`}>Active Plan</span>
                                </div>
                                <p className={`text-base font-extrabold capitalize ${dark ? "text-white" : "text-gray-900"}`}>
                                    {PLAN_LABELS[subscription.planType]}
                                </p>
                                <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                    {subscription.totalDays - (subscription.usedDays || 0)} meals left
                                </p>
                            </div>
                            <div className={`rounded-2xl p-4 ${card} ${skipsRemaining === 0 ? dark ? "border-red-500/20" : "border-red-200" : ""}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <SkipForward className={`w-4 h-4 ${skipsRemaining === 0 ? "text-red-400" : "text-amber-400"}`} />
                                    <span className={`text-xs font-semibold ${dark ? "text-gray-400" : "text-gray-500"}`}>Skips Remaining</span>
                                </div>
                                <p className={`text-base font-extrabold ${skipsRemaining === 0 ? "text-red-400" : dark ? "text-white" : "text-gray-900"}`}>
                                    {skipsRemaining} / {MAX_SKIPS}
                                </p>
                                <p className={`text-xs ${skipsRemaining === 0 ? "text-red-400" : dark ? "text-gray-500" : "text-gray-400"}`}>
                                    {skipsRemaining === 0 ? "Skip limit reached" : "For this period"}
                                </p>
                            </div>
                        </div>

                        {/* Success state */}
                        {success && (
                            <div className={`rounded-2xl p-5 mb-5 flex items-center gap-3
                                ${success === "skipped"
                                    ? dark ? "bg-amber-500/10 border border-amber-500/20" : "bg-amber-50 border border-amber-200"
                                    : dark ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-50 border border-emerald-200"
                                }`}>
                                {success === "skipped"
                                    ? <SkipForward className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                    : <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                }
                                <div>
                                    <p className={`text-sm font-bold ${success === "skipped" ? "text-amber-400" : "text-emerald-400"}`}>
                                        {success === "skipped" ? "Meal skipped for tomorrow" :
                                         success === "changed" ? "Meal updated successfully!" :
                                         "Meal confirmed for tomorrow!"}
                                    </p>
                                    <p className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                        {success === "skipped"
                                            ? `${skipsRemaining} skip${skipsRemaining !== 1 ? "s" : ""} remaining this period.`
                                            : "You can still change or skip during the update window."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Current order status */}
                        {existingOrder && !success && (
                            <div className={`rounded-2xl p-4 mb-5 flex items-center gap-3 ${card}`}
                                style={{ borderLeft: `3px solid ${existingOrder.isSkipped ? "#f59e0b" : "#10b981"}` }}>
                                {existingOrder.isSkipped
                                    ? <SkipForward className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                    : <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
                                        {existingOrder.isSkipped ? "Tomorrow skipped" : `Meal set: ${existingOrder.selectedItem === "chef_choice" ? "Chef's Choice" : existingOrder.selectedItem}`}
                                    </p>
                                    <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                        {withinWindow
                                            ? "Within update window — you can still change or unskip"
                                            : `Updates allowed ${settings.startTime}–${settings.endTime}`}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Window info */}
                        <div className={`rounded-xl p-3 mb-5 flex items-center gap-2 text-xs
                            ${withinWindow
                                ? dark ? "bg-emerald-500/5 border border-emerald-500/15" : "bg-emerald-50 border border-emerald-100"
                                : dark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-gray-50 border border-gray-100"
                            }`}>
                            <Clock className={`w-3.5 h-3.5 flex-shrink-0 ${withinWindow ? "text-emerald-400" : dark ? "text-gray-500" : "text-gray-400"}`} />
                            <span className={withinWindow ? "text-emerald-400" : dark ? "text-gray-400" : "text-gray-500"}>
                                {withinWindow
                                    ? `✅ Within update window (${settings.startTime}–${settings.endTime}) — changes allowed`
                                    : `Change window: ${settings.startTime}–${settings.endTime} daily`}
                            </span>
                        </div>

                        {error && (
                            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />{error}
                            </div>
                        )}

                        {/* Basic — just confirm/skip */}
                        {subscription.planType === "basic" && (
                            <div className={`rounded-2xl p-5 mb-5 ${card}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? "bg-orange-500/10" : "bg-orange-50"}`}>
                                        <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>Chef's Choice</p>
                                        <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>Basic plan — meal prepared fresh daily</p>
                                    </div>
                                </div>
                                <div className={`rounded-xl p-3 ${dark ? "bg-white/[0.04]" : "bg-orange-50"}`}>
                                    <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>
                                        Dal · Sabji · Rice or Roti · Bundi Raita · Achar + Papad · Salad
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Deluxe / Royal — select meal */}
                        {(subscription.planType === "deluxe" || subscription.planType === "royal") && (
                            <div className={`rounded-2xl p-5 mb-5 ${card}`}>
                                <h3 className={`text-sm font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>
                                    Select your meal for tomorrow
                                </h3>
                                <p className={`text-xs mb-4 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                    {subscription.planType === "royal"
                                        ? "Choose one of 7 premium sets"
                                        : "Choose your protein option"}
                                </p>
                                {menuItems.length === 0 ? (
                                    <p className={`text-sm text-center py-6 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                        Menu not available yet. Check back later.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {[...menuItems]
                                            .sort((a, b) => (a.optionNumber || 0) - (b.optionNumber || 0))
                                            .map(item => (
                                                <MenuItemCard
                                                    key={item._id}
                                                    item={item}
                                                    selected={selectedItem?._id === item._id}
                                                    onSelect={(item) => { setSelectedItem(item); setSubSelections({}); }}
                                                    dark={dark}
                                                />
                                            ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Sub-options for selected item */}
                        {selectedItem?.subOptions?.length > 0 && (
                            <div className={`rounded-2xl p-4 mb-4 ${card}`}>
                                <SubOptionSelector
                                    item={selectedItem}
                                    selectedSubs={subSelections}
                                    onChange={(si, choice) => setSubSelections(p => ({...p, [si]: choice}))}
                                    dark={dark}
                                />
                            </div>
                        )}

                        {/* Actions */}
                        {(!existingOrder || withinWindow || success) && (
                            <div className="space-y-3">
                                {/* Confirm button */}
                                {!existingOrder?.isSkipped && (
                                    <button
                                        onClick={() => handleSubmit(false)}
                                        disabled={submitting || (subscription.planType !== "basic" && !selectedItem)}
                                        className="w-full py-3.5 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                        {submitting ? "Confirming..." :
                                         existingOrder ? "Update Selection" :
                                         subscription.planType === "basic" ? "Confirm Tomorrow's Meal" :
                                         "Confirm Selection"}
                                    </button>
                                )}

                                {/* Skip button */}
                                {!existingOrder?.isSkipped ? (
                                    <button
                                        onClick={() => handleSubmit(true)}
                                        disabled={submitting || skipsRemaining === 0}
                                        className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors
                                            ${skipsRemaining === 0
                                                ? "opacity-40 cursor-not-allowed " + (dark ? "bg-white/[0.06] text-gray-500" : "bg-gray-100 text-gray-400")
                                                : dark ? "bg-white/[0.06] text-gray-300 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}>
                                        {skipsRemaining === 0
                                            ? "Skip limit reached (max 2)"
                                            : `Skip Tomorrow's Meal (${skipsRemaining} skip${skipsRemaining !== 1 ? "s" : ""} left)`}
                                    </button>
                                ) : (
                                    /* Un-skip button */
                                    <button
                                        onClick={() => handleSubmit(false)}
                                        disabled={submitting}
                                        className="w-full py-3 rounded-xl font-semibold text-sm text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors">
                                        Undo Skip — Confirm Tomorrow's Meal
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Outside window and order exists */}
                        {existingOrder && !withinWindow && !success && (
                            <div className={`rounded-xl p-4 text-center ${dark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-gray-50 border border-gray-100"}`}>
                                <Clock className={`w-5 h-5 mx-auto mb-2 ${dark ? "text-gray-600" : "text-gray-300"}`} />
                                <p className={`text-sm font-medium ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                    Changes allowed only between {settings.startTime}–{settings.endTime}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="h-10" />
        </DashboardLayout>
    );
}