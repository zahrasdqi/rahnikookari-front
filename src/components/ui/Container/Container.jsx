//C:\Users\zahra\Desktop\rahe-nik\front\rahnikookari-front\src\components\ui\Container\Container.jsx

import "./Container.scss";

export default function Container({ children, className = "" }) {
  return <div className={`container ${className}`.trim()}>{children}</div>;
}
