import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/guards/ProtectedRoute";
import GuestRoute from "./components/guards/GuestRoute";
import RoleRoute from "./components/guards/RoleRoute";
import ScrollToTop from "./components/ScrollToTop";
import { ROLES } from "./constants/roles";
import ApprovedCharityRoute from "./components/guards/ApprovedCharityRoute";
import { Link } from "react-router-dom";


import Header from "./components/layout/Header/Header";

// صفحات عمومی
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Otp from "./pages/Auth/Otp/Otp";
import Terms from "./pages/Terms/Terms";
import About from "./pages/About/About";
import Onboarding from "./pages/Onboarding/Onboarding";
import Institutions from './pages/Institutions/Institutions';
import InstitutionDetail from './pages/Institutions/InstitutionDetail';
import Campaigns from "./pages/Campaigns/Campaigns";
import CampaignDetail from "./pages/CampaignDetail/CampaignDetail";
import PaymentResult from "./pages/PaymentResult/PaymentResult";

// صفحات خصوصی
import CharityRegister from "./pages/CharityRegister/CharityRegister";
import CharityProfileEdit from "./pages/CharityProfileEdit/CharityProfileEdit";
import Notifications from "./pages/Notifications/Notifications";

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

function AppContent() {
  const location = useLocation();

  // صفحاتی که نباید هدر داشته باشند
  const hideHeaderRoutes = [
    "/login",
    "/register",
    "/otp",
    "/forgot-password",
    "/forgot-password/otp",
    "/forgot-password/new",
    "/notifications",
    "/onboarding",
  ];

  const hideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}

      <ScrollToTop />

      <Routes>
        {/* عمومی */}
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/institutions" element={<Institutions />} />
        <Route path="/institutions/:slug" element={<InstitutionDetail />} /> 
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/:id" element={<CampaignDetail />} />
        <Route path="/payment-result" element={<PaymentResult />} />

        {/* فقط مهمان */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        <Route
          path="/otp"
          element={
            <GuestRoute>
              <Otp />
            </GuestRoute>
          }
        />

        {/* فراموشی رمز عبور */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/otp" element={<ForgotPasswordOTP />} />
        <Route path="/forgot-password/new" element={<NewPassword />} />

        {/* داشبورد کاربر donor */}
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
            <ApprovedCharityRoute>
              <CharityDashboard />
            </ApprovedCharityRoute>
          }
        />

  {/* ویرایش نمایه خیریه */}
      <Route
    path="/charity/profile/edit/:profileId"
    element={
      <ProtectedRoute>
        <CharityProfileEdit />
      </ProtectedRoute>
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

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* همیشه آخر */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    );
  }

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
