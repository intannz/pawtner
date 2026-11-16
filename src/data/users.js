import { bookings } from './bookings';
import { services } from './services';

function getSeedPoints(customerId) {
  return bookings.reduce((total, booking) => {
    if (booking.customerId !== customerId || booking.status !== 'Selesai') return total;
    const service = services.find((item) => item.id === booking.serviceId);
    return total + Math.floor(Number(booking.totalAmount ?? service?.price ?? 0) / 100000);
  }, 0);
}

const coreUsers = [
  { id: 'CUS-0001', name: 'Dina Pratama', email: 'dina@example.com', phone: '081234567890', role: 'user', joinedDate: '2026-05-10', points: 240 },
  { id: 'CUS-0002', name: 'Raka Saputra', email: 'raka@example.com', phone: '081298765432', role: 'user', joinedDate: '2026-06-15', points: getSeedPoints('CUS-0002') },
  { id: 'CUS-0003', name: 'Sinta Maharani', email: 'sinta@example.com', phone: '08111222333', role: 'user', joinedDate: '2026-10-25', points: getSeedPoints('CUS-0003') },
  { id: 'ADM-0001', name: 'Intan Maharani', email: 'admin@pawtner.com', phone: '08999888777', role: 'admin', joinedDate: '2026-01-01', points: 0 }
];

const demoCustomerNames = [
  'Alya Permata', 'Budi Santoso', 'Citra Lestari', 'Dewi Anggraini',
  'Eka Prasetyo', 'Farah Nabila', 'Gilang Ramadhan', 'Hana Safitri',
  'Indra Wijaya', 'Jihan Putri', 'Kevin Mahendra', 'Laras Wulandari',
  'Maya Anindita', 'Naufal Rizky', 'Olivia Sekar', 'Putra Wijaya',
  'Qirana Zahra', 'Rendi Kurniawan', 'Salsa Amelia', 'Teguh Prakoso',
  'Uli Kartika', 'Vina Maharani', 'Wahyu Firmansyah', 'Xaviera Putri',
  'Yogi Hermawan', 'Zahra Aulia', 'Andi Setiawan', 'Bella Anjani',
  'Cahya Putra', 'Dimas Pratama', 'Elsa Nuraini', 'Fajar Maulana',
];

const additionalCustomers = demoCustomerNames.map((name, index) => ({
  id: `CUS-${String(index + 4).padStart(4, '0')}`,
  name,
  email: `${name.toLowerCase().replaceAll(' ', '.')}@example.com`,
  phone: `0812${String(34560000 + index * 137).slice(0, 8)}`,
  role: 'user',
  joinedDate: `2026-${String(5 + (index % 6)).padStart(2, '0')}-${String(4 + (index * 2) % 24).padStart(2, '0')}`,
  points: getSeedPoints(`CUS-${String(index + 4).padStart(4, '0')}`),
}));

export const users = [...coreUsers.slice(0, 3), ...additionalCustomers, coreUsers[3]];