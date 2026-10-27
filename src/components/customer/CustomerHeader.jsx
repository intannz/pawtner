import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const CustomerHeader = ({ title = 'Customer Portal' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="portal-header">
      <div className="header-title">
        <h2>{title}</h2>
      </div>
      
      <div className="header-actions">
        <Link to="/account/notifications" className="icon-btn" aria-label="Notifikasi">
          <Bell size={20} />
        </Link>
        
        <div className="user-profile-badge">
          <span className="user-greeting">Halo, {user?.name?.split(' ')[0] || 'Pelanggan'}!</span>
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
        </div>
        
        <button onClick={handleLogout} className="icon-btn logout-btn" title="Keluar">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default CustomerHeader;