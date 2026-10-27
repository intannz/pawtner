const coreReminders = [
  { id: 'REM-001', customerId: 'CUS-0001', reason: 'Pengingat grooming rutin', date: '2026-10-28', status: 'Terjadwal' },
  { id: 'REM-002', customerId: 'CUS-0002', reason: 'Booking belum dikonfirmasi', date: '2026-10-27', status: 'Perlu tindakan' },
  { id: 'REM-003', customerId: 'CUS-0003', reason: 'Follow-up pasca kunjungan pertama', date: '2026-10-29', status: 'Belum dilakukan' }
];

const additionalReminders = Array.from({ length: 9 }, (_, index) => ({
  id: `REM-${String(index + 4).padStart(3, '0')}`,
  customerId: `CUS-${String(index + 4).padStart(4, '0')}`,
  reason: ['Pengingat grooming rutin', 'Follow-up pasca kunjungan', 'Pelanggan belum membuat booking ulang'][index % 3],
  date: `2026-10-${String(27 + (index % 5)).padStart(2, '0')}`,
  status: ['Terjadwal', 'Belum dilakukan', 'Perlu tindakan'][index % 3],
}));

export const reminders = [...coreReminders, ...additionalReminders];