// src/pages/ForgotPasswordOTP/ForgotPasswordOTP.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { passwordResetService } from "../../services/passwordReset.service";
import "./ForgotPasswordOTP.scss";

const OTP_LENGTH = 4;
const RESEND_TIMEOUT = 120; // ثانیه

export default function ForgotPasswordOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_TIMEOUT);
  const inputRefs = useRef([]);

  // خواندن ایمیل از sessionStorage
  const email = sessionStorage.getItem("reset_email");

  // ریدایرکت اگر ایمیل نداشتیم
  useEffect(() => {
    if (!email) navigate("/forgot-password", { replace: true });
  }, [email, navigate]);

  // تایمر countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // فوکوس اول اینپوت
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // فقط عدد
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => (newOtp[i] = ch));
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const otpValue = otp.join("");
    if (otpValue.length < OTP_LENGTH) return setError("لطفاً کد 4 رقمی را کامل وارد کنید.");

    try {
      setLoading(true);
      await passwordResetService.verify({ email, otp: otpValue });
      // ذخیره OTP تأیید‌شده برای مرحله بعد
      sessionStorage.setItem("reset_otp", otpValue);
      navigate("/forgot-password/new");
    } catch (err) {
      setError(
        err?.response?.data?.detail?.[0]?.msg ||
          err?.response?.data?.message ||
          "کد وارد شده نادرست یا منقضی است."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resendLoading) return;
    try {
      setResendLoading(true);
      await passwordResetService.resendOtp({ email });
      setOtp(Array(OTP_LENGTH).fill(""));
      setCountdown(RESEND_TIMEOUT);
      setError("");
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(
        err?.response?.data?.message || "خطا در ارسال مجدد کد."
      );
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="fp-otp-page">
      <div className="fp-otp-page__overlay" />
      <div className="fp-otp-card">
        <div className="fp-otp-card__header">
          <h1>کد تأیید را وارد کنید</h1>
          <p>
            کد ۴ رقمی ارسال‌شده به{" "}
            <span className="fp-otp-card__email" dir="ltr">
              {email}
            </span>{" "}
            را وارد کنید.
          </p>
        </div>

        <form className="fp-otp-form" onSubmit={handleSubmit}>
          <div className="fp-otp-form__inputs" dir="ltr" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={digit ? "filled" : ""}
                aria-label={`رقم ${i + 1}`}
              />
            ))}
          </div>

          {error && <p className="fp-otp-form__error">{error}</p>}

          <button
            type="submit"
            className="fp-otp-form__submit"
            disabled={loading || otp.join("").length < OTP_LENGTH}
          >
            {loading ? "در حال بررسی..." : "تأیید کد"}
          </button>
        </form>

        <div className="fp-otp-card__resend">
          {countdown > 0 ? (
            <span>
              ارسال مجدد کد تا <strong dir="ltr">{formatTime(countdown)}</strong>
            </span>
          ) : (
            <button
              type="button"
              className="fp-otp-card__resend-btn"
              onClick={handleResend}
              disabled={resendLoading}
            >
              {resendLoading ? "در حال ارسال..." : "ارسال مجدد کد"}
            </button>
          )}
        </div>

        <div className="fp-otp-card__footer">
          <button
            type="button"
            className="fp-otp-card__back"
            onClick={() => {
              sessionStorage.removeItem("reset_email");
              navigate("/forgot-password");
            }}
          >
            ← تغییر ایمیل
          </button>
        </div>
      </div>
    </div>
  );
}
