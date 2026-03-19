import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import API_BASE from "../../config/api";
import { Gift, Copy, CheckCircle2, Users, Star, Share2 } from "lucide-react";

export default function ReferEarnPage() {
    const { dark } = useContext(ThemeContext);
    const [referral, setReferral] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await window.fetch(`${API_BASE}/api/auth/referral`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setReferral(data.data);
            } catch (e) {
                // fallback to localStorage
                const u = JSON.parse(localStorage.getItem("user") || "{}");
                setReferral({ referralCode: u.referralCode || "—", rewardPoints: 0, referredCount: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const copyCode = () => {
        if (!referral?.referralCode) return;
        navigator.clipboard.writeText(referral.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const shareCode = () => {
        if (navigator.share) {
            navigator.share({
                title: "Tadka Express — Join me!",
                text: `Use my referral code ${referral?.referralCode} to sign up on Tadka Express and get a discount on your first subscription!`,
            });
        } else {
            copyCode();
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

    const steps = [
        { n: "1", title: "Share your code", desc: "Send your unique referral code to friends and family." },
        { n: "2", title: "They sign up",     desc: "Your friend registers using your referral code." },
        { n: "3", title: "You earn points",  desc: "You both get reward points credited after their first subscription." },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">

                <h1 className={`text-xl font-bold mb-6 ${dark ? "text-white" : "text-gray-900"}`}>Refer & Earn</h1>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                    {[
                        { icon: Star,  label: "Reward Points", value: referral?.rewardPoints ?? 0,  color: "text-amber-400", bg: dark ? "bg-amber-500/10" : "bg-amber-50" },
                        { icon: Users, label: "Friends Referred", value: referral?.referredCount ?? 0, color: "text-violet-400", bg: dark ? "bg-violet-500/10" : "bg-violet-50" },
                    ].map(({ icon: Icon, label, value, color, bg }) => (
                        <div key={label} className={`rounded-2xl p-5 ${card}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${bg}`}>
                                <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                            <p className={`text-2xl font-extrabold mb-0.5 ${dark ? "text-white" : "text-gray-900"}`}>{value}</p>
                            <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
                        </div>
                    ))}
                </div>

                {/* Referral code card */}
                <div className={`rounded-2xl p-6 mb-5 ${card}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <Gift className="w-4 h-4 text-orange-500" />
                        <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>Your Referral Code</h3>
                    </div>

                    <div className={`rounded-xl p-4 mb-4 flex items-center justify-between gap-3
                        ${dark ? "bg-orange-500/5 border border-orange-500/20" : "bg-orange-50 border border-orange-200"}`}>
                        <span className="text-2xl font-extrabold tracking-widest text-orange-500">
                            {referral?.referralCode || "—"}
                        </span>
                        <button onClick={copyCode}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                                ${copied
                                    ? "bg-emerald-500 text-white"
                                    : dark ? "bg-white/10 text-gray-300 hover:bg-white/20" : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                                }`}>
                            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>

                    <button onClick={shareCode}
                        className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-orange-500 hover:bg-orange-400 transition-colors flex items-center justify-center gap-2">
                        <Share2 className="w-4 h-4" /> Share with Friends
                    </button>
                </div>

                {/* How it works */}
                <div className={`rounded-2xl p-6 ${card}`}>
                    <h3 className={`text-sm font-bold mb-5 ${dark ? "text-white" : "text-gray-900"}`}>How it works</h3>
                    <div className="space-y-4">
                        {steps.map((s) => (
                            <div key={s.n} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0">
                                    {s.n}
                                </div>
                                <div>
                                    <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{s.title}</p>
                                    <p className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-10" />
        </DashboardLayout>
    );
}