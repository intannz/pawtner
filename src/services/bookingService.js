import { bookings } from '../data/bookings';
import { services } from '../data/services';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const bookingService = {
  getAllBookings: async () => {
    await delay();
    return bookings;
  },

  getCustomerBookings: async (customerId) => {
    await delay();
    return bookings.filter(b => b.customerId === customerId);
  },

  getAllServices: async () => {
    await delay();
    return services;
  },

  createBooking: async (bookingData) => {
    await delay(800);
    const newBooking = {
      id: `BK-00${bookings.length + 1}`,
      ...bookingData,
      status: 'Menunggu'
    };
    return newBooking;
  },

  updateBookingStatus: async (bookingId, newStatus) => {
    await delay();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking tidak ditemukan');
    return { ...booking, status: newStatus };
  }
};