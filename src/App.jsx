import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/guards/ProtectedRoute";
import GuestRoute from "./components/guards/GuestRoute";

// صفحات عمومی
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Otp from "./pages/Auth/Otp/Otp";

// فراموشی رمز عبور
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ForgotPasswordOTP from "./pages/ForgotPasswordOTP/ForgotPasswordOTP";
import NewPassword from "./pages/NewPassword/NewPassword";

import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* عمومی */}
          <Route path="/" element={<Home />} />

          {/* فقط مهمان */}
          <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/otp"      element={<GuestRoute><Otp /></GuestRoute>} />

          {/* فراموشی رمز عبور — بدون GuestRoute چون کاربر ممکنه لاگین باشه */}
          <Route path="/forgot-password"     element={<ForgotPassword />} />
          <Route path="/forgot-password/otp" element={<ForgotPasswordOTP />} />
          <Route path="/forgot-password/new" element={<NewPassword />} />

          {/* فقط لاگین‌کرده */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* ⚠️ همیشه آخر */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
