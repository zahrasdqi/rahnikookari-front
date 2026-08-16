// src/components/features/CharityRegister/BasicInfo/BasicInfo.jsx
import { useState } from "react";
import FormCard from "../shared/FormCard";
import FormField from "../shared/FormField";
import FormActions from "../shared/FormActions";

const ACTIVITY_FIELDS = [
  "بهداشت و درمان",
  "آموزش و پژوهش",
  "محیط زیست",
  "کمک به معلولین",
  "حمایت از کودکان",
  "توانمندسازی زنان",
  "امداد و نجات",
  "سایر",
];

export default function BasicInfo({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.org_name.trim()) e.org_name = "نام مؤسسه الزامی است";
    if (!data.registration_number.trim())
      e.registration_number = "شماره ثبت الزامی است";
    if (!data.established_date) e.established_date = "تاریخ تأسیس الزامی است";
    if (!data.activity_field) e.activity_field = "حوزه فعالیت الزامی است";
    if (!data.description.trim()) e.description = "معرفی مؤسسه الزامی است";
    if (data.description.trim().length > 500)
      e.description = "حداکثر ۵۰۰ کاراکتر";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <>
      <FormCard
        title="اطلاعات پایه مؤسسه"
        description="مشخصات رسمی مؤسسه خیریه را وارد کنید."
      >
        <FormField label="نام رسمی مؤسسه" required error={errors.org_name}>
          <input
            type="text"
            placeholder="نام ثبت‌شده مؤسسه"
            value={data.org_name}
            onChange={(e) => onChange({ org_name: e.target.value })}
          />
        </FormField>

        <FormField
          label="شماره ثبت"
          required
          error={errors.registration_number}
        >
          <input
            type="text"
            placeholder="مثلاً ۱۳۳۲۵"
            value={data.registration_number}
            onChange={(e) =>
              onChange({ registration_number: e.target.value })
            }
            dir="ltr"
          />
        </FormField>

        <FormField
          label="تاریخ تأسیس"
          required
          error={errors.established_date}
        >
          <input
            type="date"
            value={data.established_date}
            onChange={(e) => onChange({ established_date: e.target.value })}
            dir="ltr"
          />
        </FormField>

        <FormField
          label="حوزه فعالیت"
          required
          error={errors.activity_field}
        >
          <select
            value={data.activity_field}
            onChange={(e) => onChange({ activity_field: e.target.value })}
          >
            <option value="">انتخاب کنید</option>
            {ACTIVITY_FIELDS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="معرفی کوتاه مؤسسه"
          required
          fullWidth
          error={errors.description}
          hint={`${data.description.length}/500 کاراکتر`}
        >
          <textarea
            placeholder="درباره مأموریت، سابقه و هدف مؤسسه حداقل در یک جمله توضیح دهید..."
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            maxLength={500}
          />
        </FormField>
      </FormCard>

      <FormActions onNext={handleNext} isFirstStep />
    </>
  );
}
