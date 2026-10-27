import React from 'react';
import { Bell } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const ReminderCard = ({ reminder, petName }) => {
  if (!reminder) return null;

  return (
    <div className="data-card reminder-card">
      <div className="reminder-icon-wrapper">
        <Bell size={24} className="text-muted-caramel" />
      </div>
      
      <div className="reminder-content">
        <h4>{reminder.reason}</h4>
        <p>Hewan: {petName || 'Tidak diketahui'}</p>
        <span className="reminder-date">Jadwal: {formatDate(reminder.date)}</span>
      </div>
      
      <div className="reminder-action">
        <button className="btn btn-primary">Buat Booking</button>
      </div>
    </div>
  );
};

export default ReminderCard;