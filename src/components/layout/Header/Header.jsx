//front\rahnikookari-front\src\components\layout\Header\Header.jsx

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { navLinks } from "../../../data/navLinks";
import Container from "../../ui/Container/Container";
import Button from "../../ui/Button/Button";
import { useAuth } from "../../../contexts/AuthContext";
import ProfileDropdown from "./ProfileDropdown"; 
import NotificationBell from "./NotificationBell";
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
            
            {/* ۱. نمایش دکمه‌ها بر اساس وضعیت احراز هویت */}
            {isAuthenticated ? (
              <>
              <NotificationBell />
              <Button variant="primary" onClick={() => navigate("/dashboard")}>
                داشبورد
              </Button>
            </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  ورود
                </Button>
                <Button variant="primary" onClick={() => navigate("/register")}>
                  ثبت‌نام
                </Button>
              </>
            )}

            {/* ۲. منوی همبرگری (همیشه نمایش داده می‌شود) */}
            <div 
              className="header__profile-trigger" 
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              ☰
            </div>

            {/* ۳. دراپ‌داون منو */}
            {openDropdown && <ProfileDropdown closeMenu={() => setOpenDropdown(false)} />}
          </div>
        </div>
      </Container>
    </header>
  );
}
