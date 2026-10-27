import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { PageHeading } from '../../components/common/PageUI';

const questions = [
  ['Bagaimana cara membuat booking?', 'Pilih layanan yang tersedia, masuk ke akun pelanggan, pilih hewan dan jadwal yang diinginkan, lalu kirim permintaan booking. Admin akan mengonfirmasi jadwal.'],
  ['Apakah booking langsung terkonfirmasi?', 'Tidak selalu. Booking dengan status menunggu perlu ditinjau oleh admin bisnis sebelum jadwal dinyatakan terkonfirmasi.'],
  ['Bagaimana cara mengubah atau membatalkan jadwal?', 'Hubungi bisnis melalui informasi kontak yang tersedia. Aturan perubahan jadwal mengikuti kebijakan masing-masing bisnis.'],
  ['Bagaimana menambahkan profil hewan?', 'Masuk ke Customer Portal, buka menu Hewan Saya, lalu tambahkan data hewan dan catatan kebutuhannya.'],
  ['Apakah Pawtner mengirim pengingat melalui WhatsApp?', 'Pada versi demo ini pengingat hanya ditampilkan di dalam aplikasi. Integrasi WhatsApp belum diaktifkan.'],
  ['Apakah harga layanan di website adalah harga final?', 'Harga yang ditampilkan pada versi demo adalah data dummy. Harga sebenarnya mengikuti konfigurasi bisnis.'],
];

const FAQPage = () => {
  const [openQuestion, setOpenQuestion] = useState(0);
  return <div className="public-page"><section className="public-page-intro"><div className="container"><PageHeading eyebrow="PUSAT BANTUAN" title="Pertanyaan yang sering diajukan" description="Jawaban singkat seputar akun, booking, hewan, dan pengingat." /></div></section><section className="public-section"><div className="container faq-list">{questions.map(([question, answer], index) => <article className={`faq-item ${openQuestion === index ? 'faq-open' : ''}`} key={question}><button type="button" onClick={() => setOpenQuestion(openQuestion === index ? -1 : index)} aria-expanded={openQuestion === index}><span>{question}</span><FiChevronDown /></button>{openQuestion === index && <p>{answer}</p>}</article>)}<div className="faq-contact"><p>Belum menemukan jawaban yang dicari?</p><Link to="/contact" className="button-primary">Hubungi kami</Link></div></div></section></div>;
};

export default FAQPage;
