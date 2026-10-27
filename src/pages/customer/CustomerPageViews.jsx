import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiBell, FiCalendar, FiCheck, FiClock, FiHeart, FiPlus, FiUser } from 'react-icons/fi';
import { bookingRecords, petRecords, reminderRecords, customers } from '../../data/viewModels';
import { services } from '../../data/services';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import { DemoNotice, PageHeading, Panel, StatusPill } from '../../components/common/PageUI';

const getCustomerId = (user) => user?.role === 'customer' ? user.id : customers[0]?.id;

export function CustomerDashboardPage() {
  const { user } = useAuth();
  const customerId = getCustomerId(user);
  const customer = customers.find((item) => item.id === customerId) || customers[0];
  const pets = petRecords.filter((pet) => pet.ownerId === customerId);
  const bookings = bookingRecords.filter((booking) => booking.customerId === customerId);
  const nextBooking = bookings.find((booking) => booking.status !== 'Selesai' && booking.status !== 'Dibatalkan');
  const notices = reminderRecords.filter((item) => item.customerId === customerId);
  return <div className="page-shell customer-page"><PageHeading eyebrow="CUSTOMER PORTAL" title={`Halo, ${customer?.name.split(' ')[0] || 'Sahabat'}!`} description="Apa kabar sahabat berbulu hari ini?" action={<Link to="/account/booking/new" className="button-primary"><FiPlus /> Buat booking</Link>} /><DemoNotice /><div className="summary-row"><article className="pet-highlight"><span className="pet-avatar pet-avatar-large">{pets[0]?.name.slice(0, 1) || 'P'}</span><div><small>HEWAN PELIHARAAN</small><strong>{pets[0]?.name || 'Tambahkan hewan'}</strong><span>{pets[0] ? `${pets[0].type} · ${pets[0].breed}` : 'Lengkapi profil hewanmu'}</span></div><Link to="/account/pets">Lihat profil →</Link></article><article className="next-booking-card"><FiCalendar /><small>BOOKING BERIKUTNYA</small>{nextBooking ? <><strong>{nextBooking.service?.name}</strong><span>{formatDateTime(nextBooking.date)} · {nextBooking.pet?.name}</span><StatusPill value={nextBooking.status} /></> : <><strong>Belum ada jadwal</strong><Link to="/account/booking/new">Pilih layanan →</Link></>}</article></div><div className="customer-stat-grid"><article><FiHeart /><strong>{pets.length}</strong><span>Hewan saya</span></article><article><FiCalendar /><strong>{bookings.filter((booking) => !['Selesai', 'Dibatalkan'].includes(booking.status)).length}</strong><span>Booking aktif</span></article><article><FiClock /><strong>{bookings.filter((booking) => booking.status === 'Selesai').length}</strong><span>Riwayat layanan</span></article></div><div className="detail-grid"><Panel title="Akses cepat"><div className="quick-links"><Link to="/account/booking/new"><span className="quick-icon"><FiCalendar /></span><span><strong>Booking layanan</strong><small>Pilih layanan dan jadwal baru.</small></span><FiArrowRight /></Link><Link to="/account/pets"><span className="quick-icon"><FiHeart /></span><span><strong>Hewan saya</strong><small>Lihat dan kelola profil hewan.</small></span><FiArrowRight /></Link></div></Panel><Panel title="Pengingat terbaru" action={<Link className="inline-link" to="/account/notifications">Semua notifikasi →</Link>}>{notices.length ? <div className="simple-list">{notices.map((notice) => <div className="simple-list-row" key={notice.id}><span className="service-icon"><FiBell /></span><span><strong>{notice.reason}</strong><small>{formatDate(notice.date)}</small></span><StatusPill value={notice.status} /></div>)}</div> : <p className="muted-copy">Belum ada pengingat baru.</p>}</Panel></div></div>;
}

export function MyPetsPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [added, setAdded] = useState(false);
  const pets = petRecords.filter((pet) => pet.ownerId === getCustomerId(user));
  return <div className="page-shell customer-page"><PageHeading eyebrow="PROFIL HEWAN" title="Hewan saya" description="Simpan informasi dan kebutuhan khusus setiap sahabat berbulu." action={<button className="button-primary" type="button" onClick={() => { setShowForm((open) => !open); setAdded(false); }}><FiPlus /> Tambah hewan</button>} /><DemoNotice /><div className="customer-pet-grid">{pets.map((pet) => <article className="customer-pet-card" key={pet.id}><div className="pet-card-top"><span className="pet-avatar pet-avatar-large">{pet.name.slice(0, 1)}</span><span className="pet-card-label">{pet.type}</span></div><h2>{pet.name}</h2><p>{pet.breed} · {pet.gender}</p><dl><div><dt>Tanggal lahir</dt><dd>{formatDate(pet.birthDate)}</dd></div><div><dt>Berat</dt><dd>{pet.weight || 'Belum diisi'}</dd></div><div><dt>Catatan</dt><dd>{pet.notes || 'Tidak ada catatan'}</dd></div></dl><Link to={`/account/pets/${pet.id}`} className="button-secondary">Lihat profil <FiArrowRight /></Link></article>)}</div>{showForm && <Panel title="Tambah profil hewan"><form className="settings-form" onSubmit={(event) => { event.preventDefault(); setAdded(true); }}><label>Nama hewan<input required placeholder="Contoh: Kiko" /></label><label>Jenis hewan<select defaultValue="Anjing"><option>Anjing</option><option>Kucing</option><option>Kelinci</option></select></label><label>Ras<input placeholder="Contoh: Shih Tzu" /></label><button className="button-primary" type="submit">Simpan pratinjau</button>{added && <p className="form-success">Profil baru hanya ditampilkan sebagai pratinjau dan belum tersimpan ke server.</p>}</form></Panel>}</div>;
}

export function PetDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const pet = petRecords.find((item) => item.id === id && item.ownerId === getCustomerId(user));
  if (!pet) return <div className="page-shell"><PageHeading title="Profil hewan tidak ditemukan" /><Link to="/account/pets" className="inline-link">Kembali ke hewan saya →</Link></div>;
  const history = bookingRecords.filter((item) => item.petId === pet.id);
  return <div className="page-shell customer-page"><PageHeading eyebrow="PROFIL HEWAN" title={pet.name} description={`${pet.type} · ${pet.breed}`} action={<Link to="/account/pets" className="button-secondary">Kembali ke daftar</Link>} /><DemoNotice /><div className="detail-grid"><Panel title="Informasi dasar"><dl className="detail-list"><div><dt>Jenis kelamin</dt><dd>{pet.gender}</dd></div><div><dt>Tanggal lahir</dt><dd>{formatDate(pet.birthDate)}</dd></div><div><dt>Berat</dt><dd>{pet.weight || 'Belum diisi'}</dd></div><div><dt>Catatan kebutuhan</dt><dd>{pet.notes || 'Belum ada catatan khusus.'}</dd></div></dl></Panel><Panel title="Riwayat layanan"><div className="simple-list">{history.map((item) => <div className="simple-list-row" key={item.id}><span className="service-icon"><FiHeart /></span><span><strong>{item.service?.name}</strong><small>{formatDateTime(item.date)}</small></span><StatusPill value={item.status} /></div>)}</div>{history.length === 0 && <p className="muted-copy">Belum ada riwayat layanan untuk hewan ini.</p>}</Panel></div></div>;
}

export function MyBookingsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('Semua');
  const allBookings = bookingRecords.filter((item) => item.customerId === getCustomerId(user));
  const visibleBookings = allBookings.filter((item) => filter === 'Semua' || (filter === 'Mendatang' ? !['Selesai', 'Dibatalkan'].includes(item.status) : ['Selesai', 'Dibatalkan'].includes(item.status)));
  return <div className="page-shell customer-page"><PageHeading eyebrow="JADWAL" title="Booking saya" description="Lihat jadwal layanan yang akan datang dan kunjungan sebelumnya." action={<Link to="/account/booking/new" className="button-primary"><FiPlus /> Booking baru</Link>} /><DemoNotice /><div className="filter-tabs">{['Semua', 'Mendatang', 'Sebelumnya'].map((item) => <button type="button" className={filter === item ? 'selected' : ''} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="customer-booking-list">{visibleBookings.map((booking) => <article className="customer-booking-card" key={booking.id}><div className="booking-date-box"><strong>{new Date(booking.date).toLocaleDateString('id-ID', { day: '2-digit' })}</strong><span>{new Date(booking.date).toLocaleDateString('id-ID', { month: 'short' })}</span></div><div className="customer-booking-main"><div><small>{booking.id}</small><h2>{booking.service?.name}</h2><p>{booking.pet?.name} · {formatDateTime(booking.date)}</p></div><StatusPill value={booking.status} /></div><Link to={`/account/bookings/${booking.id}`} className="booking-detail-link">Detail <FiArrowRight /></Link></article>)}{!visibleBookings.length && <Panel title="Tidak ada booking"><p className="muted-copy">Belum ada booking pada kategori ini.</p></Panel>}</div></div>;
}

export function BookingDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const booking = bookingRecords.find((item) => item.id === id && item.customerId === getCustomerId(user));
  if (!booking) return <div className="page-shell"><PageHeading title="Booking tidak ditemukan" /><Link to="/account/bookings" className="inline-link">Kembali ke booking →</Link></div>;
  return <div className="page-shell customer-page"><PageHeading eyebrow="RINGKASAN BOOKING" title={booking.id} description="Informasi booking dari data demonstrasi." action={<StatusPill value={booking.status} />} /><Link to="/account/bookings" className="inline-link">← Kembali ke booking</Link><DemoNotice /><div className="detail-grid"><Panel title="Jadwal layanan"><dl className="detail-list"><div><dt>Layanan</dt><dd>{booking.service?.name}</dd></div><div><dt>Hewan</dt><dd>{booking.pet?.name} · {booking.pet?.type}</dd></div><div><dt>Waktu</dt><dd>{formatDateTime(booking.date)}</dd></div><div><dt>Estimasi durasi</dt><dd>{booking.service?.duration} menit</dd></div><div><dt>Harga contoh</dt><dd>{formatCurrency(booking.service?.price)}</dd></div></dl></Panel><Panel title="Informasi kunjungan"><p>Admin akan mengonfirmasi jadwal jika status booking masih menunggu. Untuk mengubah jadwal, hubungi bisnis melalui kanal kontak yang tersedia.</p><Link to="/contact" className="button-secondary">Hubungi bisnis</Link></Panel></div></div>;
}

export function BookingFormPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get('service');
  const initialServiceId = services.some((service) => service.id === requestedService) ? requestedService : '';
  const customerPets = petRecords.filter((pet) => pet.ownerId === getCustomerId(user));
  const [success, setSuccess] = useState(false);
  const [reference, setReference] = useState('');
  const submit = (event) => {
    event.preventDefault();
    setReference(`BK-DEMO-${String(Date.now()).slice(-4)}`);
    setSuccess(true);
  };
  return <div className="page-shell customer-page"><PageHeading eyebrow="BUAT JADWAL" title="Booking layanan" description="Pilih layanan, hewan, dan waktu yang kamu inginkan." /><DemoNotice>Permintaan booking hanya simulasi dan belum dikirim ke bisnis.</DemoNotice>{success ? <Panel title="Permintaan booking disiapkan"><div className="booking-confirmation"><span><FiCheck /></span><h2>Terima kasih!</h2><p>Referensi demo {reference} berhasil dibuat di tampilan. Tidak ada data yang dikirim ke server.</p><Link className="button-primary" to="/account/bookings">Lihat booking saya</Link></div></Panel> : <Panel title="Detail permintaan"><form className="settings-form booking-form" onSubmit={submit}><label>Pilih layanan<select required defaultValue={initialServiceId}><option value="" disabled>Pilih layanan</option>{services.map((service) => <option value={service.id} key={service.id}>{service.name} — {formatCurrency(service.price)}</option>)}</select></label><label>Pilih hewan<select required defaultValue=""><option value="" disabled>Pilih hewan</option>{customerPets.map((pet) => <option value={pet.id} key={pet.id}>{pet.name} · {pet.type}</option>)}</select></label><label>Tanggal kunjungan<input required type="date" min={new Date().toISOString().slice(0, 10)} /></label><label>Waktu yang diinginkan<select required defaultValue=""><option value="" disabled>Pilih waktu</option>{['09.00', '10.00', '13.00', '15.00'].map((time) => <option key={time}>{time}</option>)}</select></label><label>Catatan<textarea rows="3" placeholder="Ceritakan kebutuhan khusus hewan (opsional)" /></label><button className="button-primary" type="submit">Kirim permintaan booking <FiArrowRight /></button></form></Panel>}</div>;
}

export function CareHistoryPage() {
  const { user } = useAuth();
  const history = bookingRecords.filter((item) => item.customerId === getCustomerId(user) && item.status === 'Selesai');
  return <div className="page-shell customer-page"><PageHeading eyebrow="CATATAN PERAWATAN" title="Riwayat perawatan" description="Lihat layanan yang pernah diselesaikan oleh hewanmu." /><DemoNotice /><Panel title="Kunjungan selesai">{history.length ? <div className="customer-booking-list">{history.map((booking) => <article className="customer-booking-card" key={booking.id}><span className="service-icon"><FiCheck /></span><div className="customer-booking-main"><div><small>{formatDate(booking.date)} · {booking.pet?.name}</small><h2>{booking.service?.name}</h2><p>Catatan petugas belum tersedia pada data demo.</p></div><strong>{formatCurrency(booking.service?.price)}</strong></div><Link to="/account/booking/new" className="booking-detail-link">Booking ulang <FiArrowRight /></Link></article>)}</div> : <div className="empty-catalog"><FiHeart /><h2>Riwayatmu akan tampil di sini</h2><p>Data demo belum memiliki layanan selesai untuk akun ini.</p><Link to="/services" className="button-secondary">Lihat layanan</Link></div>}</Panel></div>;
}

export function NotificationsPage() {
  const { user } = useAuth();
  const notifications = reminderRecords.filter((item) => item.customerId === getCustomerId(user));
  return <div className="page-shell customer-page"><PageHeading eyebrow="PEMBARUAN" title="Notifikasi" description="Konfirmasi booking, pengingat kunjungan, dan informasi layanan." /><DemoNotice>Notifikasi ditampilkan di halaman ini saja. Pengiriman email/WhatsApp belum aktif.</DemoNotice><Panel title="Terbaru"><div className="notification-list">{notifications.length ? notifications.map((item) => <article key={item.id}><span className="notification-icon"><FiBell /></span><div><strong>{item.reason}</strong><p>Status: {item.status}</p><time>{formatDate(item.date)}</time></div><span className="notification-dot" /></article>) : <p className="muted-copy">Belum ada notifikasi baru.</p>}</div></Panel></div>;
}

export function ProfilePage() {
  const { user } = useAuth();
  const customer = customers.find((item) => item.id === getCustomerId(user)) || customers[0];
  const [saved, setSaved] = useState(false);
  return <div className="page-shell customer-page"><PageHeading eyebrow="PENGATURAN AKUN" title="Profil saya" description="Kelola informasi kontak dan preferensi akun." /><DemoNotice /><div className="detail-grid"><Panel title="Informasi pribadi"><form className="settings-form" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}><label>Nama lengkap<input defaultValue={customer.name} required /></label><label>Email<input type="email" defaultValue={customer.email} required /></label><label>Nomor telepon<input defaultValue={customer.phone} /></label><label>Alamat<input placeholder="Tambahkan alamat bila diperlukan" /></label><button className="button-primary" type="submit"><FiUser /> Simpan perubahan demo</button>{saved && <p className="form-success">Perubahan hanya disimpan di tampilan saat ini.</p>}</form></Panel><Panel title="Preferensi notifikasi"><label className="preference-toggle"><input type="checkbox" defaultChecked /> Pengingat booking di dalam aplikasi</label><label className="preference-toggle"><input type="checkbox" /> Informasi layanan dan promo</label><p className="form-note">Preferensi ini belum tersinkron ke server atau layanan pesan eksternal.</p></Panel></div></div>;
}
