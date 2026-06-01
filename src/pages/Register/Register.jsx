import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
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
          <h1>ثبت نام</h1>
          <p>برای ادامه، شماره موبایل خود را وارد کنید.</p>
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

          

          <button
            type="submit"
            className="login-form__submit"
            disabled={loading}
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>

        
      </div>
    </div>
  );
}



