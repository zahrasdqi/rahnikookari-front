// src/components/features/CharityRegister/shared/FormCard.jsx
import "./FormCard.scss";

export default function FormCard({ title, description, children }) {
  return (
    <div className="form-card">
      <div className="form-card__header">
        <h2 className="form-card__title">{title}</h2>
        {description && (
          <p className="form-card__desc">{description}</p>
        )}
      </div>
      <div className="form-card__body">{children}</div>
    </div>
  );
}
