import React from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="admin-header">
      <div className="header-search">
        <Search size={20} className="search-icon text-muted" />
        <input 
          type="text" 
          placeholder="Cari pelanggan, hewan, atau ID booking..." 
          className="search-input"
        />
      </div>
      
      <div className="header-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="admin-profile">
          <div className="admin-info text-right">
            <span className="admin-name">{user?.name || 'Admin'}</span>
            <span className="admin-role">Super Admin</span>
          </div>
          <div className="admin-avatar">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
        </div>
        
        <button onClick={handleLogout} className="icon-btn text-danger" title="Keluar">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;