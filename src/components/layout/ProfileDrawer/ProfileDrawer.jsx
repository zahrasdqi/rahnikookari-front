import { useNavigate } from "react-router-dom";
import "./ProfileDrawer.scss";

export default function ProfileDrawer({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="profile-drawer__overlay" onClick={onClose}>
      <aside
        className="profile-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-drawer__header">
          <div className="profile-drawer__avatar">👤</div>
          <div>
            <h3>حساب کاربری</h3>
            <p>به راهِ نیک خوش آمدید</p>
          </div>
        </div>

        <div className="profile-drawer__actions">
          <button onClick={() => navigate("/login")}>ورود</button>
          <button onClick={() => navigate("/register")}>ثبت نام</button>
        </div>

        <button className="profile-drawer__close" onClick={onClose}>
          بستن
        </button>
      </aside>
    </div>
  );
}
