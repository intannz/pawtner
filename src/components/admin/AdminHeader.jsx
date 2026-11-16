import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Search, UserRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { storageKeys } from '../../data/appData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications] = useLocalStorage(storageKeys.adminNotifications, []);
  const [profileOpen, setProfileOpen] = useState(false);
  const unreadCount = notifications.filter((item) => !item.read).length;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="admin-header">
      <div className="header-search">
        <Search size={20} className="search-icon text-muted" />
        <input type="text" placeholder="Cari pelanggan, hewan, atau ID booking..." className="search-input" />
      </div>
      <div className="header-actions">
        <Link className="icon-btn admin-notification-link" to="/admin/notifications" aria-label={`Notifikasi${unreadCount ? `, ${unreadCount} belum dibaca` : ''}`}>
          <Bell size={20} />
          {unreadCount > 0 && <span className="admin-notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>}
        </Link>
        <div className="admin-profile-menu">
          <button type="button" className="admin-profile-trigger" aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)}>
            <div className="admin-profile">
              <div className="admin-info text-right">
                <span className="admin-name">{user?.name || 'Admin'}</span>
                <span className="admin-role">Admin</span>
              </div>
              <div className="admin-avatar">{user?.name ? user.name.charAt(0) : 'A'}</div>
              <ChevronDown size={15} />
            </div>
          </button>
          {profileOpen && (
            <div className="admin-profile-popover">
              <Link to="/admin/profile" onClick={() => setProfileOpen(false)}><UserRound size={15} /> Profil</Link>
              <button type="button" onClick={handleLogout}><LogOut size={15} /> Keluar</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
