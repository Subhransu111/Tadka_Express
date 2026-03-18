import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import "./index.css";

// ── Protected Route ──
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

// ── Placeholder pages for dashboard sub-routes ──
import DashboardLayout from "./components/dashboard/DashboardLayout";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";

function ComingSoon({ title }) {
  const { dark } = useContext(ThemeContext);
  return (
    <DashboardLayout>
      <div className={`flex flex-col items-center justify-center min-h-[60vh] text-center`}>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${dark ? "bg-orange-500/10" : "bg-orange-50"}`}>
          <span className="text-3xl">🚧</span>
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>{title}</h2>
        <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>This page is coming soon.</p>
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

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/dashboard/order"        element={<PrivateRoute><ComingSoon title="Order Food" /></PrivateRoute>} />
      <Route path="/dashboard/orders"       element={<PrivateRoute><ComingSoon title="My Orders" /></PrivateRoute>} />
      <Route path="/dashboard/subscription" element={<PrivateRoute><ComingSoon title="Subscription" /></PrivateRoute>} />
      <Route path="/dashboard/wallet"       element={<PrivateRoute><ComingSoon title="Wallet" /></PrivateRoute>} />
      <Route path="/dashboard/refer"        element={<PrivateRoute><ComingSoon title="Refer & Earn" /></PrivateRoute>} />
      <Route path="/dashboard/profile"      element={<PrivateRoute><ComingSoon title="Profile" /></PrivateRoute>} />
      <Route path="/dashboard/support"      element={<PrivateRoute><ComingSoon title="Support" /></PrivateRoute>} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;