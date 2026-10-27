export const getStatusBadgeClass = (status) => {
  const normalizedStatus = status?.toLowerCase() || '';

  switch (normalizedStatus) {
    case 'terkonfirmasi':
      // Menggunakan aksen Sand Beige
      return 'bg-[#E5D6C3] text-[#321B16]'; 
    case 'selesai':
    case 'lunas':
      // Menggunakan Sage Green sesuai panduan desain
      return 'bg-[#E4ECE3] text-green-800'; 
    case 'menunggu':
    case 'belum dibayar':
      // Warna kuning/peringatan
      return 'bg-yellow-100 text-yellow-800';
    case 'dibatalkan':
      // Warna merah
      return 'bg-red-100 text-red-800';
    default:
      // Warna abu-abu default
      return 'bg-gray-100 text-gray-800';
  }
};