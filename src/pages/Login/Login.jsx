import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.scss';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.phone || !formData.password) {
      return 'لطفاً همه فیلدها را کامل کنید.';
    }

    if (!/^09\d{9}$/.test(formData.phone)) {
      return 'شماره موبایل معتبر نیست.';
    }

    if (formData.password.length < 6) {
      return 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      // اینجا بعداً API ورود صدا زده می‌شود
      console.log('Login Data:', formData);

      // نمونه: هدایت بعد از ورود موفق
      navigate('/');
    } catch (err) {
      setError('ورود با خطا مواجه شد. دوباره تلاش کنید.');
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
          <p>برای ادامه، شماره موبایل و رمز عبور خودت رو وارد کن</p>
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
            <input
              id="password"
              type="password"
              name="password"
              placeholder="رمز عبور خود را وارد کنید"
              value={formData.password}
              onChange={handleChange}
            />
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
            {loading ? 'در حال ورود...' : 'ورود'}
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
