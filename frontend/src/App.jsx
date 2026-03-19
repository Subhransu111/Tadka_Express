import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import SubscriptionPage from "./pages/dashboard/Subscription";
import ProfilePage from "./pages/dashboard/Profile";
import ReferEarnPage from "./pages/dashboard/ReferEarn";
import MyOrdersPage from "./pages/dashboard/MyOrders";
import "./index.css";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import DashboardLayout from "./components/dashboard/DashboardLayout";

function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
}

function ComingSoon({ title }) {
    const { dark } = useContext(ThemeContext);
    return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${dark ? "bg-orange-500/10" : "bg-orange-50"}`}>
                    <span className="text-3xl">🚧</span>
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>{title}</h2>
                <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>Coming soon.</p>
            </div>
        </DashboardLayout>
    );
}

function App() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route path="/dashboard"                element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/dashboard/subscription"   element={<PrivateRoute><SubscriptionPage /></PrivateRoute>} />
            <Route path="/dashboard/profile"        element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/dashboard/refer"          element={<PrivateRoute><ReferEarnPage /></PrivateRoute>} />
            <Route path="/dashboard/orders"         element={<PrivateRoute><MyOrdersPage /></PrivateRoute>} />
            <Route path="/dashboard/order"          element={<PrivateRoute><ComingSoon title="Order Food" /></PrivateRoute>} />
            <Route path="/dashboard/wallet"         element={<PrivateRoute><ComingSoon title="Wallet" /></PrivateRoute>} />
            <Route path="/dashboard/support"        element={<PrivateRoute><ComingSoon title="Support" /></PrivateRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;