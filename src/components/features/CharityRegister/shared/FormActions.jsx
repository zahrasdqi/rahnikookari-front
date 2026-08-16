// src/components/features/CharityRegister/shared/FormActions.jsx
import "./FormActions.scss";

export default function FormActions({
  onNext,
  onPrev,
  onSubmit,
  isFirstStep = false,
  isLastStep = false,
  loading = false,
}) {
  return (
    <div className="form-actions">
      {onPrev && !isFirstStep && (
        <button
          type="button"
          className="form-actions__btn form-actions__btn--prev"
          onClick={onPrev}
        >
          ← بازگشت
        </button>
      )}

      <div className="form-actions__spacer" />

      {isLastStep ? (
        <button
          type="button"
          className="form-actions__btn form-actions__btn--submit"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "در حال ارسال..." : "ارسال درخواست ثبت مؤسسه"}
        </button>
      ) : (
        <button
          type="button"
          className="form-actions__btn form-actions__btn--next"
          onClick={onNext}
        >
          مرحله بعد ←
        </button>
      )}
    </div>
  );
}
