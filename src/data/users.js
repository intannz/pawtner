const coreUsers = [
  { id: 'CUS-0001', name: 'Dina Pratama', email: 'dina@example.com', phone: '081234567890', role: 'customer', joinedDate: '2026-05-10', points: 240 },
  { id: 'CUS-0002', name: 'Raka Saputra', email: 'raka@example.com', phone: '081298765432', role: 'customer', joinedDate: '2026-06-15', points: 50 },
  { id: 'CUS-0003', name: 'Sinta Maharani', email: 'sinta@example.com', phone: '08111222333', role: 'customer', joinedDate: '2026-10-25', points: 0 },
  { id: 'ADM-0001', name: 'Intan Maharani', email: 'admin@pawtner.com', phone: '08999888777', role: 'admin', joinedDate: '2026-01-01', points: 0 }
];

const demoCustomerNames = [
  'Alya Permata', 'Budi Santoso', 'Citra Lestari', 'Dewi Anggraini',
  'Eka Prasetyo', 'Farah Nabila', 'Gilang Ramadhan', 'Hana Safitri',
  'Indra Wijaya', 'Jihan Putri', 'Kevin Mahendra', 'Laras Wulandari',
];

const additionalCustomers = demoCustomerNames.map((name, index) => ({
  id: `CUS-${String(index + 4).padStart(4, '0')}`,
  name,
  email: `${name.toLowerCase().replaceAll(' ', '.')}@example.com`,
  phone: `0812${String(34560000 + index * 137).slice(0, 8)}`,
  role: 'customer',
  joinedDate: `2026-${String(5 + (index % 6)).padStart(2, '0')}-${String(4 + (index * 2) % 24).padStart(2, '0')}`,
  points: [30, 80, 0, 120, 20, 60][index % 6],
}));

export const users = [...coreUsers.slice(0, 3), ...additionalCustomers, coreUsers[3]];