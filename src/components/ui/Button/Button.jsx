//front\rahnikookari-front\src\components\ui\Button\Button.jsx
import './Button.scss';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button className={`btn btn--${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
