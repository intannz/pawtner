import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart } from 'react-icons/fi';
import heroImg from '../../assets/hug-pet.png';

const HeroSection = () => (
  <section className="hero-section">
    <div className="container hero-grid">
      <div className="hero-text">
        <div className="hero-tag"><span>Untuk mereka yang selalu ada di sisi kita</span><FiHeart /></div>
        <h1>Perawatan penuh kasih, lebih mudah bersama <span>Pawtner.</span></h1>
        <p>Solusi lengkap untuk kebutuhan perawatan hewan kesayanganmu. Mulai dari grooming, penitipan, hingga layanan klinik hewan, semuanya dalam satu platform.</p>
        <div className="hero-actions"><Link to="/services" className="button-primary">Jelajahi layanan <FiArrowRight /></Link><Link to="/login?returnTo=%2Faccount%2Fbooking%2Fnew" className="button-secondary">Buat booking</Link></div>
        <div className="hero-trust"><span><FiHeart /> Perawatan penuh perhatian</span><span><FiArrowRight /> Jadwal mudah dikelola</span></div>
      </div>
      <div className="hero-image-wrapper"><img src={heroImg} alt="Anjing dan kucing peliharaan yang sedang dipeluk" /><div className="hero-image-note"><strong>Care for pets.</strong><span>Build lasting bonds.</span></div></div>
    </div>
  </section>
);

export default HeroSection;
