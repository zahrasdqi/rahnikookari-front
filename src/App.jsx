import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/guards/ProtectedRoute";
import GuestRoute from "./components/guards/GuestRoute";
import RoleRoute from "./components/guards/RoleRoute";
import ScrollToTop from "./components/ScrollToTop";
import { ROLES } from "./constants/roles";

// صفحات عمومی
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Otp from "./pages/Auth/Otp/Otp";
import Terms from "./pages/Terms/Terms";
import About from "./pages/About/About";

// صفحات خصوصی
import CharityRegister from "./pages/CharityRegister/CharityRegister";

// فراموشی رمز عبور
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ForgotPasswordOTP from "./pages/ForgotPasswordOTP/ForgotPasswordOTP";
import NewPassword from "./pages/NewPassword/NewPassword";

// داشبوردها
import DonorDashboard from "./pages/Dashboard/DonorDashboard"; 
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import VerifierDashboard from "./pages/Dashboard/VerifierDashboard";
import CharityDashboard from "./pages/Dashboard/CharityDashboard";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* عمومی */}
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />

          {/* فقط مهمان */}
          <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/otp"      element={<GuestRoute><Otp /></GuestRoute>} />

          {/* فراموشی رمز عبور */}
          <Route path="/forgot-password"     element={<ForgotPassword />} />
          <Route path="/forgot-password/otp" element={<ForgotPasswordOTP />} />
          <Route path="/forgot-password/new" element={<NewPassword />} />

          {/* داشبورد کاربر (donor) */}
          <Route
            path="/dashboard"
            element={
              <RoleRoute allow={[ROLES.DONOR]}>
                <DonorDashboard /> 
              </RoleRoute>
            }
          />

          {/* داشبورد ادمین */}
          <Route
            path="/admin"
            element={
              <RoleRoute allow={[ROLES.ADMIN]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          {/* داشبورد تأییدکننده */}
          <Route
            path="/verifier"
            element={
              <RoleRoute allow={[ROLES.VERIFIER]}>
                <VerifierDashboard />
              </RoleRoute>
            }
          />

          {/* داشبورد سازمان خیریه */}
          <Route
            path="/charity"
            element={
              <RoleRoute allow={[ROLES.CHARITY]}>
                <CharityDashboard />
              </RoleRoute>
            }
          />

          {/* مسیری که فقط نیاز به لاگین دارد بدون قید نقش */}
          <Route
            path="/charity-register"
            element={
              <ProtectedRoute>
                <CharityRegister />
              </ProtectedRoute>
            }
          />

          {/* همیشه آخر */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
