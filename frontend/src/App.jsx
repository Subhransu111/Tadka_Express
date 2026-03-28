import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import SubscriptionPage from "./pages/dashboard/Subscription";
import ProfilePage from "./pages/dashboard/Profile";
import ReferEarnPage from "./pages/dashboard/ReferEarn";
import MyOrdersPage from "./pages/dashboard/MyOrders";
import OrderFoodPage from "./pages/dashboard/OrderFood";
import SupportPage from "./pages/dashboard/Support";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDeliveries from "./pages/admin/AdminDeliveries";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminSubscriptions from "./pages/admin/AdminSubscription";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminManageAdmins from "./pages/admin/AdminManageAdmins";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import { ThemeContext } from "./context/ThemeContext";
import "./index.css";

function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token) return <Navigate to="/login" replace />;
    if (user.role !== "admin" && user.role !== "superadmin") return <Navigate to="/dashboard" replace />;
    return children;
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
            <Route path="/"         element={<Home />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Dashboard */}
            <Route path="/dashboard"                element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/dashboard/order"          element={<PrivateRoute><OrderFoodPage /></PrivateRoute>} />
            <Route path="/dashboard/orders"         element={<PrivateRoute><MyOrdersPage /></PrivateRoute>} />
            <Route path="/dashboard/subscription"   element={<PrivateRoute><SubscriptionPage /></PrivateRoute>} />
            <Route path="/dashboard/refer"          element={<PrivateRoute><ReferEarnPage /></PrivateRoute>} />
            <Route path="/dashboard/profile"        element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/dashboard/support"        element={<PrivateRoute><SupportPage /></PrivateRoute>} />

            {/* Admin Dashboard */}
            <Route path="/admin/dashboard"      element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/deliveries"     element={<AdminRoute><AdminDeliveries /></AdminRoute>} />
            <Route path="/admin/menu"           element={<AdminRoute><AdminMenu /></AdminRoute>} />
            <Route path="/admin/subscriptions"  element={<AdminRoute><AdminSubscriptions /></AdminRoute>} />
            <Route path="/admin/users"          element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/banners"        element={<AdminRoute><AdminBanners /></AdminRoute>} />
            <Route path="/admin/settings"       element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/admins"         element={<AdminRoute><AdminManageAdmins /></AdminRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;