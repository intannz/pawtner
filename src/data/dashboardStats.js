import { bookings } from './bookings';
import { reminders } from './reminders';
import { users } from './users';

const demoDate = '2026-10-28';
const customerBookings = bookings.filter((booking) => booking.status === 'Selesai').reduce((counts, booking) => {
  counts[booking.customerId] = (counts[booking.customerId] || 0) + 1;
  return counts;
}, {});
const totalCustomers = users.filter((user) => user.role === 'customer').length;
const returningCustomers = Object.values(customerBookings).filter((count) => count > 1).length;
const todayBookings = bookings.filter((booking) => booking.date.startsWith(demoDate));

export const dashboardStats = {
  todayBookings: {
    total: todayBookings.length,
    confirmed: todayBookings.filter((booking) => booking.status === 'Terkonfirmasi').length,
  },
  totalCustomers,
  returningCustomersRate: `${Math.round((returningCustomers / Math.max(totalCustomers, 1)) * 100)}%`,
  openFollowUps: reminders.filter((reminder) => reminder.status !== 'Selesai').length,
  upcomingReminders: reminders.filter((reminder) => reminder.status === 'Terjadwal').length,
};