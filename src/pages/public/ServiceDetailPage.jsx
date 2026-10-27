import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiCheck, FiClock, FiHeart } from 'react-icons/fi';
import { services } from '../../data/services';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../hooks/useAuth';
import groomingImage from '../../assets/grooming-pet.png';
import clinicImage from '../../assets/clinic.png';
import careImage from '../../assets/pet-care.png';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const { isCustomer } = useAuth();
  const service = services.find((item) => item.id.toLowerCase() === slug?.toLowerCase() || item.name.toLowerCase().replaceAll(' ', '-') === slug?.toLowerCase());
  if (!service) return <div className="container public-empty"><h1>Layanan tidak ditemukan</h1><Link to="/services" className="inline-link"><FiArrowLeft /> Kembali ke layanan</Link></div>;
  const image = service.category === 'Grooming' ? groomingImage : service.category === 'Klinik' ? clinicImage : careImage;
  const bookingPath = `/account/booking/new?service=${service.id}`;
  const bookingHref = isCustomer ? bookingPath : `/login?${new URLSearchParams({ returnTo: bookingPath })}`;
  return <div className="public-page"><div className="container service-detail-wrap"><Link to="/services" className="inline-link"><FiArrowLeft /> Semua layanan</Link><div className="service-detail-grid"><div className="service-detail-image"><img src={image} alt={service.name} /></div><div className="service-detail-copy"><span className="service-category-tag">{service.category}</span><h1>{service.name}</h1><p>{service.description}</p><div className="service-detail-price"><strong>{formatCurrency(service.price)}</strong><span>Harga contoh · {service.duration} menit</span></div><div className="service-includes"><h2>Informasi layanan</h2><p><FiHeart /> Untuk: {service.forType.join(', ')}</p><p><FiClock /> Estimasi durasi: {service.duration} menit</p><p><FiCheck /> Harga dan ketersediaan dapat berubah sesuai pengaturan bisnis.</p><p><FiCalendar /> Jadwal dikonfirmasi setelah booking ditinjau admin.</p></div><Link to={bookingHref} className="button-primary">Booking sekarang <FiCalendar /></Link><p className="muted-copy">Belum masuk? Setelah login, kamu dapat melanjutkan booking layanan ini.</p></div></div><div className="service-faq"><h2>Sebelum berkunjung</h2><p>Pastikan profil hewan dan catatan kebutuhan khusus sudah diperbarui. Hubungi bisnis untuk memastikan slot yang tersedia.</p></div></div></div>;
};

export default ServiceDetailPage;
