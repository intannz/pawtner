import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dog, CalendarDays, History, User, Bell } from 'lucide-react';

const CustomerSidebar = () => {
  const navItems = [
    { path: '/account', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/account/pets', label: 'Hewan Saya', icon: <Dog size={20} /> },
    { path: '/account/bookings', label: 'Booking Saya', icon: <CalendarDays size={20} /> },
    { path: '/account/history', label: 'Riwayat Perawatan', icon: <History size={20} /> },
    { path: '/account/notifications', label: 'Notifikasi', icon: <Bell size={20} /> },
    { path: '/account/profile', label: 'Profil Saya', icon: <User size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {/* Menggunakan logo navbar dari public sesuai permintaan */}
        <img src="/logo-navbar.svg" alt="Pawtner Logo" className="sidebar-logo" />
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/account'}
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default CustomerSidebar;