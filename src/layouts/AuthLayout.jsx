import { Outlet, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { FooterBottom } from '../components/public/Footer';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        
        {/* Tombol Kembali ke Beranda */}
        <Link to="/" className="auth-back" style={{ marginTop: 0, marginBottom: '24px' }}>
          <ChevronLeft size={18} />
          Kembali ke Beranda
        </Link>

        <div className="auth-logo-wrapper">
          <Link to="/">
            <img src="/logo-navbar.svg" alt="Pawtner" className="auth-logo" />
          </Link>
        </div>
        
        <div className="auth-content">
          <Outlet />
        </div>
      </div>
      <FooterBottom />
    </div>
  );
};

export default AuthLayout;