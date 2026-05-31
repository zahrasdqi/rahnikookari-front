import { useNavigate } from 'react-router-dom';
import { navLinks } from '../../../data/navLinks'; // ایمپورت داده‌ها
import Container from '../../ui/Container/Container';
import Button from '../../ui/Button/Button';
import './Header.scss';

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <Container className="header__wrapper">
        {/* بخش راست: منو و لوگو */}
        <div className="header__right">
          <button className="header__menu-btn" onClick={onMenuClick}>☰</button>
          <div className="header__brand" onClick={() => navigate('/')}>راهِ نیک</div>
        </div>

        {/* بخش وسط: لینک‌های ناوبری */}
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

        {/* بخش چپ: دکمه‌های ورود و ثبت‌نام */}
        <div className="header__left">
          <Button variant="ghost" onClick={() => navigate('/login')}>ورود</Button>
          <Button variant="primary" onClick={() => navigate('/register')}>ثبت‌نام</Button>
        </div>
      </Container>
    </header>
  );
}
