import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import { authService } from "../../services/auth.service";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      return "لطفاً همه فیلدها را کامل کنید.";
    }

    if (formData.fullName.trim().length < 3) {
      return "نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "ایمیل معتبر نیست.";
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
      await authService.register(formData);
      // ایمیل را برای تأیید OTP پاس می‌دهیم
      navigate("/otp", { state: { email: formData.email } });
    } catch (err) {
  const data = err?.response?.data;
  const status = err?.response?.status;

  if (status === 429) {
    const wait = data?.retry_after_seconds;
    setError(`تعداد درخواست‌ها زیاد است.${wait ? ` لطفاً ${wait} ثانیه صبر کنید.` : ''}`);
  } else {
    setError(typeof data?.message === "string" ? data.message : "ثبت‌نام با خطا مواجه شد. دوباره تلاش کنید.");
  }
  }
  };


  return (
    <div className="login-page">
      <div className="login-page__overlay" />
            <div className="login-card">
        <div className="login-card__header">
          <h1>ثبت نام</h1>
          
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__group">
            <label htmlFor="fullName">نام و نام خانوادگی</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="مثلاً زهرا احمدی"
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>

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
                placeholder="حداقل ۶ کاراکتر"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
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

          <button type="submit" className="login-form__submit" disabled={loading}>
            {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </button>
        </form>

        <div className="login-card__footer">
          <span>قبلاً ثبت‌نام کرده‌ای؟</span>
          <Link to="/login">ورود</Link>
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