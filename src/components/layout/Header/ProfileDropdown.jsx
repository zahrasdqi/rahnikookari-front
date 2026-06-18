//front\rahnikookari-front\src\components\layout\Header\ProfileDropdown.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { navLinks } from "../../../data/navLinks";
import "./ProfileDropdown.scss";

export default function ProfileDropdown({ closeMenu }) {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleItemClick = (path) => {
    navigate(path);
    closeMenu();
  };

  return (
    <div className="profile-dropdown">
      {/* لینک‌های اصلی ناوبری (فقط در موبایل نمایش داده می‌شود) */}
      <div className="profile-dropdown__mobile-nav">
        {navLinks.map((link) => (
          <div key={link.name} className="profile-dropdown__item" onClick={() => handleItemClick(link.path)}>
            {link.name}
          </div>
        ))}
        <hr className="profile-dropdown__divider" />
      </div>

      {/* دکمه‌های اکشن (اگر لاگین نیست، در موبایل اینجا نمایش داده شوند) */}
      {!isAuthenticated && (
        <div className="profile-dropdown__mobile-nav">
          <div className="profile-dropdown__item highlight" onClick={() => handleItemClick("/login")}>ورود</div>
          <div className="profile-dropdown__item highlight" onClick={() => handleItemClick("/register")}>ثبت نام</div>
          <hr className="profile-dropdown__divider" />
        </div>
      )}

      {/* منوی ثابت */}
      <div className="profile-dropdown__item" onClick={() => handleItemClick("/charity-register")}>ثبت نام خیریه</div>
      <div className="profile-dropdown__item" onClick={() => handleItemClick("/terms")}>شرایط و ضوابط</div>
      <div className="profile-dropdown__item" onClick={() => handleItemClick("/about")}>درباره ما</div>

      {isAuthenticated && (
        <>
          <hr className="profile-dropdown__divider" />
          <div className="profile-dropdown__item logout" onClick={() => { logout(); closeMenu(); navigate("/"); }}>
            خروج از حساب
          </div>
        </>
      )}
    </div>
  );
}
