import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { navLinks } from "../../../data/navLinks";
import Container from "../../ui/Container/Container";
import Button from "../../ui/Button/Button";
import { useAuth } from "../../../contexts/AuthContext";
import ProfileDropdown from "./ProfileDropdown"; 
import NotificationBell from "./NotificationBell";
import { LogIn, UserPlus, LayoutDashboard } from "lucide-react"; // ایمپورت آیکون‌های لوساید
import "./Header.scss";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // چک کردن وضعیت لاگین
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <Container className="header__wrapper">
        
        <div className="header__right">
          <div className="header__brand" onClick={() => navigate("/")}>
            راهِ نیک
          </div>
        </div>

        <nav className="header__nav">
          {navLinks.map((link) => (
            <span 
              key={link.name} 
              className="header__nav-link" 
              onClick={() => navigate(link.path)}
            >
              {link.name}
            </span>
          ))}
        </nav>

        <div className="header__left" ref={dropdownRef}>
          <div className="header__actions">
            
            {/* نمایش دکمه‌ها بر اساس وضعیت احراز هویت */}
            {isAuthenticated ? (
              <>
                <NotificationBell />
                
                {/* دکمه داشبورد در دسکتاپ متنی و در موبایل آیکون می‌شود */}
                <Button 
                  variant="primary" 
                  className="header__action-btn header__action-btn--dashboard"
                  onClick={() => navigate("/dashboard")}
                >
                  <span className="btn-text">داشبورد</span>
                  <span className="btn-icon"><LayoutDashboard size={20} /></span>
                </Button>
              </>
            ) : (
              <>
                {/* دکمه ورود در دسکتاپ متنی و در موبایل آیکون می‌شود */}
                <Button 
                  variant="ghost" 
                  className="header__action-btn header__action-btn--login"
                  onClick={() => navigate("/login")}
                >
                  <span className="btn-text">ورود</span>
                  <span className="btn-icon"><LogIn size={20} /></span>
                </Button>

                {/* دکمه ثبت‌نام در دسکتاپ متنی و در موبایل آیکون می‌شود */}
                <Button 
                  variant="primary" 
                  className="header__action-btn header__action-btn--register"
                  onClick={() => navigate("/register")}
                >
                  <span className="btn-text">ثبت‌نام</span>
                  <span className="btn-icon"><UserPlus size={20} /></span>
                </Button>
              </>
            )}

            {/* منوی همبرگری (همیشه نمایش داده می‌شود) */}
            <div 
              className="header__profile-trigger" 
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              ☰
            </div>

            {/* دراپ‌داون منو */}
            {openDropdown && <ProfileDropdown closeMenu={() => setOpenDropdown(false)} />}
          </div>
        </div>
      </Container>
    </header>
  );
}
