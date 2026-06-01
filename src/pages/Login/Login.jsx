import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.phone || !formData.password) {
      return "لطفاً همه فیلدها را کامل کنید.";
    }

    if (!/^09\d{9}$/.test(formData.phone)) {
      return "شماره موبایل معتبر نیست.";
    }

    if (formData.password.length < 6) {
      return "رمز عبور باید حداقل ۶ کاراکتر باشد.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      // اینجا بعداً API ورود صدا زده می‌شود
      console.log("Login Data:", formData);

      // نمونه: هدایت بعد از ورود موفق
      navigate("/");
    } catch (err) {
      setError("ورود با خطا مواجه شد. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__overlay" />
      <h1 className="login-page__brand">راه نیک</h1>
      <div className="login-card">
        <div className="login-card__header">
          <h1>ورود به حساب کاربری</h1>
          <p>برای ادامه، شماره موبایل و رمز عبور خود را وارد کنید.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__group">
            <label htmlFor="phone">شماره موبایل</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="09xxxxxxxxx"
              value={formData.phone}
              onChange={handleChange}
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
                onMouseDown={(e) => e.preventDefault()} // فوکوس از input نپره
                onClick={() => setShowPassword((s) => !s)}
                aria-label={
                  showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"
                }
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          {error && <p className="login-form__error">{error}</p>}

          <div className="login-form__actions">
            <Link to="/change-password" className="login-form__link">
              فراموشی یا تغییر رمز عبور
            </Link>
          </div>

          <button
            type="submit"
            className="login-form__submit"
            disabled={loading}
          >
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
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.6 10.6a2.5 2.5 0 0 0 3.3 3.3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 7 9.5 7c1.7 0 3.2-.4 4.4-1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M19.8 17.8C21.2 16 21.5 12 21.5 12s-3.5-7-9.5-7c-1.2 0-2.3.2-3.3.6"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
