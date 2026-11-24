import { reminders } from './reminders';
import { services } from './services';
import { staff } from './viewModels';

export const storageKeys = {
  bookings: 'pawtner_bookings',
  users: 'pawtner_users',
  pets: 'pawtner_pets',
  notifications: 'pawtner_notifications',
  adminNotifications: 'pawtner_admin_notifications',
  vouchers: 'pawtner_vouchers',
  loyalty: 'pawtner_loyalty_settings',
  services: 'pawtner_services',
  staff: 'pawtner_staff',
  transactions: 'pawtner_transactions',
};

export const initialServices = services;
export const initialStaff = staff;
export const customerHistoryDays = 30;
export const getBookingDraftKey = (customerId) => `pawtner_booking_draft_${customerId}`;

export function isWithinCustomerHistoryWindow(date) {
  const timestamp = new Date(date).getTime();
  const now = Date.now();
  return Number.isFinite(timestamp)
    && timestamp >= now - customerHistoryDays * 24 * 60 * 60 * 1000
    && timestamp <= now;
}

export function isUpcomingCustomerBooking(date) {
  const timestamp = new Date(date).getTime();
  return Number.isFinite(timestamp) && timestamp >= Date.now();
}

export const initialNotifications = reminders.map((reminder) => ({
  id: reminder.id,
  customerId: reminder.customerId,
  title: reminder.reason,
  message: `Status: ${reminder.status}`,
  date: reminder.date,
  read: false,
}));

export const initialLoyaltySettings = {
  amountPerPoint: 100000,
  voucherValidityMonths: 3,
  rewards: [
    { points: 5, discount: 10000 },
    { points: 10, discount: 20000 },
    { points: 15, discount: 35000 },
    { points: 25, discount: 60000 },
  ],
};

export function normalizeLoyaltySettings(settings = {}) {
  const source = settings || {};
  return {
    ...initialLoyaltySettings,
    ...source,
    voucherValidityMonths: source.voucherValidityMonths || 3,
    rewards: source.rewards || initialLoyaltySettings.rewards,
  };
}

export function getBookingRecords(bookingData, petData, userData, serviceData = services) {
  return bookingData.map((booking) => ({
    ...booking,
    customer: userData.find((customer) => customer.id === booking.customerId),
    pet: petData.find((pet) => pet.id === booking.petId),
    service: serviceData.find((service) => service.id === booking.serviceId),
  }));
}

export function getBookingPriceSummary(booking) {
  const originalPrice = Number(booking.servicePrice ?? booking.service?.price ?? booking.totalAmount ?? 0);
  const discount = Math.min(originalPrice, Math.max(0, Number(booking.discount) || 0));
  return {
    originalPrice,
    discount,
    totalAmount: Math.max(0, originalPrice - discount),
  };
}

export function getCustomerSegments(userData, bookingData) {
  const customerUsers = userData.filter((user) => user.role === 'user' || user.role === 'customer');
  const completedBookings = bookingData.filter((booking) => booking.status === 'Selesai');
  const activeBookings = bookingData.filter((booking) => booking.status !== 'Dibatalkan');
  const withinDays = (date, days) => {
    const age = (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
    return age >= 0 && age <= days;
  };
  const visitsFor = (customerId) => completedBookings.filter((booking) => booking.customerId === customerId);
  const bookingsFor = (customerId) => activeBookings.filter((booking) => booking.customerId === customerId);
  return [
    {
      id: 'SEG-001',
      name: 'Baru',
      description: 'Pelanggan yang baru bergabung atau baru menyelesaikan layanan dalam 30 hari terakhir.',
      customerIds: customerUsers.filter((customer) =>
        withinDays(customer.joinedDate, 30)
        || (visitsFor(customer.id).length === 1 && withinDays(visitsFor(customer.id)[0].date, 30)),
      ).map((customer) => customer.id),
    },
    {
      id: 'SEG-002',
      name: 'Aktif',
      description: 'Memiliki booking yang tidak dibatalkan dalam 60 hari terakhir.',
      customerIds: customerUsers.filter((customer) => bookingsFor(customer.id).some((booking) => withinDays(booking.date, 60))).map((customer) => customer.id),
    },
    {
      id: 'SEG-003',
      name: 'Loyal',
      description: 'Minimal 4 kunjungan selesai dalam 6 bulan terakhir.',
      customerIds: customerUsers.filter((customer) => visitsFor(customer.id).filter((booking) => withinDays(booking.date, 183)).length >= 4).map((customer) => customer.id),
    },
    {
      id: 'SEG-004',
      name: 'Perlu perhatian',
      description: 'Tidak memiliki booking yang tidak dibatalkan dalam 90 hari terakhir atau yang akan datang.',
      customerIds: customerUsers.filter((customer) => !bookingsFor(customer.id).some((booking) => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= new Date() || withinDays(booking.date, 90);
      })).map((customer) => customer.id),
    },
  ];
}

export function createNotification(customerId, title, message) {
  return {
    id: `NOT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    customerId,
    title,
    message,
    date: new Date().toISOString(),
    read: false,
  };
}

export function createAdminNotification(title, message, path) {
  return {
    id: `ADM-NOT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    message,
    path,
    date: new Date().toISOString(),
    read: false,
  };
}

export function getNextId(records, prefix, width = 3) {
  const maxId = records.reduce((max, record) => {
    const number = Number(record.id?.match(/\d+$/)?.[0] || 0);
    return Math.max(max, number);
  }, 0);
  return `${prefix}-${String(maxId + 1).padStart(width, '0')}`;
}

export function addMonths(date, months) {
  const result = new Date(date);
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
}

export function getActivePointLots(user) {
  const lots = user?.pointLots || (user?.points ? [{
    points: user.points,
    earnedAt: user.joinedDate || null,
  }] : []);
  return lots.filter((lot) => lot.points > 0);
}

export function getActivePoints(user) {
  return getActivePointLots(user).reduce((total, lot) => total + lot.points, 0);
}

export function redeemPointLots(user, points) {
  let remaining = points;
  const pointLots = getActivePointLots(user)
    .sort((left, right) => new Date(left.earnedAt || 0) - new Date(right.earnedAt || 0))
    .flatMap((lot) => {
      if (remaining <= 0) return [lot];
      const used = Math.min(lot.points, remaining);
      remaining -= used;
      return lot.points > used ? [{ ...lot, points: lot.points - used }] : [];
    });
  const balance = pointLots.reduce((total, lot) => total + lot.points, 0);
  return { pointLots, points: balance };
}
