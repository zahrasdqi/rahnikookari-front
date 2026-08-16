// src/pages/NewPassword/NewPassword.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { passwordResetService } from "../../services/passwordReset.service";
import "./NewPassword.scss";

export default function NewPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = sessionStorage.getItem("reset_email");

  // اگر ایمیل نداشتیم، برگرد به اول
  useEffect(() => {
    if (!email) navigate("/forgot-password", { replace: true });
  }, [email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.password) return "لطفاً رمز عبور جدید را وارد کنید.";
    if (formData.password.length < 8) return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    if (!/[A-Z]/.test(formData.password) && !/[a-z]/.test(formData.password))
      return "رمز عبور باید شامل حروف انگلیسی باشد.";
    if (formData.password !== formData.confirm) return "رمز عبور و تکرار آن مطابقت ندارند.";
    return "";
  };

  const getStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0-4
  };

  const strength = getStrength(formData.password);
  const strengthLabels = ["", "ضعیف", "متوسط", "خوب", "عالی"];
  const strengthColors = ["", "#ff6b6b", "#ffa94d", "#74c0fc", "#69db7c"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      setLoading(true);
      await passwordResetService.complete({
        email,
        newPassword: formData.password,
      });
      // پاک‌سازی sessionStorage
      sessionStorage.removeItem("reset_email");
      sessionStorage.removeItem("reset_otp");
      // ریدایرکت به لاگین با پیام موفقیت
      navigate("/login", {
        state: { successMessage: "رمز عبور با موفقیت تغییر کرد. لطفاً وارد شوید." },
        replace: true,
      });
    } catch (err) {
      setError(
        err?.response?.data?.detail?.[0]?.msg ||
          err?.response?.data?.message ||
          "خطا در تغییر رمز عبور. دوباره تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-pass-page">
      <div className="new-pass-page__overlay" />
      <div className="new-pass-card">
        <div className="new-pass-card__header">
          <h1>تعیین رمز عبور جدید</h1>
          <p>رمز عبور جدید خود را وارد کنید.</p>
        </div>

        <form className="new-pass-form" onSubmit={handleSubmit}>
          {/* فیلد رمز جدید */}
          <div className="new-pass-form__group">
            <label htmlFor="password">رمز عبور جدید</label>
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="حداقل ۸ کاراکتر"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-field__toggle"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "مخفی کردن" : "نمایش"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* نوار قدرت رمز */}
            {formData.password && (
              <div className="new-pass-form__strength">
                <div className="strength-bars">
                  {[1, 2, 3, 4].map((level) => (
                    <span
                      key={level}
                      className="strength-bars__bar"
                      style={{
                        background: strength >= level
                          ? strengthColors[strength]
                          : "rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="strength-label"
                  style={{ color: strengthColors[strength] }}
                >
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          {/* فیلد تکرار رمز */}
          <div className="new-pass-form__group">
            <label htmlFor="confirm">تکرار رمز عبور</label>
            <div className="password-field">
              <input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                name="confirm"
                placeholder="رمز عبور را تکرار کنید"
                value={formData.confirm}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-field__toggle"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowConfirm((s) => !s)}
                aria-label={showConfirm ? "مخفی کردن" : "نمایش"}
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {error && <p className="new-pass-form__error">{error}</p>}

          <button
            type="submit"
            className="new-pass-form__submit"
            disabled={loading}
          >
            {loading ? "در حال ذخیره..." : "تغییر رمز عبور"}
          </button>
        </form>
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
