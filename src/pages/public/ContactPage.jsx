import { useState } from 'react';
import { FiClock, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { PageHeading } from '../../components/common/PageUI';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  return <div className="public-page"><section className="public-page-intro"><div className="container"><PageHeading eyebrow="KONTAK" title="Kami siap membantu" description="Kirim pertanyaan seputar layanan Pawtner. Formulir demo ini tidak mengirimkan data ke server." /></div></section><section className="public-section"><div className="container contact-grid"><div className="contact-info"><h2>Informasi bisnis</h2><p>Kontak dan jam operasional di bawah adalah data contoh.</p><div><FiMapPin /><span><strong>Alamat</strong><small>Jl. Sahabat Hewan No. 10, Jakarta</small></span></div><div><FiPhone /><span><strong>Telepon</strong><small>0812-0000-0000</small></span></div><div><FiMail /><span><strong>Email</strong><small>halo@pawtner.example</small></span></div><div><FiClock /><span><strong>Jam operasional</strong><small>Senin–Sabtu, 09.00–18.00 WIB</small></span></div></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><h2>Kirim pesan</h2><label>Nama<input required placeholder="Nama lengkap" /></label><label>Email<input type="email" required placeholder="nama@email.com" /></label><label>Subjek<input required placeholder="Apa yang ingin ditanyakan?" /></label><label>Pesan<textarea required rows="5" placeholder="Tulis pesanmu di sini..." /></label><button className="button-primary" type="submit">Kirim pesan</button>{submitted && <p className="form-success">Pesan contoh berhasil disiapkan. Belum dikirim ke server.</p>}</form></div></section></div>;
};

export default ContactPage;
