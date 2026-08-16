// src/pages/ForgotPassword/ForgotPassword.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { passwordResetService } from "../../services/passwordReset.service";
import "./ForgotPassword.scss";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email) return "لطفاً ایمیل خود را وارد کنید.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "ایمیل معتبر نیست.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      setLoading(true);
      await passwordResetService.start({ email });
      // ذخیره ایمیل برای مراحل بعد
      sessionStorage.setItem("reset_email", email);
      navigate("/forgot-password/otp");
    } catch (err) {
      setError(
        err?.response?.data?.detail?.[0]?.msg ||
          err?.response?.data?.message ||
          "خطا در ارسال کد. دوباره تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-page__overlay" />
      <div className="forgot-card">
        <div className="forgot-card__header">
          <h1>فراموشی رمز عبور</h1>
          <p>ایمیل حساب کاربری خود را وارد کنید تا کد تأیید برایتان ارسال شود.</p>
        </div>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="forgot-form__group">
            <label htmlFor="email">ایمیل</label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              autoComplete="email"
            />
          </div>

          {error && <p className="forgot-form__error">{error}</p>}

          <button
            type="submit"
            className="forgot-form__submit"
            disabled={loading}
          >
            {loading ? "در حال ارسال..." : "ارسال کد تأیید"}
          </button>
        </form>

        <div className="forgot-card__footer">
          <Link to="/login">بازگشت به ورود</Link>
        </div>
      </div>
    </div>
  );
}
