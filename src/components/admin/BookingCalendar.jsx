import React from 'react';
import Badge from '../common/Badge';
import { Clock } from 'lucide-react';
import { formatTime, getStatusBadgeClass } from '../../utils/bookingStatus'; // Sesuaikan lokasi util jika perlu
import { formatDateTime } from '../../utils/formatDate';

const BookingCalendar = ({ bookings = [], selectedDate }) => {
  return (
    <div className="booking-timeline data-card">
      <div className="timeline-header">
        <h3>Jadwal Hari Ini</h3>
        <p className="text-muted">{selectedDate || '28 Oktober 2026'}</p>
      </div>
      
      <div className="timeline-list mt-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="timeline-item">
              <div className="timeline-time">
                <Clock size={16} />
                <span>{new Date(booking.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              
              <div className="timeline-content border-left-caramel">
                <div className="flex-between mb-1">
                  <h4>{booking.pet?.name || 'Hewan'} &mdash; {booking.service?.name || 'Layanan'}</h4>
                  <Badge variant={booking.status === 'Selesai' ? 'success' : booking.status === 'Terkonfirmasi' ? 'default' : 'warning'}>
                    {booking.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted">{booking.customer?.name || 'Nama Pelanggan'} &bull; {booking.pet?.type || 'Jenis'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-timeline text-center p-6 text-muted">
            Tidak ada jadwal untuk hari ini.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;