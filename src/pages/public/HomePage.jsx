import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiClock, FiHeart, FiShield } from 'react-icons/fi';
import HeroSection from '../../components/public/HeroSection';
import ServiceCard from '../../components/public/ServiceCard';
import { services } from '../../data/services';

const steps = [
  { number: '01', title: 'Pilih layanan', text: 'Temukan perawatan yang sesuai dengan kebutuhan sahabat berbulu.' },
  { number: '02', title: 'Tentukan jadwal', text: 'Pilih waktu kunjungan yang nyaman untuk kamu dan hewanmu.' },
  { number: '03', title: 'Nikmati perawatan', text: 'Datang sesuai jadwal dan simpan riwayat perawatan di satu tempat.' },
];

const HomePage = () => (
  <div className="public-page">
    <HeroSection />
    <section className="public-section">
      <div className="container">
        <div className="section-heading"><div><p className="eyebrow">PAWTNER CARE</p><h2>Perawatan tepat untuk setiap sahabat</h2><p>Layanan dari tim yang peduli, dengan informasi jadwal yang lebih mudah diakses.</p></div><Link to="/services" className="inline-link">Lihat semua layanan <FiArrowRight /></Link></div>
        <div className="service-grid">{services.slice(0, 3).map((service) => <ServiceCard service={service} key={service.id} />)}</div>
      </div>
    </section>
    <section className="public-section public-section-soft">
      <div className="container">
        <div className="section-heading centered"><p className="eyebrow">SIMPLE & PRAKTIS</p><h2>Mulai merawat dalam tiga langkah</h2><p>Semua kebutuhan layanan dan riwayat hewanmu tersusun rapi.</p></div>
        <div className="steps-grid">{steps.map((step) => <article className="step-card" key={step.number}><span>{step.number}</span><FiArrowRight className="step-arrow" /><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
      </div>
    </section>
    <section className="public-section">
      <div className="container benefit-layout">
        <div><p className="eyebrow">LEBIH TENANG SETIAP KUNJUNGAN</p><h2>Semua detail kecil tentang hewanmu tetap teringat.</h2><p className="section-copy">Simpan profil hewan, catatan kebutuhan, jadwal kunjungan, dan riwayat layanan di portal Pawtner.</p><Link className="button-primary" to="/register">Mulai dengan Pawtner <FiArrowRight /></Link></div>
        <div className="benefit-list">
          <div><span><FiHeart /></span><div><strong>Profil hewan tersimpan</strong><p>Informasi dasar dan preferensi lebih mudah ditemukan.</p></div></div>
          <div><span><FiCalendar /></span><div><strong>Jadwal lebih praktis</strong><p>Lihat booking mendatang dan statusnya dari satu dashboard.</p></div></div>
          <div><span><FiClock /></span><div><strong>Riwayat terorganisasi</strong><p>Catatan layanan terdahulu membantu kunjungan berikutnya.</p></div></div>
          <div><span><FiShield /></span><div><strong>Data sesuai peran</strong><p>Portal pelanggan dan admin menampilkan informasi yang relevan.</p></div></div>
        </div>
      </div>
    </section>
    <section className="public-cta"><div className="container public-cta-content"><div><p className="eyebrow">SAHABAT TERBAIK LAYAK DIRAWAT</p><h2>Siap menjadwalkan kunjungan berikutnya?</h2><p>Jelajahi layanan Pawtner atau buat akun pelanggan untuk mengelola profil hewanmu.</p></div><Link to="/services" className="button-light">Jelajahi layanan <FiArrowRight /></Link></div></section>
  </div>
);

export default HomePage;
