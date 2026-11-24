import { bookings } from './bookings';
import { pets } from './pets';
import { services } from './services';
import { transactions } from './transactions';
import { users } from './users';
import { reminders } from './reminders';

export const customers = users.filter((user) => user.role === 'user' || user.role === 'customer');

export const bookingRecords = bookings.map((booking) => ({
  ...booking,
  customer: customers.find((customer) => customer.id === booking.customerId),
  pet: pets.find((pet) => pet.id === booking.petId),
  service: services.find((service) => service.id === booking.serviceId),
}));

export const transactionRecords = transactions.map((transaction) => ({
  ...transaction,
  customer: customers.find((customer) => customer.id === transaction.customerId),
  booking: bookingRecords.find((booking) => booking.id === transaction.bookingId),
}));

export const petRecords = pets.map((pet) => ({
  ...pet,
  owner: customers.find((customer) => customer.id === pet.ownerId),
}));

export const reminderRecords = reminders.map((reminder) => ({
  ...reminder,
  customer: customers.find((customer) => customer.id === reminder.customerId),
}));

function getMonthKey(date) {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return null;
  return `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthlyPerformance(bookingData, transactionData) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthKeys = new Set([
    ...bookingData.map((booking) => getMonthKey(booking.date)),
    ...transactionData.map((transaction) => getMonthKey(transaction.date)),
  ].filter(Boolean));
  return [...monthKeys].sort().map((key) => {
    const [year, month] = key.split('-');
    return {
      name: `${monthNames[Number(month) - 1]} ${year}`,
      bookings: bookingData.filter((booking) => getMonthKey(booking.date) === key).length,
      revenue: transactionData
        .filter((transaction) => getMonthKey(transaction.date) === key && transaction.status === 'Lunas')
        .reduce((total, transaction) => total + Number(transaction.totalAmount || 0), 0),
    };
  });
}

export function getServicePerformance(bookingData, serviceData) {
  return serviceData.map((service) => ({
    name: service.name,
    bookings: bookingData.filter((booking) => booking.serviceId === service.id).length,
  }));
}

export const monthlyPerformance = getMonthlyPerformance(bookings, transactions);
export const servicePerformance = getServicePerformance(bookings, services);

export const staff = [
  { id: 'STF-001', name: 'Nadia Putri', phone: '081234567801', role: 'Groomer', services: 'Grooming', status: 'Aktif' },
  { id: 'STF-002', name: 'drh. Bima Ardi', phone: '081234567802', role: 'Dokter Hewan', services: 'Klinik', status: 'Aktif' },
  { id: 'STF-003', name: 'Rani Kusuma', phone: '081234567803', role: 'Admin', services: 'Operasional', status: 'Aktif' },
];

export const activities = [
  { title: 'Booking BK-001 dikonfirmasi', detail: 'Dina Pratama · Full Grooming', time: 'Hari ini, 08.42' },
  { title: 'Catatan profil diperbarui', detail: 'Luna · Raka Saputra', time: 'Kemarin, 16.10' },
  { title: 'Follow-up baru dijadwalkan', detail: 'Dina Pratama · Pengingat grooming', time: 'Kemarin, 14.25' },
  { title: 'Layanan ditandai selesai', detail: 'Mochi · Basic Grooming', time: '26 Okt 2026, 13.55' },
];

export const vouchers = [
  { code: 'PAW10', benefit: 'Diskon 10%', validity: '30 Nov 2026', redemptions: 8, status: 'Aktif' },
  { code: 'GROOM15', benefit: 'Diskon 15% grooming', validity: '15 Des 2026', redemptions: 3, status: 'Aktif' },
  { code: 'WELCOME', benefit: 'Diskon Rp20.000', validity: '31 Okt 2026', redemptions: 12, status: 'Berakhir' },
];
