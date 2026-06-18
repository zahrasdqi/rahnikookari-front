// src/components/features/CharityRegister/FinancialInfo/FinancialInfo.jsx
import { useState } from "react";
import FormCard from "../shared/FormCard";
import FormField from "../shared/FormField";
import FormActions from "../shared/FormActions";

const BANKS = [
  "بانک ملی", "بانک ملت", "بانک صادرات", "بانک تجارت",
  "بانک رفاه", "بانک سپه", "بانک مسکن", "سایر"
];

export default function FinancialInfo({ data, onChange, onNext, onPrev }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    const shebaRegex = /^IR[0-9]{24}$/;

    if (!data.bank_name) e.bank_name = "نام بانک الزامی است";
    if (!data.sheba.trim()) e.sheba = "شماره شبا الزامی است";
    else if (!shebaRegex.test(data.sheba.trim()))
      e.sheba = "شبا باید با IR شروع شود و ۲۶ کاراکتر باشد";
    if (!data.account_owner.trim())
      e.account_owner = "نام صاحب حساب الزامی است";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <>
      <FormCard
        title="اطلاعات مالی"
        description="این اطلاعات برای واریز و تسهیم کمک‌های مالی استفاده می‌شود."
      >
        <FormField label="نام بانک" required error={errors.bank_name}>
          <select
            value={data.bank_name}
            onChange={(e) => onChange({ bank_name: e.target.value })}
          >
            <option value="">مثلاً بانک ملی</option>
            {BANKS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="شماره شبا"
          required
          error={errors.sheba}
          hint="شماره باید با IR شروع شود و ۲۶ کاراکتر باشد"
        >
          <input
            type="text"
            placeholder="IRxxxxxxxxxxxxxxxxxxxxxxxx"
            value={data.sheba}
            onChange={(e) =>
              onChange({ sheba: e.target.value.toUpperCase() })
            }
            dir="ltr"
            maxLength={26}
          />
        </FormField>

        <FormField
          label="نام صاحب حساب"
          required
          fullWidth
          error={errors.account_owner}
        >
          <input
            type="text"
            placeholder="نام مؤسسه یا صاحب حساب رسمی"
            value={data.account_owner}
            onChange={(e) => onChange({ account_owner: e.target.value })}
          />
        </FormField>
      </FormCard>

      <FormActions onNext={handleNext} onPrev={onPrev} />
    </>
  );
}
