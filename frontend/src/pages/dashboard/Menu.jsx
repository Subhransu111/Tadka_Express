import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import API_BASE from "../../config/api";
import { UtensilsCrossed, ArrowRight, CheckCircle2, Star } from "lucide-react";

const PLANS = [
    {
        id: "basic",
        name: "Basic",
        price: "₹90/day",
        color: "orange",
        badge: null,
        accent: "#ea580c",
        desc: "Fixed daily chef's choice meal",
        emoji: "🍱",
    },
    {
        id: "deluxe",
        name: "Deluxe",
        price: "₹130/day",
        color: "violet",
        badge: "Popular",
        accent: "#7c3aed",
        desc: "Choose your food daily via WhatsApp",
        emoji: "👑",
    },
    {
        id: "royal",
        name: "Royal",
        price: "₹140–170/day",
        color: "purple",
        badge: "Premium",
        accent: "#6d28d9",
        desc: "7 rotating premium sets — pick your set daily",
        emoji: "🎖️",
    },
];

function MenuCard({ item, dark, accent }) {
    return (
        <div className={`rounded-2xl p-4 transition-all hover:-translate-y-0.5
            ${dark ? "bg-[#1e1e1e] border border-white/[0.06]" : "bg-white border border-gray-100 shadow-sm hover:shadow-md"}`}>
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {item.optionNumber && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                style={{ background: `${accent}15`, color: accent }}>
                                Set {item.optionNumber}
                            </span>
                        )}
                        <h4 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                            {item.itemName}
                        </h4>
                    </div>
                    {item.price && (
                        <p className="text-xs font-bold" style={{ color: accent }}>₹{item.price}</p>
                    )}
                </div>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0`}
                    style={{ background: `${accent}12` }}>
                    <UtensilsCrossed className="w-4 h-4" style={{ color: accent }} />
                </div>
            </div>
            {item.components?.length > 0 && (
                <ul className="space-y-1">
                    {item.components.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs">
                            <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: accent }} />
                            <span className={dark ? "text-gray-400" : "text-gray-600"}>{c}</span>
                        </li>
                    ))}
                </ul>
            )}
            {item.availableDays?.length > 0 && item.availableDays.length < 7 && (
                <div className="flex flex-wrap gap-1 mt-3">
                    {item.availableDays.map(d => (
                        <span key={d} className={`text-[10px] px-1.5 py-0.5 rounded font-medium
                            ${dark ? "bg-white/[0.05] text-gray-500" : "bg-gray-100 text-gray-400"}`}>
                            {d.slice(0, 3)}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function MenuPage() {
    const { dark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [activePlan, setActivePlan] = useState("basic");
    const [menuItems, setMenuItems] = useState({});
    const [loading, setLoading] = useState(false);

    // Load menu for selected plan
    useEffect(() => {
        if (menuItems[activePlan]) return; // already loaded
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/api/menu/${activePlan}`);
                const data = await res.json();
                if (data.success) {
                    setMenuItems(prev => ({ ...prev, [activePlan]: data.data || [] }));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [activePlan]);

    const currentPlan = PLANS.find(p => p.id === activePlan);
    const items = menuItems[activePlan] || [];
    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-6">
                <h1 className={`text-xl font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>Our Menu</h1>
                <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>
                    Browse what's included in each plan before subscribing
                </p>
            </div>

            {/* Plan selector tabs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {PLANS.map(plan => (
                    <button key={plan.id} onClick={() => setActivePlan(plan.id)}
                        className={`relative rounded-2xl p-4 text-left transition-all border-2
                            ${activePlan === plan.id
                                ? "shadow-lg"
                                : dark ? "border-white/[0.07] hover:border-white/20" : "border-gray-200 hover:border-gray-300"
                            }`}
                        style={{
                            borderColor: activePlan === plan.id ? plan.accent : undefined,
                            background: activePlan === plan.id
                                ? dark ? `${plan.accent}10` : `${plan.accent}08`
                                : dark ? "#181818" : "#fff",
                            boxShadow: activePlan === plan.id ? `0 8px 24px ${plan.accent}20` : undefined
                        }}>
                        {plan.badge && (
                            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                                style={{ background: plan.accent }}>
                                {plan.badge}
                            </span>
                        )}
                        <span className="text-xl mb-2 block">{plan.emoji}</span>
                        <p className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>{plan.name}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: plan.accent }}>{plan.price}</p>
                        <p className={`text-[11px] mt-1 hidden sm:block ${dark ? "text-gray-500" : "text-gray-400"}`}>{plan.desc}</p>
                    </button>
                ))}
            </div>

            {/* Plan summary banner */}
            <div className={`rounded-2xl p-5 mb-5 flex items-center justify-between gap-4 flex-wrap ${card}`}
                style={{ borderLeft: `4px solid ${currentPlan?.accent}` }}>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{currentPlan?.emoji}</span>
                        <h2 className={`text-base font-extrabold ${dark ? "text-white" : "text-gray-900"}`}>
                            {currentPlan?.name} Plan
                        </h2>
                        <span className="text-sm font-bold" style={{ color: currentPlan?.accent }}>
                            — {currentPlan?.price}
                        </span>
                    </div>
                    <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{currentPlan?.desc}</p>
                    {activePlan === "royal" && (
                        <p className={`text-xs mt-1 font-medium`} style={{ color: currentPlan?.accent }}>
                            ✦ Price varies by set chosen each day (₹140–₹170). Select via WhatsApp daily.
                        </p>
                    )}
                    {activePlan === "deluxe" && (
                        <p className={`text-xs mt-1 font-medium`} style={{ color: currentPlan?.accent }}>
                            ✦ Same base meal as Basic + you choose your protein (Paneer/Egg/Chicken/Fish) daily via WhatsApp.
                        </p>
                    )}
                </div>
                <button onClick={() => navigate("/dashboard/subscription")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0 transition-all hover:scale-105"
                    style={{ background: `linear-gradient(135deg, ${currentPlan?.accent}, ${currentPlan?.accent}cc)` }}>
                    Subscribe Now <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Menu items */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                </div>
            ) : items.length === 0 ? (
                <div className={`rounded-2xl p-12 text-center ${card}`}>
                    <UtensilsCrossed className={`w-10 h-10 mx-auto mb-3 ${dark ? "text-gray-700" : "text-gray-300"}`} />
                    <p className={`text-sm font-semibold ${dark ? "text-gray-500" : "text-gray-400"}`}>
                        Menu not published yet
                    </p>
                    <p className={`text-xs mt-1 ${dark ? "text-gray-600" : "text-gray-400"}`}>
                        The admin hasn't added menu items for the {currentPlan?.name} plan yet.
                    </p>
                </div>
            ) : (
                <>
                    {/* Basic — single daily thali */}
                    {activePlan === "basic" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {items.map(item => (
                                <MenuCard key={item._id} item={item} dark={dark} accent={currentPlan?.accent} />
                            ))}
                        </div>
                    )}

                    {/* Deluxe — show with protein highlight */}
                    {activePlan === "deluxe" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {items.map(item => (
                                <MenuCard key={item._id} item={item} dark={dark} accent={currentPlan?.accent} />
                            ))}
                        </div>
                    )}

                    {/* Royal — show all 7 sets in order */}
                    {activePlan === "royal" && (
                        <>
                            <div className={`rounded-xl p-3 mb-4 flex items-center gap-2 text-xs
                                ${dark ? "bg-purple-500/5 border border-purple-500/15 text-purple-300"
                                : "bg-purple-50 border border-purple-100 text-purple-700"}`}>
                                <Star className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>
                                    <strong>7 rotating sets</strong> — you choose one set per day via WhatsApp.
                                    Each set has a different price (₹140–₹170).
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[...items].sort((a, b) => (a.optionNumber || 0) - (b.optionNumber || 0)).map(item => (
                                    <MenuCard key={item._id} item={item} dark={dark} accent={currentPlan?.accent} />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            
            <div className="h-10" />
        </DashboardLayout>
    );
}