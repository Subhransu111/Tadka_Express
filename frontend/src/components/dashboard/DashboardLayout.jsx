import { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function DashboardLayout({ children }) {
    const { dark } = useContext(ThemeContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={`flex h-screen overflow-hidden ${dark ? "bg-[#0a0a0a]" : "bg-slate-50"}`}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <TopNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}