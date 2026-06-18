// src/components/features/DonorDashboard/SecurityTab/SecurityTab.jsx

import { useState } from "react";
import { profileService } from "../../../../services/profile.service";
import "./SecurityTab.scss";

export default function SecurityTab() {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [status, setStatus] = useState({ msg: "", type: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setStatus({ msg: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.new_password !== form.confirm_password) {
      setStatus({ msg: "رمز عبور جدید و تکرار آن یکسان نیستند.", type: "error" });
      return;
    }

    try {
      setSubmitting(true);
      await profileService.changePassword(form);
      setStatus({ msg: "رمز عبور با موفقیت تغییر کرد.", type: "success" });
      setForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setStatus({ msg: "تغییر رمز عبور انجام نشد. لطفاً دوباره تلاش کنید.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="security-tab">
      <div className="security-tab__content">
        <div className="security-tab__intro">
          <span className="security-tab__eyebrow">امنیت حساب</span>
          <h3>تغییر رمز عبور</h3>
          <p>
            برای حفظ امنیت حساب، رمز فعلی را وارد کنید و سپس رمز عبور جدیدتان را ثبت کنید.
          </p>
        </div>

        <form className="security-form" onSubmit={handleSubmit}>
          <div className="security-form__group">
            <label>رمز عبور فعلی</label>
            <input
              type="password"
              placeholder="رمز عبور فعلی را وارد کنید"
              required
              value={form.current_password}
              onChange={(e) => handleChange("current_password", e.target.value)}
            />
          </div>

          <div className="security-form__group">
            <label>رمز عبور جدید</label>
            <input
              type="password"
              placeholder="رمز عبور جدید"
              required
              value={form.new_password}
              onChange={(e) => handleChange("new_password", e.target.value)}
            />
          </div>

          <div className="security-form__group">
            <label>تکرار رمز عبور جدید</label>
            <input
              type="password"
              placeholder="تکرار رمز عبور جدید"
              required
              value={form.confirm_password}
              onChange={(e) => handleChange("confirm_password", e.target.value)}
            />
          </div>

          <button type="submit" className="security-form__submit" disabled={submitting}>
            {submitting ? "در حال ثبت..." : "ثبت رمز عبور جدید"}
          </button>

          {status.msg && (
            <div className={`security-form__status security-form__status--${status.type}`}>
              {status.msg}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
