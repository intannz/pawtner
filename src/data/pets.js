const corePets = [
  { id: 'PET-001', ownerId: 'CUS-0001', name: 'Milo', type: 'Anjing', breed: 'Shih Tzu', gender: 'Jantan', weight: '5 kg', birthDate: '2023-04-12', notes: 'Alergi ayam' },
  { id: 'PET-002', ownerId: 'CUS-0002', name: 'Luna', type: 'Kucing', breed: 'Persia', gender: 'Betina', weight: '4 kg', birthDate: '2024-01-20', notes: 'Agak penakut dengan orang baru' },
  { id: 'PET-003', ownerId: 'CUS-0003', name: 'Mochi', type: 'Kucing', breed: 'Domestik', gender: 'Jantan', weight: '3.5 kg', birthDate: '2025-08-10', notes: 'Baru pertama kali grooming' }
];

const demoPetNames = ['Oreo', 'Boba', 'Kiko', 'Coco', 'Puffy', 'Chiko', 'Mimi', 'Snowy', 'Toby', 'Mango', 'Nala', 'Kuro', 'Piko', 'Loki', 'Cleo', 'Milo Jr.', 'Bunny'];
const additionalPets = demoPetNames.map((name, index) => ({
  id: `PET-${String(index + 4).padStart(3, '0')}`,
  ownerId: `CUS-${String(4 + (index % 12)).padStart(4, '0')}`,
  name,
  type: index % 5 === 0 ? 'Kelinci' : index % 2 === 0 ? 'Anjing' : 'Kucing',
  breed: ['Domestik', 'Pomeranian', 'Persia', 'Beagle', 'Anggora'][index % 5],
  gender: index % 2 === 0 ? 'Jantan' : 'Betina',
  weight: `${(2.5 + (index % 8) * 0.5).toFixed(1)} kg`,
  birthDate: `202${index % 4}-${String(1 + (index % 12)).padStart(2, '0')}-${String(5 + (index * 3) % 22).padStart(2, '0')}`,
  notes: index % 3 === 0 ? 'Perlu pendekatan lembut saat perawatan' : '',
}));

export const pets = [...corePets, ...additionalPets];