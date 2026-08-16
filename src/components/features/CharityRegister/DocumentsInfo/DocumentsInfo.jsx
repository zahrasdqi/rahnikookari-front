// src/components/features/CharityRegister/DocumentsInfo/DocumentsInfo.jsx
// src/components/features/CharityRegister/DocumentsInfo/DocumentsInfo.jsx
import { useState } from "react";
import FormCard from "../shared/FormCard";
import FormField from "../shared/FormField";
import FormActions from "../shared/FormActions";
import "./DocumentsInfo.scss";

const MAX_SIZE_MB = 5;

function FileUpload({ label, hint, required, value, onChange, error, disabled }) {
  const handleChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      onChange(null, `حجم فایل نباید از ${MAX_SIZE_MB} مگابایت بیشتر باشد`);
      e.target.value = "";
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
            disabled={disabled}
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

  const isSubmitting = status === "submitting";

  const updateFileField = (fieldName, file, errorMessage) => {
    onChange({ [fieldName]: file });

    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage || undefined,
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!data.statute_file) {
      nextErrors.statute_file = "اساسنامه الزامی است";
    }

    if (!data.activity_license_file) {
      nextErrors.activity_license_file = "مجوز فعالیت الزامی است";
    }

    if (!data.national_card_file) {
      nextErrors.national_card_file = "کارت ملی الزامی است";
    }

    if (!data.agreed) {
      nextErrors.agreed = "تأیید قوانین الزامی است";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (isSubmitting) return;

    if (validate()) {
      onSubmit();
    }
  };

  if (status === "pending") {
    return (
      <div className="submit-status submit-status--pending">
        <div className="submit-status__icon">⏳</div>

        <h3>در انتظار بررسی</h3>

        <p>
          درخواست شما با موفقیت ارسال شد. پس از بررسی توسط تیم راه نیک، نتیجه
          از طریق ایمیل اطلاع‌رسانی می‌شود.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <>
        <div className="submit-status submit-status--error">
          <div className="submit-status__icon">⚠️</div>

          <h3>ارسال درخواست ناموفق بود</h3>

          <p>
            مشکلی در ارسال اطلاعات یا بارگذاری مدارک رخ داد. لطفاً اتصال خود را
            بررسی کنید و دوباره تلاش کنید.
          </p>
        </div>

        <FormActions
          onPrev={onPrev}
          onSubmit={handleSubmit}
          isLastStep
          loading={isSubmitting}
        />
      </>
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
          hint="فرمت‌های مجاز: PDF، JPG، JPEG، PNG — حداکثر ۵ مگابایت"
          required
          value={data.statute_file}
          error={errors.statute_file}
          disabled={isSubmitting}
          onChange={(file, errorMessage) =>
            updateFileField("statute_file", file, errorMessage)
          }
        />

        <FileUpload
          label="مجوز فعالیت"
          hint="فرمت‌های مجاز: PDF، JPG، JPEG، PNG — حداکثر ۵ مگابایت"
          required
          value={data.activity_license_file}
          error={errors.activity_license_file}
          disabled={isSubmitting}
          onChange={(file, errorMessage) =>
            updateFileField("activity_license_file", file, errorMessage)
          }
        />

        <FileUpload
          label="کارت ملی نماینده"
          hint="فرمت‌های مجاز: PDF، JPG، JPEG، PNG — حداکثر ۵ مگابایت"
          required
          value={data.national_card_file}
          error={errors.national_card_file}
          disabled={isSubmitting}
          onChange={(file, errorMessage) =>
            updateFileField("national_card_file", file, errorMessage)
          }
        />
      </FormCard>

      <div className="agreement-box">
        <label className="agreement-box__label">
          <input
            type="checkbox"
            checked={data.agreed}
            onChange={(e) => {
              onChange({ agreed: e.target.checked });

              if (e.target.checked) {
                setErrors((prev) => ({
                  ...prev,
                  agreed: undefined,
                }));
              }
            }}
            className="agreement-box__checkbox"
            disabled={isSubmitting}
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
        loading={isSubmitting}
      />
    </>
  );
}
