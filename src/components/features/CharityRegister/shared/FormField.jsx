// src/components/features/CharityRegister/shared/FormField.jsx
import "./FormField.scss";

export default function FormField({
  label,
  required,
  hint,
  error,
  children,
  fullWidth = false,
}) {
  return (
    <div className={`form-field ${fullWidth ? "form-field--full" : ""}`}>
      {label && (
        <label className="form-field__label">
          {label}
          {required && <span className="form-field__required"> *</span>}
        </label>
      )}
      <div className="form-field__control">{children}</div>
      {hint && !error && (
        <span className="form-field__hint">{hint}</span>
      )}
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}
