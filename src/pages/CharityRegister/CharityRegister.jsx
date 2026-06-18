// src/pages/CharityRegister/CharityRegister.jsx
import { useState } from "react";
import Header from "../../components/layout/Header/Header";
import StepsSidebar from "../../components/features/CharityRegister/StepsSidebar/StepsSidebar";
import BasicInfo from "../../components/features/CharityRegister/BasicInfo/BasicInfo";
import ContactInfo from "../../components/features/CharityRegister/ContactInfo/ContactInfo";
import FinancialInfo from "../../components/features/CharityRegister/FinancialInfo/FinancialInfo";
import DocumentsInfo from "../../components/features/CharityRegister/DocumentsInfo/DocumentsInfo";
import "./CharityRegister.scss";

const STEPS = [
  { id: 1, label: "اطلاعات پایه" },
  { id: 2, label: "اطلاعات تماس" },
  { id: 3, label: "اطلاعات مالی" },
  { id: 4, label: "مدارک و ارسال" },
];

export default function CharityRegister() {
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState(null); // null | 'pending' | 'success' | 'error'

  const [formData, setFormData] = useState({
    // اطلاعات پایه
    org_name: "",
    registration_number: "",
    established_date: "",
    activity_field: "",
    description: "",
    // اطلاعات تماس
    phone: "",
    email: "",
    website: "",
    province: "",
    city: "",
    address: "",
    // اطلاعات مالی
    bank_name: "",
    sheba: "",
    account_owner: "",
    // مدارک
    statute_file: null,
    activity_license_file: null,
    national_card_file: null,
    agreed: false,
  });

  const updateForm = (fields) =>
    setFormData((prev) => ({ ...prev, ...fields }));

  const goNext = () =>
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));

  const goPrev = () =>
    setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setStatus("pending");
    // اینجا API call می‌آد
    // try { await charityService.register(formData); setStatus('success'); }
    // catch { setStatus('error'); }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfo
            data={formData}
            onChange={updateForm}
            onNext={goNext}
          />
        );
      case 2:
        return (
          <ContactInfo
            data={formData}
            onChange={updateForm}
            onNext={goNext}
            onPrev={goPrev}
          />
        );
      case 3:
        return (
          <FinancialInfo
            data={formData}
            onChange={updateForm}
            onNext={goNext}
            onPrev={goPrev}
          />
        );
      case 4:
        return (
          <DocumentsInfo
            data={formData}
            onChange={updateForm}
            onSubmit={handleSubmit}
            onPrev={goPrev}
            status={status}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="charity-register-page">
      <Header />

      <main className="charity-register-page__main">
        {/* بنر بالای صفحه */}
        <div className="charity-register-page__banner">
          <div className="charity-register-page__breadcrumb">
            درخواست همکاری مؤسسات بانوکاری
          </div>
          <h1 className="charity-register-page__title">
            مؤسسه خود را در راه نیک ثبت کنید
          </h1>
          <p className="charity-register-page__subtitle">
            پس از تأیید مدارک توسط تیم سامانه، می‌توانید پروفایل رسمی بسازید،
            کمک مالی و غیرمالی دریافت کنید و گزارش شفافیت منتشر کنید.
          </p>
        </div>

        <div className="charity-register-page__body">
          {/* محتوای فرم */}
          <div className="charity-register-page__content">
            {/* نوار وضعیت موبایل */}
            <div className="charity-register-page__mobile-steps">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`mobile-step ${
                    currentStep === s.id
                      ? "mobile-step--active"
                      : currentStep > s.id
                      ? "mobile-step--done"
                      : ""
                  }`}
                >
                  <span className="mobile-step__dot">{s.id}</span>
                  <span className="mobile-step__label">{s.label}</span>
                </div>
              ))}
            </div>

            {renderStep()}
          </div>

          {/* سایدبار — فقط دسکتاپ */}
          <aside className="charity-register-page__sidebar">
            <StepsSidebar steps={STEPS} currentStep={currentStep} />
          </aside>
        </div>
      </main>
    </div>
  );
}
