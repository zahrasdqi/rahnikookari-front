// src/components/features/CharityRegister/ContactInfo/ContactInfo.jsx
import { useState } from "react";
import FormCard from "../shared/FormCard";
import FormField from "../shared/FormField";
import FormActions from "../shared/FormActions";

const PROVINCES = [
  "تهران", "اصفهان", "فارس", "خراسان رضوی", "مازندران",
  "آذربایجان شرقی", "کرمان", "گیلان", "خوزستان", "سایر"
];

export default function ContactInfo({ data, onChange, onNext, onPrev }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    const phoneRegex = /^0[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.phone.trim()) e.phone = "شماره تماس الزامی است";
    else if (!phoneRegex.test(data.phone))
      e.phone = "فرمت شماره صحیح نیست (مثلاً ۰۲۱۱۲۳۴۵۶۷۸)";

    if (!data.email.trim()) e.email = "ایمیل الزامی است";
    else if (!emailRegex.test(data.email)) e.email = "ایمیل معتبر نیست";

    if (!data.province) e.province = "استان الزامی است";
    if (!data.city.trim()) e.city = "شهر الزامی است";
    if (!data.address.trim()) e.address = "آدرس کامل الزامی است";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <>
      <FormCard
        title="اطلاعات تماس و آدرس"
        description="راه‌های ارتباطی رسمی مؤسسه را ثبت کنید."
      >
        <FormField label="شماره تماس" required error={errors.phone}>
          <input
            type="tel"
            placeholder="مثلاً ۰۲۱۱۲۳۴۵۶۷۸"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            dir="ltr"
          />
        </FormField>

        <FormField label="ایمیل" required error={errors.email}>
          <input
            type="email"
            placeholder="info@example.org"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            dir="ltr"
          />
        </FormField>

        <FormField label="وب‌سایت" hint="اختیاری">
          <input
            type="url"
            placeholder="https://example.org"
            value={data.website}
            onChange={(e) => onChange({ website: e.target.value })}
            dir="ltr"
          />
        </FormField>

        <FormField label="استان" required error={errors.province}>
          <select
            value={data.province}
            onChange={(e) => onChange({ province: e.target.value })}
          >
            <option value="">انتخاب استان</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="شهر" required error={errors.city}>
          <input
            type="text"
            placeholder="مثلاً تهران"
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
          />
        </FormField>

        <FormField label="آدرس کامل" required fullWidth error={errors.address}>
          <textarea
            placeholder="آدرس دفتر مرکزی مؤسسه را حداقل در یک جمله وارد کنید..."
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
          />
        </FormField>
      </FormCard>

      <FormActions onNext={handleNext} onPrev={onPrev} />
    </>
  );
}
