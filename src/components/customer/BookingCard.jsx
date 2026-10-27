import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { CalendarDays } from 'lucide-react';
import { formatDateTime } from '../../utils/formatDate';

const BookingCard = ({ booking, serviceName, petName }) => {
  if (!booking) return null;
  
  // Menentukan varian warna badge berdasarkan status
  const getBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'terkonfirmasi': return 'default';
      case 'selesai': return 'success';
      case 'menunggu': return 'warning';
      case 'dibatalkan': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <div className="data-card booking-card">
      <div className="booking-card-header">
        <div>
          <h3 className="booking-service">{serviceName || 'Layanan Pet Care'}</h3>
          <p className="booking-pet">Untuk: <strong>{petName || 'Hewan Peliharaan'}</strong></p>
        </div>
        <Badge variant={getBadgeVariant(booking.status)}>{booking.status}</Badge>
      </div>
      
      <div className="booking-card-body">
        <div className="schedule-info text-muted-caramel">
          <CalendarDays size={18} />
          <span>{formatDateTime(booking.date)}</span>
        </div>
      </div>
      
      <div className="booking-card-footer">
        <Button variant="outline">Detail</Button>
        {booking.status === 'Menunggu' && (
           <button className="btn-text-danger">Batalkan</button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;