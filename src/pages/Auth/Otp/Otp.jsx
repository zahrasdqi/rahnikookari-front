import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Otp.scss";
import { authService } from "../../../services/auth.service";

export default function Otp() {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email || "کاربر عزیز";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const inputsRef = useRef([]);

  const otpValue = useMemo(() => otp.join(""), [otp]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 3) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputsRef.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim();
    if (!/^\d{4}$/.test(data)) return;
    setOtp(data.split(""));
    inputsRef.current[3]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpValue.length < 4) {
      setError("لطفاً کد ۴ رقمی را کامل وارد کنید.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await authService.verifyOtp({ email: userEmail, otp: otpValue });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.detail?.[0]?.msg || "کد وارد شده صحیح نیست."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setError("");
      setResendMsg("");
      await authService.resendOtp({ email: userEmail });
      setResendMsg("کد جدید ارسال شد.");
    } catch {
      setError("ارسال مجدد کد با خطا مواجه شد.");
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card">
        <p className="otp-card__label">کد otp را وارد کنید</p>

        <form className="otp-form" onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`otp-input${error ? " otp-input--error" : ""}`}
              />
            ))}
          </div>

          {error && <p className="otp-form__error">{error}</p>}
          {resendMsg && <p className="otp-form__hint">{resendMsg}</p>}

          <button
            type="submit"
            className="otp-button"
            disabled={loading || otpValue.length < 4}
          >
            {loading ? "در حال بررسی..." : "ورود"}
          </button>
        </form>

        <button
          type="button"
          className="otp-resend"
          onClick={handleResend}
        >
          ارسال مجدد کد
        </button>
      </div>
    </div>
  );
}
