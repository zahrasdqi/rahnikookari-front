//rahnikookari-front\src\pages\Onboarding\Onboarding.jsx
import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../services/auth.service";
import "./Onboarding.scss";

export default function Onboarding() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const validate = () => {
    if (!token) return "لینک فعال‌سازی معتبر نیست یا token داخل آدرس وجود ندارد.";
    if (!form.password) return "لطفاً رمز عبور جدید را وارد کنید.";
    if (form.password.length < 8) return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    if (form.password !== form.confirmPassword) return "تکرار رمز عبور با رمز عبور یکسان نیست.";
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await authService.completeVerifierOnboarding({
         token,
         newPassword: form.password,
        });


      setSuccess("رمز عبور با موفقیت ثبت شد. حالا می‌توانید وارد حساب خود شوید.");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
  console.group("Onboarding Error");
  console.log("FULL ERROR:", err);
  console.log("ERROR MESSAGE:", err?.message);
  console.log("ERROR RESPONSE:", err?.response);
  console.log("ERROR RESPONSE DATA:", err?.response?.data);
  console.log("ERROR STATUS:", err?.response?.status);
  console.groupEnd();

  setError(
    err?.response?.data?.detail ||
    err?.response?.data?.message ||
    err?.message ||
    "ثبت رمز عبور ناموفق بود. لطفاً دوباره تلاش کنید."
  );
}
 finally {
      setLoading(false);
    }
  };

  return (
    <main className="onboarding-page">
      <section className="onboarding-card">
        <div className="onboarding-card__header">
          <span className="onboarding-card__badge">تکمیل حساب ارزیاب</span>
          <h1>تعیین رمز عبور</h1>
          <p>
            برای فعال‌سازی حساب verifier، رمز عبور جدیدتان را وارد کنید.
          </p>
        </div>

        {!token && (
          <div className="onboarding-alert onboarding-alert--error">
            لینک فعال‌سازی ناقص است. لطفاً از لینک ارسال‌شده در ایمیل استفاده کنید.
          </div>
        )}

        {error && (
          <div className="onboarding-alert onboarding-alert--error">
            {error}
          </div>
        )}

        {success && (
          <div className="onboarding-alert onboarding-alert--success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="onboarding-form">
          <label>
            رمز عبور جدید
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="حداقل ۸ کاراکتر"
              autoComplete="new-password"
              disabled={loading || !token}
            />
          </label>

          <label>
            تکرار رمز عبور
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="رمز عبور را دوباره وارد کنید"
              autoComplete="new-password"
              disabled={loading || !token}
            />
          </label>

          <button type="submit" disabled={loading || !token}>
            {loading ? "در حال ثبت..." : "ثبت رمز عبور"}
          </button>
        </form>

        <div className="onboarding-card__footer">
          <Link to="/login">قبلاً رمز عبور دارید؟ ورود</Link>
        </div>
      </section>
    </main>
  );
}
