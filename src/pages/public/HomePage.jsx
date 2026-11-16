import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiHeart, FiShield } from 'react-icons/fi';
import HeroSection from '../../components/public/HeroSection';
import ServiceCard from '../../components/public/ServiceCard';
import { createAdminNotification, initialServices, storageKeys } from '../../data/appData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const steps = [
  { number: '01', title: 'Pilih layanan', text: 'Temukan perawatan yang sesuai dengan kebutuhan sahabat berbulu.' },
  { number: '02', title: 'Tentukan jadwal', text: 'Pilih waktu kunjungan yang nyaman untuk kamu dan hewanmu.' },
  { number: '03', title: 'Nikmati perawatan', text: 'Datang sesuai jadwal dan simpan riwayat perawatan di satu tempat.' },
];

const HomePage = () => {
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const [, setMessages] = useLocalStorage('pawtner_messages', []);
  const [, setAdminNotifications] = useLocalStorage(storageKeys.adminNotifications, []);
  const [messageSent, setMessageSent] = useState(false);
  const submitMessage = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = {
      id: `MSG-${Date.now()}`,
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim().toLowerCase(),
      subject: String(form.get('subject') || '').trim(),
      body: String(form.get('message') || '').trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((items) => [message, ...items]);
    setAdminNotifications((items) => [createAdminNotification(
      'Pesan baru dari homepage',
      `${message.name} (${message.email}) · ${message.subject}: ${message.body}`,
      '/admin/notifications',
    ), ...items]);
    event.currentTarget.reset();
    setMessageSent(true);
  };
  return (
  <div className="public-page">
    <HeroSection />
    <section className="public-section">
      <div className="container">
        <div className="section-heading"><div><p className="eyebrow">PAWTNER CARE</p><h2>Perawatan tepat untuk setiap sahabat</h2><p>Layanan dari tim yang peduli, dengan informasi jadwal yang lebih mudah diakses.</p></div><Link to="/services" className="inline-link">Lihat semua layanan</Link></div>
        <div className="service-grid">{allServices.filter((service) => service.available !== false).slice(0, 3).map((service) => <ServiceCard service={service} key={service.id} />)}</div>
      </div>
    </section>
    <section className="public-section public-section-soft">
      <div className="container">
        <div className="section-heading centered"><p className="eyebrow">SIMPLE & PRAKTIS</p><h2>Mulai merawat dalam tiga langkah</h2><p>Semua kebutuhan layanan dan riwayat hewanmu tersusun rapi.</p></div>
        <div className="steps-grid">{steps.map((step) => <article className="step-card" key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
      </div>
    </section>
    <section className="public-section">
      <div className="container benefit-layout">
        <div><p className="eyebrow">LEBIH TENANG SETIAP KUNJUNGAN</p><h2>Semua detail kecil tentang hewanmu tetap teringat.</h2><p className="section-copy">Simpan profil hewan, catatan kebutuhan, jadwal kunjungan, dan riwayat layanan di portal Pawtner.</p><Link className="button-primary" to="/register">Mulai dengan Pawtner</Link></div>
        <div className="benefit-list">
          <div><span><FiHeart /></span><div><strong>Profil hewan tersimpan</strong><p>Informasi dasar dan preferensi lebih mudah ditemukan.</p></div></div>
          <div><span><FiCalendar /></span><div><strong>Jadwal lebih praktis</strong><p>Lihat booking mendatang dan statusnya dari satu dashboard.</p></div></div>
          <div><span><FiClock /></span><div><strong>Riwayat terorganisasi</strong><p>Catatan layanan terdahulu membantu kunjungan berikutnya.</p></div></div>
          <div><span><FiShield /></span><div><strong>Data sesuai peran</strong><p>Portal pelanggan dan admin menampilkan informasi yang relevan.</p></div></div>
        </div>
      </div>
    </section>
    <section className="public-section public-section-soft">
      <div className="container contact-grid">
        <div className="contact-info"><p className="eyebrow">HUBUNGI KAMI</p><h2>Ada yang ingin ditanyakan?</h2><p>Kirim pesan kepada tim Pawtner. Pesan tersimpan di demo ini dan muncul di notifikasi admin.</p></div>
        <form className="contact-form" onSubmit={submitMessage}>
          <h2>Kirim pesan</h2>
          <label>Nama<input name="name" required placeholder="Nama lengkap" /></label>
          <label>Email<input name="email" type="email" required placeholder="nama@email.com" /></label>
          <label>Subjek<input name="subject" required placeholder="Apa yang ingin ditanyakan?" /></label>
          <label>Pesan<textarea name="message" required rows="4" placeholder="Tulis pesanmu di sini..." /></label>
          <button className="button-primary" type="submit">Kirim pesan</button>
          {messageSent && <p className="form-success" role="status">Pesan tersimpan dan diteruskan ke notifikasi admin.</p>}
        </form>
      </div>
    </section>
    <section className="public-cta"><div className="container public-cta-content"><div><p className="eyebrow">SAHABAT TERBAIK LAYAK DIRAWAT</p><h2>Siap menjadwalkan kunjungan berikutnya?</h2><p>Jelajahi layanan Pawtner atau buat akun pelanggan untuk mengelola profil hewanmu.</p></div><Link to="/services" className="button-light">Jelajahi layanan</Link></div></section>
  </div>
  );
};

export default HomePage;
