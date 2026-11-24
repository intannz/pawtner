import { bookings, dinaDemoBookings } from './bookings';
import { services } from './services';

const coreTransactions = [
  { id: 'TRX-001', bookingId: 'BK-001', customerId: 'CUS-0001', totalAmount: 125000, method: 'Transfer Bank', status: 'Lunas', date: '2026-10-27T10:00:00' },
  { id: 'TRX-002', bookingId: 'BK-002', customerId: 'CUS-0002', totalAmount: 100000, method: 'Cash', status: 'Belum Dibayar', date: '2026-10-27T11:00:00' },
  { id: 'TRX-003', bookingId: 'BK-003', customerId: 'CUS-0003', totalAmount: 75000, method: 'QRIS', status: 'Lunas', date: '2026-10-28T13:30:00' }
];

const additionalTransactions = bookings.slice(3, 20).map((booking, index) => {
  const service = services.find((item) => item.id === booking.serviceId);
  return {
    id: `TRX-${String(index + 4).padStart(3, '0')}`,
    bookingId: booking.id,
    customerId: booking.customerId,
    totalAmount: service.price,
    method: ['QRIS', 'Cash', 'Transfer Bank'][index % 3],
    status: index % 5 === 0 ? 'Belum Dibayar' : 'Lunas',
    date: booking.date,
  };
});

const dinaDemoTransactions = dinaDemoBookings.map((booking, index) => {
  const service = services.find((item) => item.id === booking.serviceId);
  return {
    id: `TRX-${String(index + 21).padStart(3, '0')}`,
    bookingId: booking.id,
    customerId: booking.customerId,
    totalAmount: service.price,
    method: ['QRIS', 'Cash', 'Transfer Bank'][index % 3],
    status: 'Lunas',
    date: booking.date,
  };
});

export const transactions = [...coreTransactions, ...additionalTransactions, ...dinaDemoTransactions];