
// src/pages/Login/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Login.scss";
import { useAuth } from "../../contexts/AuthContext";
import { dashboardPathForRole } from "../../constants/roles";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );

  useEffect(() => {
    if (location.state?.successMessage) {
      window.history.replaceState({}, document.title);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password)
      return "لطفاً همه فیلدها را کامل کنید.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "ایمیل معتبر نیست.";
    if (formData.password.length < 6)
      return "رمز عبور باید حداقل ۶ کاراکتر باشد.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      // login حالا کاربرِ کامل (با role) را برمی‌گرداند
      const me = await login({
        email: formData.email,
        password: formData.password,
      });

      // مقصد بر اساس نقش کاربر
      const roleDest = dashboardPathForRole(me?.role);

      // اگر کاربر از مسیر خصوصیِ مشخصی پرت شده بود، همان را ترجیح بده،
      // در غیر این صورت داشبورد نقش‌محور
      const dest = location.state?.from?.pathname || roleDest;

      navigate(dest, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.detail?.[0]?.msg ||
          err?.response?.data?.message ||
          "ایمیل یا رمز عبور اشتباه است."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__overlay" />
      <div className="login-card">
        <div className="login-card__header">
          <h1>ورود به حساب کاربری</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {successMessage && (
            <p className="login-form__success">{successMessage}</p>
          )}

          <div className="login-form__group">
            <label htmlFor="email">ایمیل</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              dir="ltr"
              autoComplete="email"
            />
          </div>

          <div className="login-form__group">
            <label htmlFor="password">رمز عبور</label>
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="رمز عبور خود را وارد کنید"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-field__toggle"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {error && <p className="login-form__error">{error}</p>}

          <div className="login-form__actions">
            <Link to="/forgot-password" className="login-form__link">
              رمز عبور خود را فراموش کرده اید؟
            </Link>
          </div>

          <button type="submit" className="login-form__submit" disabled={loading}>
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>

        <div className="login-card__footer">
          <span>حساب کاربری نداری؟</span>
          <Link to="/register">ثبت‌نام</Link>
        </div>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10.6 10.6a2.5 2.5 0 0 0 3.3 3.3" stroke="currentColor" strokeWidth="2" />
      <path d="M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 7 9.5 7c1.7 0 3.2-.4 4.4-1" stroke="currentColor" strokeWidth="2" />
      <path d="M19.8 17.8C21.2 16 21.5 12 21.5 12s-3.5-7-9.5-7c-1.2 0-2.3.2-3.3.6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
