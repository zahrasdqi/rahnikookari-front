// src/components/features/CharityRegister/StepsSidebar/StepsSidebar.jsx
//front\rahnikookari-front\src\components\features\Features\CharityRegister\StepsSidebar\StepsSidebar.jsx
import "./StepsSidebar.scss";

export default function StepsSidebar({ steps, currentStep }) {
  return (
    <div className="steps-sidebar">
      <div className="steps-sidebar__header">
        <h3 className="steps-sidebar__title">ثبت‌نام مؤسسه خیریه</h3>
        <p className="steps-sidebar__desc">
          اطلاعات مؤسسه را کامل وارد کنید. پس از ارسال، درخواست شما «در انتظار
          انتشار» به حالت pending تغییر می‌کند.
        </p>
      </div>

      <div className="steps-sidebar__steps">
        {steps.map((step) => {
          const isDone = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`steps-sidebar__step ${
                isActive
                  ? "steps-sidebar__step--active"
                  : isDone
                  ? "steps-sidebar__step--done"
                  : ""
              }`}
            >
              <div className="steps-sidebar__step-icon">
                {isDone ? "✓" : step.id}
              </div>
              <span className="steps-sidebar__step-label">{step.label}</span>
            </div>
          );
        })}
      </div>

      <div className="steps-sidebar__note">
        <p className="steps-sidebar__note-title">نکته مهم</p>
        <p className="steps-sidebar__note-text">
          فایل‌های مدارک باید واضح، معتبر و کمتر از ۵ مگابایت باشند. مکاتبات
          اطلاعات مالی فقط برای: مدیریت کمک‌ها استفاده می‌شوند. تسهیم وجود
          بیشترها استعاده می‌شود.
        </p>
      </div>
    </div>
  );
}
