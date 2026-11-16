import { bookings } from './bookings';
import { users } from './users';

const completedBookings = bookings.filter((booking) => booking.status === 'Selesai');
const now = new Date('2026-10-28T12:00:00');
const daysAgo = (date, days) => (now - new Date(date)) / (1000 * 60 * 60 * 24) <= days;
const visitsFor = (customerId) => completedBookings.filter((booking) => booking.customerId === customerId);
const customers = users.filter((user) => user.role === 'user' || user.role === 'customer');

export const segments = [
  {
    id: 'SEG-001',
    name: 'Baru',
    description: 'Baru pertama kali menyelesaikan layanan dalam 30 hari terakhir.',
    customerIds: customers.filter((customer) => visitsFor(customer.id).length === 1 && daysAgo(visitsFor(customer.id)[0].date, 30)).map((customer) => customer.id),
  },
  {
    id: 'SEG-002',
    name: 'Aktif',
    description: 'Pernah menyelesaikan layanan dalam 60 hari terakhir.',
    customerIds: customers.filter((customer) => visitsFor(customer.id).some((booking) => daysAgo(booking.date, 60))).map((customer) => customer.id),
  },
  {
    id: 'SEG-003',
    name: 'Loyal',
    description: 'Minimal 4 kunjungan selesai dalam 6 bulan terakhir.',
    customerIds: customers.filter((customer) => visitsFor(customer.id).filter((booking) => daysAgo(booking.date, 183)).length >= 4).map((customer) => customer.id),
  },
  {
    id: 'SEG-004',
    name: 'Perlu perhatian',
    description: 'Tidak memiliki kunjungan selesai dalam 90 hari terakhir.',
    customerIds: customers.filter((customer) => !visitsFor(customer.id).some((booking) => daysAgo(booking.date, 90))).map((customer) => customer.id),
  },
];