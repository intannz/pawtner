import { pets } from './pets';
import { services } from './services';

const coreBookings = [
  { id: 'BK-001', customerId: 'CUS-0001', petId: 'PET-001', serviceId: 'SRV-001', date: '2026-10-28T09:00:00', status: 'Terkonfirmasi' },
  { id: 'BK-002', customerId: 'CUS-0002', petId: 'PET-002', serviceId: 'SRV-003', date: '2026-10-28T10:00:00', status: 'Menunggu' },
  { id: 'BK-003', customerId: 'CUS-0003', petId: 'PET-003', serviceId: 'SRV-002', date: '2026-10-28T13:00:00', status: 'Selesai' }
];

const additionalBookings = Array.from({ length: 27 }, (_, index) => {
  const pet = pets[(index + 3) % pets.length];
  const month = 4 + (index % 6);
  const day = 2 + ((index * 5) % 25);
  const date = new Date(2026, month, day, 9 + (index % 7), index % 2 === 0 ? 0 : 30);
  const earlierStatus = ['Selesai', 'Selesai', 'Terkonfirmasi', 'Dibatalkan', 'Selesai'];
  const status = month === 9
    ? ['Menunggu', 'Terkonfirmasi', 'Menunggu', 'Dibatalkan'][index % 4]
    : earlierStatus[index % earlierStatus.length];
  return {
    id: `BK-${String(index + 4).padStart(3, '0')}`,
    customerId: pet.ownerId,
    petId: pet.id,
    serviceId: services[index % services.length].id,
    date: date.toISOString().slice(0, 19),
    status,
  };
});

export const bookings = [...coreBookings, ...additionalBookings];