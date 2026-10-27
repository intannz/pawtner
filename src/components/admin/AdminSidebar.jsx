import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CalendarRange, Users, Dog,
  Scissors, HeartHandshake, BellRing, Gift,
  Receipt, LineChart, ShieldCheck, Settings, Tags, Activity
} from 'lucide-react';

const AdminSidebar = () => {
  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/bookings', label: 'Booking & Kalender', icon: <CalendarRange size={20} /> },
    { path: '/admin/customers', label: 'Pelanggan', icon: <Users size={20} /> },
    { path: '/admin/pets', label: 'Hewan Peliharaan', icon: <Dog size={20} /> },
    { path: '/admin/services', label: 'Layanan', icon: <Scissors size={20} /> },
    
    // CRM Section
    { path: '/admin/crm', label: 'CRM & Retensi', icon: <HeartHandshake size={20} className="crm-icon" /> },
    { path: '/admin/crm/segments', label: 'Segmen Pelanggan', icon: <Tags size={20} className="crm-icon" /> },
    { path: '/admin/crm/follow-ups', label: 'Pengingat', icon: <BellRing size={20} className="crm-icon" /> },
    { path: '/admin/crm/loyalty', label: 'Promo & Loyalty', icon: <Gift size={20} className="crm-icon" /> },
    { path: '/admin/crm/activity', label: 'Aktivitas CRM', icon: <Activity size={20} className="crm-icon" /> },
    
    { path: '/admin/transactions', label: 'Transaksi', icon: <Receipt size={20} /> },
    { path: '/admin/reports', label: 'Laporan', icon: <LineChart size={20} /> },
    { path: '/admin/staff', label: 'Staf & Akses', icon: <ShieldCheck size={20} /> },
    { path: '/admin/settings', label: 'Pengaturan', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        {/* Menggunakan logo-footer.svg */}
        <img src="/logo-footer.svg" alt="Pawtner Admin" className="sidebar-logo" />
        <span className="badge badge-default">ADMIN</span>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin/dashboard' || item.path === '/admin/crm'}
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

export default AdminSidebar;