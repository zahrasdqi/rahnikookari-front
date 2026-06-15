import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>داشبورد</h1>
      <button
        onClick={handleLogout}
        style={{
          marginTop: '1rem',
          padding: '10px 24px',
          background: '#e53e3e',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer',
        }}
      >
        خروج از حساب
      </button>
    </div>
  );
}
