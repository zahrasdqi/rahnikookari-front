import React from "react";
import "./InstitutionProfileTab.scss";

const institutionData = {
  title: "نمایه عمومی و اطلاعات",
  subtitle: "اطلاعات مؤسسه",
  institutionName: "موسسه خیریه امید فردا",
  description:
    "موسسه امید فردا با هدف حمایت از کودکان بی‌سرپرست، خانواده‌های کم‌برخوردار و اجرای پویش‌های شفاف اجتماعی فعالیت می‌کند.",
  labels: [
    { label: "شناسه ملی", value: "1400332210" },
    { label: "شماره ثبت", value: "221.9" },
    { label: "نام رسمی", value: "موسسه خیریه امید فردا" },
    { label: "استان و شهر", value: "تهران، تهران" },
    { label: "حوزه فعالیت", value: "آموزش و سلامت" },
    { label: "سال تأسیس", value: "1396" },
    { label: "ایمیل", value: "contact@omidfarda.org", ltr: true },
    { label: "شماره تماس", value: "0212222211", ltr: true },
    { label: "نماینده مؤسسه", value: "علی نوری" },
    { label: "شماره شبا", value: "IR3301200000000001234567890", ltr: true, wide: true },
    { label: "آدرس کامل", value: "تهران، خیابان ولیعصر، پلاک ۲۴، طبقه دوم", wide: true },
  ],
  chips: [
    { text: "نشان تایید شده", variant: "success" },
    { text: "۸ سال سابقه فعالیت", variant: "neutral" },
    { text: "دارای مجوز رسمی", variant: "info" },
  ],
};

export default function InstitutionProfileTab() {
  return (
    <section className="institution-profile">
      <div className="institution-profile__header">
        <div className="institution-profile__title-wrap">
          <p className="institution-profile__subtitle">{institutionData.subtitle}</p>
          <h2 className="institution-profile__title">{institutionData.title}</h2>
        </div>

        <button className="institution-profile__edit-btn" type="button">
          ویرایش اطلاعات
        </button>
      </div>

      <div className="institution-profile__grid">
        {/* Summary block */}
        <div className="institution-profile__summary">
          <h3 className="institution-profile__summary-title">
            {institutionData.institutionName}
          </h3>

          <p className="institution-profile__summary-desc">
            {institutionData.description}
          </p>

          <div className="institution-profile__chips">
            {institutionData.chips.map((chip) => (
              <span
                key={chip.text}
                className={`institution-profile__chip institution-profile__chip--${chip.variant}`}
              >
                {chip.text}
              </span>
            ))}
          </div>
        </div>

        {/* Cards */}
        {institutionData.labels.map((item) => (
          <div
            key={item.label}
            className={`institution-profile__card ${
              item.wide ? "institution-profile__card--wide" : ""
            }`}
          >
            <span className="institution-profile__label">{item.label}</span>
            <strong
              className={`institution-profile__value ${
                item.ltr ? "institution-profile__value--ltr" : ""
              }`}
            >
              {item.value}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}
