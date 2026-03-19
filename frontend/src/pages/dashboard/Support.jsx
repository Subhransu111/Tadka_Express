import { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { HeadphonesIcon, MessageCircle, Phone, Mail, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";

const FAQS = [
    {
        q: "How do I skip a meal?",
        a: "Go to Order Food → click 'Skip Tomorrow's Meal'. You can skip any day before 10 PM the previous evening."
    },
    {
        q: "Can I change my meal selection after confirming?",
        a: "Yes, you can change your selection any time before 10 PM the previous day. Just go to Order Food and reselect."
    },
    {
        q: "What time is delivery?",
        a: "Meals are delivered between 12 PM – 2 PM for lunch. You'll get a WhatsApp notification when your order is out for delivery."
    },
    {
        q: "How do I cancel my subscription?",
        a: "Go to Subscription → Manage Plan → Cancel. Your access continues until the current period ends."
    },
    {
        q: "How are reward points calculated?",
        a: "You earn reward points when someone signs up using your referral code and activates their first subscription."
    },
    {
        q: "What is the minimum subscription period?",
        a: "Minimum subscription is 15 days. You can select up to 30 days at a time and renew anytime."
    },
];

function FaqItem({ faq, dark }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`rounded-xl overflow-hidden border transition-all ${dark ? "border-white/[0.07]" : "border-gray-100"}`}>
            <button onClick={() => setOpen(!open)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors
                    ${dark ? "hover:bg-white/[0.04]" : "hover:bg-gray-50"}`}>
                <span className={`text-sm font-semibold pr-4 ${dark ? "text-white" : "text-gray-900"}`}>{faq.q}</span>
                {open
                    ? <ChevronUp className={`w-4 h-4 flex-shrink-0 ${dark ? "text-orange-400" : "text-orange-500"}`} />
                    : <ChevronDown className={`w-4 h-4 flex-shrink-0 ${dark ? "text-gray-500" : "text-gray-400"}`} />
                }
            </button>
            {open && (
                <div className={`px-4 pb-4 text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>
                    {faq.a}
                </div>
            )}
        </div>
    );
}

export default function SupportPage() {
    const { dark } = useContext(ThemeContext);
    const [form, setForm] = useState({ subject: "", message: "" });
    const [sent, setSent] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.subject.trim() || !form.message.trim()) return;
        // TODO: wire to backend support ticket system
        setSent(true);
    };

    const card = dark ? "bg-[#181818] border border-white/[0.07]" : "bg-white border border-gray-100 shadow-sm";
    const input = dark
        ? "bg-white/[0.05] border-white/[0.08] text-gray-200 placeholder-gray-600 focus:border-orange-500/50"
        : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:bg-white";

    const contacts = [
        { icon: Phone,          label: "Call us",       value: "+91 98765 43210",          sub: "Mon–Sat, 9AM–7PM" },
        { icon: MessageCircle,  label: "WhatsApp",      value: "+91 98765 43210",          sub: "Quick response" },
        { icon: Mail,           label: "Email",         value: "support@tadkaexpress.com", sub: "Reply within 24hrs" },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? "bg-orange-500/10" : "bg-orange-50"}`}>
                        <HeadphonesIcon className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>Support</h1>
                        <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>We're here to help</p>
                    </div>
                </div>

                {/* Contact options */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    {contacts.map(({ icon: Icon, label, value, sub }) => (
                        <div key={label} className={`rounded-2xl p-4 text-center ${card}`}>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2.5 ${dark ? "bg-orange-500/10" : "bg-orange-50"}`}>
                                <Icon className="w-4 h-4 text-orange-500" />
                            </div>
                            <p className={`text-xs font-bold mb-0.5 ${dark ? "text-white" : "text-gray-900"}`}>{label}</p>
                            <p className={`text-[10px] font-medium ${dark ? "text-orange-400" : "text-orange-500"}`}>{value}</p>
                            <p className={`text-[10px] mt-0.5 ${dark ? "text-gray-600" : "text-gray-400"}`}>{sub}</p>
                        </div>
                    ))}
                </div>

                {/* Send a message */}
                <div className={`rounded-2xl p-6 mb-5 ${card}`}>
                    <h3 className={`text-sm font-bold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>Send a Message</h3>

                    {sent ? (
                        <div className="text-center py-6">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <p className={`text-sm font-semibold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>Message Sent!</p>
                            <p className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>
                                We'll get back to you within 24 hours.
                            </p>
                            <button onClick={() => { setSent(false); setForm({ subject: "", message: "" }); }}
                                className="mt-4 text-xs text-orange-500 hover:text-orange-400 font-medium">
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className={`text-xs font-semibold mb-1.5 block ${dark ? "text-gray-400" : "text-gray-500"}`}>Subject</label>
                                <input name="subject" value={form.subject} onChange={handleChange} required
                                    placeholder="e.g. Issue with my order"
                                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all ${input}`} />
                            </div>
                            <div>
                                <label className={`text-xs font-semibold mb-1.5 block ${dark ? "text-gray-400" : "text-gray-500"}`}>Message</label>
                                <textarea name="message" value={form.message} onChange={handleChange} required rows={4}
                                    placeholder="Describe your issue..."
                                    className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all resize-none ${input}`} />
                            </div>
                            <button type="submit"
                                className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-orange-500 hover:bg-orange-400 transition-colors">
                                Send Message
                            </button>
                        </form>
                    )}
                </div>

                {/* FAQs */}
                <div className={`rounded-2xl p-6 ${card}`}>
                    <h3 className={`text-sm font-bold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>Frequently Asked Questions</h3>
                    <div className="space-y-2">
                        {FAQS.map((faq) => (
                            <FaqItem key={faq.q} faq={faq} dark={dark} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-10" />
        </DashboardLayout>
    );
}