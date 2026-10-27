import React from 'react';
import Badge from '../common/Badge';
import { Star, CalendarDays, Wallet } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const CustomerProfileCard = ({ customer, totalVisits, totalSpent }) => {
  if (!customer) return null;

  return (
    <div className="crm-profile-card data-card">
      <div className="profile-header-crm">
        <div className="profile-avatar-large">
          {customer.name.charAt(0)}
        </div>
        <div className="profile-info-crm">
          <h2>{customer.name}</h2>
          <p className="text-muted">{customer.id} &bull; Bergabung {formatDate(customer.joinedDate)}</p>
          <div className="mt-2">
            {/* Logika dummy sederhana untuk status loyalitas */}
            <Badge variant={totalVisits >= 4 ? "success" : "default"}>
              {totalVisits >= 4 ? "Loyal" : "Aktif"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="profile-stats-grid mt-6">
        <div className="stat-box">
          <CalendarDays size={18} className="text-muted-caramel" />
          <div className="stat-box-content">
            <span className="stat-label">Kunjungan</span>
            <span className="stat-value">{totalVisits || 0}</span>
          </div>
        </div>
        <div className="stat-box">
          <Wallet size={18} className="text-muted-caramel" />
          <div className="stat-box-content">
            <span className="stat-label">Transaksi</span>
            <span className="stat-value">{totalSpent || 0}</span>
          </div>
        </div>
        <div className="stat-box">
          <Star size={18} className="text-warning-text" />
          <div className="stat-box-content">
            <span className="stat-label">Poin Pawtner</span>
            <span className="stat-value">{customer.points || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileCard;