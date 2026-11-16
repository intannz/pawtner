import { Bell, ChevronDown, LogOut, UserRound } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { storageKeys, initialNotifications } from '../../data/appData';

const CustomerHeader = () => {
  const { user, logout } = useAuth();
  const [notifications] = useLocalStorage(storageKeys.notifications, initialNotifications);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const unreadCount = notifications.filter((item) => item.customerId === user?.id && !item.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="customer-navbar">
      <div className="customer-navbar-inner">
        <Link to="/account" className="customer-brand" aria-label="Pawtner beranda">
          <img src="/logo-navbar.svg" alt="Pawtner" />
        </Link>
        <nav className="customer-nav-links" aria-label="Navigasi pelanggan">
          <NavLink to="/account" end>Beranda</NavLink>
          <NavLink to="/account/services">Katalog</NavLink>
          <NavLink to="/account/bookings">Booking saya</NavLink>
          <NavLink to="/account/vouchers">Voucher</NavLink>
          <NavLink to="/account/pets">Hewan saya</NavLink>
        </nav>
        <div className="customer-nav-actions">
          <Link to="/account/notifications" className="customer-bell" aria-label={`Notifikasi${unreadCount ? `, ${unreadCount} belum dibaca` : ''}`}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="customer-bell-count">{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </Link>
          <div className="customer-profile-menu">
            <button type="button" className="customer-user-chip" aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)}>
            <span className="customer-user-avatar">{user?.name?.charAt(0).toUpperCase() || 'P'}</span>
            <span>Hai, {user?.name?.split(' ')[0] || 'Pelanggan'}</span>
              <ChevronDown size={15} />
            </button>
            {profileOpen && <div className="customer-profile-popover"><Link to="/account/profile" onClick={() => setProfileOpen(false)}><UserRound size={15} /> Profil</Link><button type="button" onClick={handleLogout}><LogOut size={15} /> Keluar</button></div>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
