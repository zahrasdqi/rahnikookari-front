// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>۴۰۴</h1>
      <p>صفحه‌ای که دنبالش بودی پیدا نشد.</p>
      <Link to="/">بازگشت به خانه</Link>
    </div>
  );
}
