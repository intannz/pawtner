import { Link } from 'react-router-dom';
import { FiHeart, FiShield, FiUsers } from 'react-icons/fi';
import hugPetImage from '../../assets/hug-pet.png';

const AboutPage = () => (
  <div className="public-page">
    <section className="public-page-intro"><div className="container about-hero"><div><p className="eyebrow">TENTANG PAWTNER</p><h1>Care for pets.<br /><span>Build lasting bonds.</span></h1><p>Pawtner membantu bisnis pet care dan pemilik hewan merawat setiap sahabat dengan lebih terorganisasi.</p><Link className="button-primary" to="/services">Jelajahi layanan</Link></div><img src={hugPetImage} alt="Pemilik memeluk hewan peliharaan" /></div></section>
    <section className="public-section"><div className="container about-story"><div><p className="eyebrow">CERITA KAMI</p><h2>Perawatan yang baik dimulai dari perhatian.</h2></div><p>Pawtner adalah platform pengelolaan pet care yang menyatukan katalog layanan, booking, profil hewan, dan riwayat perawatan. Kami ingin pemilik hewan lebih mudah menjaga kebutuhan sahabatnya dan bisnis pet care lebih siap memberikan pelayanan yang konsisten.</p></div></section>
    <section className="public-section public-section-soft"><div className="container"><div className="section-heading centered"><p className="eyebrow">NILAI PAWTNER</p><h2>Terhubung oleh kepedulian</h2></div><div className="values-grid"><article><FiHeart /><h3>Perawatan penuh empati</h3><p>Setiap hewan memiliki karakter dan kebutuhan yang berbeda.</p></article><article><FiShield /><h3>Informasi yang tertata</h3><p>Catatan perawatan membantu tim memahami kebutuhan dari kunjungan ke kunjungan.</p></article><article><FiUsers /><h3>Hubungan jangka panjang</h3><p>Pengingat dan riwayat mendukung komunikasi yang lebih baik dengan pelanggan.</p></article></div></div></section>
  </div>
);

export default AboutPage;
