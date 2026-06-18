// src/components/features/CharityRegister/DocumentsInfo/DocumentsInfo.jsx
import { useState } from "react";
import FormCard from "../shared/FormCard";
import FormField from "../shared/FormField";
import FormActions from "../shared/FormActions";
import "./DocumentsInfo.scss";

const MAX_SIZE_MB = 5;

function FileUpload({ label, hint, required, value, onChange, error }) {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      onChange(null, `حجم فایل نباید از ${MAX_SIZE_MB} مگابایت بیشتر باشد`);
      return;
    }
    onChange(file, null);
  };

  return (
    <FormField label={label} required={required} hint={hint} error={error}>
      <div className={`file-upload ${value ? "file-upload--selected" : ""}`}>
        <label className="file-upload__label">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
            className="file-upload__input"
          />
          <span className="file-upload__icon">📎</span>
          <span className="file-upload__text">
            {value ? value.name : "انتخاب فایل"}
          </span>
        </label>
        <span className="file-upload__status">
          {value ? "فایل انتخاب شده" : "فایلی انتخاب نشده"}
        </span>
      </div>
    </FormField>
  );
}

export default function DocumentsInfo({
  data,
  onChange,
  onSubmit,
  onPrev,
  status,
}) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!data.statute_file) e.statute_file = "اساسنامه الزامی است";
    if (!data.activity_license_file)
      e.activity_license_file = "محور فعالیت الزامی است";
    if (!data.national_card_file)
      e.national_card_file = "کارت ملی الزامی است";
    if (!data.agreed) e.agreed = "تأیید قوانین الزامی است";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit();
  };

  if (status === "pending") {
    return (
      <div className="submit-status submit-status--pending">
        <div className="submit-status__icon">⏳</div>
        <h3>در انتظار بررسی</h3>
        <p>
          درخواست شما ارسال شد. پس از بررسی توسط تیم راه نیک، نتیجه از طریق
          ایمیل اطلاع‌رسانی می‌شود.
        </p>
      </div>
    );
  }

  return (
    <>
      <FormCard
        title="مدارک مؤسسه"
        description="مدارک لازم برای بررسی و اعتبارسنجی مؤسسه را بارگذاری کنید."
      >
        <FileUpload
          label="اساسنامه مؤسسه"
          hint="حجم تصویر: PDF یا ۵ مگابایت"
          required
          value={data.statute_file}
          error={errors.statute_file}
          onChange={(file, err) => {
            onChange({ statute_file: file });
            if (err) setErrors((p) => ({ ...p, statute_file: err }));
            else setErrors((p) => ({ ...p, statute_file: undefined }));
          }}
        />

        <FileUpload
          label="محور فعالیت"
          hint="مجوز مسیر و تاریخچه؛ حداکثر ۵MB"
          required
          value={data.activity_license_file}
          error={errors.activity_license_file}
          onChange={(file, err) => {
            onChange({ activity_license_file: file });
            if (err)
              setErrors((p) => ({ ...p, activity_license_file: err }));
            else
              setErrors((p) => ({ ...p, activity_license_file: undefined }));
          }}
        />

        <FileUpload
          label="کارت ملی نماینده"
          hint="تصویر کارت ملی، معتبر و کمتر از ۵MB"
          required
          value={data.national_card_file}
          error={errors.national_card_file}
          onChange={(file, err) => {
            onChange({ national_card_file: file });
            if (err) setErrors((p) => ({ ...p, national_card_file: err }));
            else setErrors((p) => ({ ...p, national_card_file: undefined }));
          }}
        />
      </FormCard>

      {/* موافقت‌نامه */}
      <div className="agreement-box">
        <label className="agreement-box__label">
          <input
            type="checkbox"
            checked={data.agreed}
            onChange={(e) => onChange({ agreed: e.target.checked })}
            className="agreement-box__checkbox"
          />
          <span>
            تأیید می‌کنم که اطلاعات وارد‌شده صحیح است و مؤسسه اجازه بررسی
            مدارک و استفاده از اطلاعات برای نمایش عمومی را به سامانه راه نیک
            می‌دهد.
          </span>
        </label>
        {errors.agreed && (
          <p className="agreement-box__error">{errors.agreed}</p>
        )}
      </div>

      <FormActions
        onPrev={onPrev}
        onSubmit={handleSubmit}
        isLastStep
        loading={status === "submitting"}
      />
    </>
  );
}
