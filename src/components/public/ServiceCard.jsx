import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatCurrency';

// Mengimpor variasi gambar layanan dari folder assets
import groomingImg from '../../assets/grooming-pet.png';
import clinicImg from '../../assets/clinic.png';
import defaultPetImg from '../../assets/pet-care.png';

const ServiceCard = ({ service }) => {
  if (!service) return null;

  // Fungsi untuk mencocokkan gambar dengan kategori di dummy data
  const getServiceImage = (category) => {
    switch (category?.toLowerCase()) {
      case 'grooming':
        return groomingImg;
      case 'klinik':
        return clinicImg;
      default:
        return defaultPetImg; // Digunakan untuk Penitipan & Daycare atau lainnya
    }
  };

  return (
    <article className="service-card">
      <div className="service-card-image">
        <img src={getServiceImage(service.category)} alt={service.name} />
        <span>{service.category}</span>
      </div>
      <div className="service-card-content">
        <div>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
        </div>
        <div className="service-card-meta"><span><FiClock /> {service.duration} menit</span><strong>{formatCurrency(service.price)}</strong></div>
        <Link to={`/services/${service.id.toLowerCase()}`} className="button-secondary">Lihat detail <FiArrowRight /></Link>
      </div>
    </article>
  );
};

export default ServiceCard;