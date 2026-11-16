import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { FiBell, FiCalendar, FiCheck, FiHeart, FiPlus, FiUser } from 'react-icons/fi';
import { bookings as initialBookings } from '../../data/bookings';
import { pets as initialPets } from '../../data/pets';
import { users as initialUsers } from '../../data/users';
import { useAuth } from '../../hooks/useAuth';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { createAdminNotification, createNotification, customerHistoryDays, getBookingDraftKey, getBookingPriceSummary, getBookingRecords, getNextId, initialLoyaltySettings, initialNotifications, initialServices, isUpcomingCustomerBooking, isWithinCustomerHistoryWindow, normalizeLoyaltySettings, storageKeys } from '../../data/appData';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import { PageHeading, Panel, StatusPill } from '../../components/common/PageUI';

const getCustomerId = (user) => user?.id || initialUsers.find((item) => item.role === 'user')?.id;

export function CustomerDashboardPage() {
  const { user } = useAuth();
  const [allBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const [allPets] = useLocalStorage(storageKeys.pets, initialPets);
  const [allUsers] = useLocalStorage(storageKeys.users, initialUsers);
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const [notifications] = useLocalStorage(storageKeys.notifications, initialNotifications);
  const customerId = getCustomerId(user);
  const customer = allUsers.find((item) => item.id === customerId);
  const pets = allPets.filter((pet) => pet.ownerId === customerId);
  const customerBookings = getBookingRecords(allBookings, allPets, allUsers, allServices).filter((booking) => booking.customerId === customerId);
  const nextBooking = customerBookings.find((booking) => !['Selesai', 'Dibatalkan'].includes(booking.status));
  const notices = notifications.filter((item) => item.customerId === customerId).slice(0, 4);

  return <div className="page-shell customer-page">
    <PageHeading eyebrow="BERANDA PAWTNER" title={`Halo, ${customer?.name.split(' ')[0] || 'Sahabat'}!`} description="Senang melihatmu kembali. Yuk, atur perawatan terbaik untuk sahabat berbulu." action={<Link to="/account/booking/new" className="button-primary"><FiPlus /> Buat booking</Link>} />
    <section className="customer-welcome-card"><div><p className="eyebrow">PAWTNER CARE</p><h2>Rawat sahabatmu dengan lebih mudah</h2><p>Jelajahi katalog layanan, atur jadwal, dan kumpulkan poin dari setiap transaksi.</p><Link to="/account/services" className="button-light">Jelajahi katalog</Link></div><span className="customer-welcome-icon" aria-hidden="true"><FiHeart /></span></section>
    <div className="summary-row">
      <article className="pet-highlight"><span className="pet-avatar pet-avatar-large">{pets[0]?.name.slice(0, 1) || 'P'}</span><div><small>HEWAN PELIHARAAN</small><strong>{pets[0]?.name || 'Tambahkan hewan'}</strong><span>{pets[0] ? `${pets[0].type} · ${pets[0].breed}` : 'Lengkapi profil hewanmu'}</span></div><Link to="/account/pets">Lihat profil</Link></article>
      <article className="next-booking-card"><FiCalendar /><small>BOOKING BERIKUTNYA</small>{nextBooking ? <><strong>{nextBooking.service?.name}</strong><span>{formatDateTime(nextBooking.date)} · {nextBooking.pet?.name}</span><StatusPill value={nextBooking.status} /></> : <><strong>Belum ada jadwal</strong><Link to="/account/services">Pilih layanan</Link></>}</article>
    </div>
    <div className="customer-stat-grid"><article><FiHeart /><strong>{pets.length}</strong><span>Hewan saya</span></article><article><FiCalendar /><strong>{customerBookings.filter((booking) => !['Selesai', 'Dibatalkan'].includes(booking.status)).length}</strong><span>Booking aktif</span></article><article><FiBell /><strong>{notifications.filter((item) => item.customerId === customerId && !item.read).length}</strong><span>Notifikasi baru</span></article></div>
    <div className="detail-grid">
      <Panel title="Layanan pilihan" action={<Link className="inline-link" to="/account/services">Lihat katalog</Link>}><div className="quick-links">{allServices.slice(0, 2).map((service) => <Link key={service.id} to={`/account/services/${service.id.toLowerCase()}`}><span className="quick-icon"><FiHeart /></span><span><strong>{service.name}</strong><small>{formatCurrency(service.price)} · {service.duration} menit</small></span></Link>)}</div></Panel>
      <Panel title="Pembaruan terbaru" action={<Link className="inline-link" to="/account/notifications">Semua notifikasi</Link>}>{notices.length ? <div className="simple-list">{notices.map((notice) => <div className="simple-list-row" key={notice.id}><span className="service-icon"><FiBell /></span><span><strong>{notice.title}</strong><small>{formatDate(notice.date)} · {notice.message}</small></span></div>)}</div> : <p className="muted-copy">Belum ada notifikasi baru.</p>}</Panel>
    </div>
  </div>;
}

export function MyPetsPage() {
  const { user } = useAuth();
  const [allPets, setPets] = useLocalStorage(storageKeys.pets, initialPets);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const customerPets = allPets.filter((pet) => pet.ownerId === getCustomerId(user));
  const submitPet = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newPet = {
      id: getNextId(allPets, 'PET', 3),
      ownerId: getCustomerId(user),
      name: form.get('name'),
      type: form.get('type'),
      breed: form.get('breed') || 'Campuran',
      gender: form.get('gender'),
      weight: form.get('weight') || '',
      birthDate: form.get('birthDate') || '',
      notes: form.get('notes') || '',
    };
    setPets((items) => [...items, newPet]);
    event.currentTarget.reset();
    setSaved(true);
  };

  return <div className="page-shell customer-page">
    <PageHeading eyebrow="PROFIL HEWAN" title="Hewan saya" description="Simpan informasi dan kebutuhan khusus setiap sahabat berbulu." action={<button className="button-primary" type="button" onClick={() => { setShowForm((open) => !open); setSaved(false); }}><FiPlus /> Tambah hewan</button>} />
    <div className="customer-pet-grid">{customerPets.map((pet) => <article className="customer-pet-card" key={pet.id}><div className="pet-card-top"><span className="pet-avatar pet-avatar-large">{pet.name.slice(0, 1)}</span><span className="pet-card-label">{pet.type}</span></div><h2>{pet.name}</h2><p>{pet.breed} · {pet.gender}</p><dl><div><dt>Tanggal lahir</dt><dd>{pet.birthDate ? formatDate(pet.birthDate) : 'Belum diisi'}</dd></div><div><dt>Berat</dt><dd>{pet.weight || 'Belum diisi'}</dd></div><div><dt>Catatan</dt><dd>{pet.notes || 'Tidak ada catatan'}</dd></div></dl><Link to={`/account/pets/${pet.id}`} className="button-secondary">Lihat profil</Link></article>)}</div>
    {showForm && <Panel title="Tambah profil hewan"><form className="settings-form" onSubmit={submitPet}><label>Nama hewan<input name="name" required placeholder="Contoh: Kiko" /></label><label>Jenis hewan<select name="type" defaultValue="Anjing"><option>Anjing</option><option>Kucing</option><option>Kelinci</option></select></label><label>Ras<input name="breed" placeholder="Contoh: Shih Tzu" /></label><label>Jenis kelamin<select name="gender" defaultValue="Jantan"><option>Jantan</option><option>Betina</option></select></label><label>Berat<input name="weight" placeholder="Contoh: 5 kg" /></label><label>Tanggal lahir<input name="birthDate" type="date" /></label><label>Catatan<textarea name="notes" rows="2" placeholder="Kebutuhan khusus (opsional)" /></label><button className="button-primary" type="submit">Simpan hewan</button>{saved && <p className="form-success">Profil hewan berhasil ditambahkan.</p>}</form></Panel>}
    {!customerPets.length && <Panel title="Belum ada profil hewan"><p className="muted-copy">Tambahkan profil hewan untuk mulai membuat booking.</p></Panel>}
  </div>;
}

export function PetDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [allPets] = useLocalStorage(storageKeys.pets, initialPets);
  const [allBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const [allUsers] = useLocalStorage(storageKeys.users, initialUsers);
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const pet = allPets.find((item) => item.id === id && item.ownerId === getCustomerId(user));
  if (!pet) return <div className="page-shell"><PageHeading title="Profil hewan tidak ditemukan" /><Link to="/account/pets" className="inline-link">Kembali ke hewan saya</Link></div>;
  const history = getBookingRecords(allBookings, allPets, allUsers, allServices)
    .filter((item) => item.petId === pet.id && isWithinCustomerHistoryWindow(item.date));
  return <div className="page-shell customer-page"><PageHeading eyebrow="PROFIL HEWAN" title={pet.name} description={`${pet.type} · ${pet.breed}`} action={<Link to="/account/pets" className="button-secondary">Kembali ke daftar</Link>} /><div className="detail-grid"><Panel title="Informasi dasar"><dl className="detail-list"><div><dt>Jenis kelamin</dt><dd>{pet.gender}</dd></div><div><dt>Tanggal lahir</dt><dd>{pet.birthDate ? formatDate(pet.birthDate) : 'Belum diisi'}</dd></div><div><dt>Berat</dt><dd>{pet.weight || 'Belum diisi'}</dd></div><div><dt>Catatan kebutuhan</dt><dd>{pet.notes || 'Belum ada catatan khusus.'}</dd></div></dl></Panel><Panel title="Riwayat layanan" description={`Menampilkan histori ${customerHistoryDays} hari terakhir. Data yang lebih lama tetap tersimpan.`}><div className="simple-list">{history.map((item) => <div className="simple-list-row" key={item.id}><span className="service-icon"><FiHeart /></span><span><strong>{item.service?.name}</strong><small>{formatDateTime(item.date)}</small></span><StatusPill value={item.status} /></div>)}</div>{history.length === 0 && <p className="muted-copy">Belum ada riwayat layanan dalam {customerHistoryDays} hari terakhir.</p>}</Panel></div></div>;
}

export function MyBookingsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('Semua');
  const [allBookings, setBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const [allPets] = useLocalStorage(storageKeys.pets, initialPets);
  const [allUsers] = useLocalStorage(storageKeys.users, initialUsers);
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const [, setNotifications] = useLocalStorage(storageKeys.notifications, initialNotifications);
  const [, setAdminNotifications] = useLocalStorage(storageKeys.adminNotifications, []);
  const allCustomerBookings = getBookingRecords(allBookings, allPets, allUsers, allServices).filter((item) => item.customerId === getCustomerId(user));
  const visibleBookings = allCustomerBookings.filter((item) => {
    if (filter === 'Mendatang') return !['Selesai', 'Dibatalkan'].includes(item.status);
    const isUpcoming = isUpcomingCustomerBooking(item.date)
      && !['Selesai', 'Dibatalkan'].includes(item.status);
    if (!isWithinCustomerHistoryWindow(item.date) && !(filter === 'Semua' && isUpcoming)) return false;
    return filter === 'Semua' || ['Selesai', 'Dibatalkan'].includes(item.status);
  });
  const cancelBooking = (booking) => {
    setBookings((items) => items.map((item) => item.id === booking.id ? { ...item, status: 'Dibatalkan' } : item));
    setNotifications((items) => [createNotification(booking.customerId, 'Booking dibatalkan', `Booking ${booking.id} berhasil dibatalkan.`), ...items]);
    setAdminNotifications((items) => [createAdminNotification('Booking dibatalkan', `Booking ${booking.id} dibatalkan oleh pelanggan.`, `/admin/bookings/${booking.id}`), ...items]);
  };
  return <div className="page-shell customer-page"><PageHeading eyebrow="JADWAL" title="Booking saya" description="Riwayat sebelumnya menampilkan 30 hari terakhir; data lama tetap tersimpan. Booking mendatang tetap ditampilkan." action={<Link to="/account/booking/new" className="button-primary"><FiPlus /> Booking baru</Link>} /><div className="filter-tabs">{['Semua', 'Mendatang', 'Sebelumnya'].map((item) => <button type="button" className={filter === item ? 'selected' : ''} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="customer-booking-list">{visibleBookings.map((booking) => <article className="customer-booking-card" key={booking.id}><div className="booking-date-box"><strong>{new Date(booking.date).toLocaleDateString('id-ID', { day: '2-digit' })}</strong><span>{new Date(booking.date).toLocaleDateString('id-ID', { month: 'short' })}</span></div><div className="customer-booking-main"><div><small>{booking.id}</small><h2>{booking.service?.name}</h2><p>{booking.pet?.name} · {formatDateTime(booking.date)}</p></div><StatusPill value={booking.status} /></div><div className="booking-card-actions"><Link to={`/account/bookings/${booking.id}`} className="booking-detail-link">Detail</Link>{['Menunggu', 'Terkonfirmasi'].includes(booking.status) && <button type="button" className="table-action cancel-booking" onClick={() => cancelBooking(booking)}>Batalkan booking</button>}</div></article>)}{!visibleBookings.length && <Panel title="Tidak ada booking"><p className="muted-copy">Belum ada booking pada kategori ini.</p></Panel>}</div></div>;
}

export function BookingDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [allBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const [allPets] = useLocalStorage(storageKeys.pets, initialPets);
  const [allUsers] = useLocalStorage(storageKeys.users, initialUsers);
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const booking = getBookingRecords(allBookings, allPets, allUsers, allServices).find((item) => item.id === id && item.customerId === getCustomerId(user));
  if (!booking) return <div className="page-shell"><PageHeading title="Booking tidak ditemukan" /><Link to="/account/bookings" className="inline-link">Kembali ke booking</Link></div>;
  const price = getBookingPriceSummary(booking);
  return <div className="page-shell customer-page"><PageHeading eyebrow="RINGKASAN BOOKING" title={booking.id} description="Informasi terbaru untuk jadwal layananmu." action={<StatusPill value={booking.status} />} /><Link to="/account/bookings" className="inline-link">Kembali ke booking</Link><Panel title="Jadwal layanan"><dl className="detail-list"><div><dt>Layanan</dt><dd>{booking.service?.name}</dd></div><div><dt>Hewan</dt><dd>{booking.pet?.name} · {booking.pet?.type}</dd></div><div><dt>Waktu</dt><dd>{formatDateTime(booking.date)}</dd></div><div><dt>Estimasi durasi</dt><dd>{booking.service?.duration} menit</dd></div><div><dt>Harga awal</dt><dd>{formatCurrency(price.originalPrice)}</dd></div>{booking.voucherCode && <div><dt>Voucher</dt><dd>{booking.voucherCode}</dd></div>}<div><dt>Potongan</dt><dd>-{formatCurrency(price.discount)}</dd></div><div><dt>Total pembayaran</dt><dd><strong>{formatCurrency(price.totalAmount)}</strong></dd></div></dl></Panel></div>;
}

export function BookingFormPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get('service');
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const [draft, setDraft] = useLocalStorage(getBookingDraftKey(getCustomerId(user)), {});
  const initialServiceId = allServices.some((service) => service.id === requestedService) ? requestedService : draft.serviceId || '';
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId);
  const [voucherCode, setVoucherCode] = useState(draft.voucherCode || '');
  const [allBookings, setBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const [allPets] = useLocalStorage(storageKeys.pets, initialPets);
  const [, setNotifications] = useLocalStorage(storageKeys.notifications, initialNotifications);
  const [vouchers, setVouchers] = useLocalStorage(storageKeys.vouchers, []);
  const [, setAdminNotifications] = useLocalStorage(storageKeys.adminNotifications, []);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [reference, setReference] = useState('');
  const customerPets = allPets.filter((pet) => pet.ownerId === getCustomerId(user));
  const updateDraft = (field, value) => setDraft((current) => ({ ...current, serviceId: selectedServiceId, [field]: value }));
  const submit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const serviceId = form.get('serviceId');
    const petId = form.get('petId');
    const service = allServices.find((item) => item.id === serviceId);
    const normalizedCode = String(form.get('voucherCode') || '').trim().toUpperCase();
    const voucher = normalizedCode
      ? vouchers.find((item) => String(item.code || '').toUpperCase() === normalizedCode
        && item.customerId === getCustomerId(user)
        && !item.used
        && new Date(item.expiresAt) > new Date())
      : null;
    if (normalizedCode && !voucher) {
      setFormError('Kode voucher tidak valid, sudah digunakan, kedaluwarsa, atau bukan milik akun ini.');
      return;
    }
    if (!service) {
      setFormError('Layanan tidak ditemukan. Silakan pilih layanan yang tersedia.');
      return;
    }
    if (!allPets.some((pet) => pet.id === petId && pet.ownerId === getCustomerId(user))) {
      setFormError('Pilih profil hewan yang terhubung dengan akunmu.');
      return;
    }
    const date = `${form.get('date')}T${form.get('time')}:00`;
    const discount = voucher ? Math.min(voucher.discount, service.price) : 0;
    const newBooking = {
      id: getNextId(allBookings, 'BK', 3),
      customerId: getCustomerId(user),
      petId,
      serviceId,
      date,
      notes: form.get('notes') || '',
      servicePrice: service.price,
      voucherCode: voucher?.code || '',
      discount,
      totalAmount: service.price - discount,
      status: 'Menunggu',
    };
    setBookings((items) => [...items, newBooking]);
    setNotifications((items) => [createNotification(newBooking.customerId, 'Booking diterima', `Permintaan ${newBooking.id} sudah dikirim dan menunggu konfirmasi admin.`), ...items]);
    setAdminNotifications((items) => [createAdminNotification('Booking baru', `Booking ${newBooking.id} dari ${user.name} menunggu konfirmasi.`, `/admin/bookings/${newBooking.id}`), ...items]);
    if (voucher) setVouchers((items) => items.map((item) => item.id === voucher.id ? { ...item, used: true, usedAt: new Date().toISOString(), status: 'Digunakan', bookingId: newBooking.id } : item));
    setDraft({});
    setReference(newBooking.id);
    setFormError('');
    setSuccess(true);
  };
  const selectedService = allServices.find((service) => service.id === selectedServiceId);
  const activeVoucher = vouchers.find((item) => String(item.code || '').toUpperCase() === voucherCode.trim().toUpperCase()
    && item.customerId === getCustomerId(user)
    && !item.used
    && new Date(item.expiresAt) > new Date());
  const previewDiscount = selectedService && activeVoucher ? Math.min(activeVoucher.discount, selectedService.price) : 0;
  return <div className="page-shell customer-page"><PageHeading eyebrow="BUAT JADWAL" title="Booking layanan" description="Pilih layanan, hewan, dan waktu yang kamu inginkan." />{success ? <Panel title="Permintaan booking berhasil dikirim"><div className="booking-confirmation"><span><FiCheck /></span><h2>Terima kasih!</h2><p>Booking {reference} sudah tersimpan dan menunggu konfirmasi admin. Poin akan masuk setelah transaksi selesai; transaksi yang dibatalkan tidak mendapat poin.</p><Link className="button-primary" to="/account/bookings">Lihat booking saya</Link></div></Panel> : <Panel title="Detail permintaan"><form className="settings-form booking-form" onSubmit={submit}><label>Pilih layanan<select name="serviceId" required value={selectedServiceId} onChange={(event) => { setSelectedServiceId(event.target.value); updateDraft('serviceId', event.target.value); }}><option value="" disabled>Pilih layanan</option>{allServices.filter((service) => service.available !== false).map((service) => <option value={service.id} key={service.id}>{service.name} — {formatCurrency(service.price)}</option>)}</select></label><label>Pilih hewan<select name="petId" required value={draft.petId || ''} onChange={(event) => updateDraft('petId', event.target.value)}><option value="" disabled>Pilih hewan</option>{customerPets.map((pet) => <option value={pet.id} key={pet.id}>{pet.name} · {pet.type}</option>)}</select></label><label>Tanggal kunjungan<input name="date" required type="date" min={new Date().toISOString().slice(0, 10)} value={draft.date || ''} onChange={(event) => updateDraft('date', event.target.value)} /></label><label>Waktu yang diinginkan<select name="time" required value={draft.time || ''} onChange={(event) => updateDraft('time', event.target.value)}><option value="" disabled>Pilih waktu</option>{['09:00', '10:00', '13:00', '15:00'].map((time) => <option key={time} value={time}>{time.replace(':', '.')}</option>)}</select></label><label>Kode voucher (opsional)<input name="voucherCode" autoComplete="off" placeholder="Masukkan kode voucher" value={voucherCode} onChange={(event) => { setVoucherCode(event.target.value); updateDraft('voucherCode', event.target.value); }} /></label>{selectedService && <div className="booking-price-summary"><p>Harga layanan <strong>{formatCurrency(selectedService.price)}</strong></p><p>Potongan voucher <strong>-{formatCurrency(previewDiscount)}</strong></p><p>Total pembayaran <strong>{formatCurrency(selectedService.price - previewDiscount)}</strong></p>{voucherCode && !activeVoucher && <small>Kode belum valid atau tidak aktif untuk akun ini.</small>}</div>}<label>Catatan<textarea name="notes" rows="3" placeholder="Ceritakan kebutuhan khusus hewan (opsional)" value={draft.notes || ''} onChange={(event) => updateDraft('notes', event.target.value)} /></label>{formError && <p className="form-error">{formError}</p>}{customerPets.length === 0 && <p className="form-error">Tambahkan profil hewan terlebih dahulu sebelum membuat booking.</p>}<div className="booking-form-actions"><Link className="button-secondary" to="/account/bookings">Batal</Link><button className="button-primary" type="submit" disabled={!customerPets.length}>Kirim permintaan booking</button></div></form></Panel>}</div>;
}

export function CareHistoryPage() {
  const { user } = useAuth();
  const [allBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const [allPets] = useLocalStorage(storageKeys.pets, initialPets);
  const [allUsers] = useLocalStorage(storageKeys.users, initialUsers);
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const history = getBookingRecords(allBookings, allPets, allUsers, allServices)
    .filter((item) => item.customerId === getCustomerId(user)
      && item.status === 'Selesai'
      && isWithinCustomerHistoryWindow(item.date));
  return <div className="page-shell customer-page"><PageHeading eyebrow="CATATAN PERAWATAN" title="Riwayat perawatan" description={`Menampilkan layanan selesai dalam ${customerHistoryDays} hari terakhir. Data yang lebih lama tetap tersimpan.`} /><Panel title="Kunjungan selesai">{history.length ? <div className="customer-booking-list">{history.map((booking) => { const price = getBookingPriceSummary(booking); return <article className="customer-booking-card" key={booking.id}><span className="service-icon"><FiCheck /></span><div className="customer-booking-main"><div><small>{formatDate(booking.date)} · {booking.pet?.name}</small><h2>{booking.service?.name}</h2><p>{booking.voucherCode ? `Voucher ${booking.voucherCode} · potongan ${formatCurrency(price.discount)}` : 'Tanpa voucher'}</p></div><span><strong>{formatCurrency(price.totalAmount)}</strong>{price.discount > 0 && <small className="table-subline">Harga awal {formatCurrency(price.originalPrice)}</small>}</span></div><Link to="/account/booking/new" className="booking-detail-link">Booking ulang</Link></article>; })}</div> : <div className="empty-catalog"><FiHeart /><h2>Riwayatmu akan tampil di sini</h2><p>Tidak ada layanan selesai dalam {customerHistoryDays} hari terakhir.</p><Link to="/account/services" className="button-secondary">Lihat layanan</Link></div>}</Panel></div>;
}

export function NotificationsPage() {
  const { user } = useAuth();
  const [allNotifications, setNotifications] = useLocalStorage(storageKeys.notifications, initialNotifications);
  const notifications = allNotifications.filter((item) => item.customerId === getCustomerId(user));
  const markRead = (notificationId) => setNotifications((items) => items.map((item) => item.id === notificationId ? { ...item, read: true } : item));
  return <div className="page-shell customer-page"><PageHeading eyebrow="PEMBARUAN" title="Notifikasi" description="Konfirmasi booking, pengingat kunjungan, dan informasi layanan." /><Panel title="Terbaru"><div className="notification-list">{notifications.length ? notifications.map((item) => <article key={item.id} className={item.read ? 'notification-read' : ''}><span className="notification-icon"><FiBell /></span><div><strong>{item.title}</strong><p>{item.message}</p><time>{formatDateTime(item.date)}</time></div>{!item.read && <button type="button" className="table-action" onClick={() => markRead(item.id)}>Tandai dibaca</button>}</article>) : <p className="muted-copy">Belum ada notifikasi baru.</p>}</div></Panel></div>;
}

export function ProfilePage() {
  const { user, setUser } = useAuth();
  const [allUsers, setUsers] = useLocalStorage(storageKeys.users, initialUsers);
  const [storedLoyaltySettings] = useLocalStorage(storageKeys.loyalty, initialLoyaltySettings);
  const loyaltySettings = normalizeLoyaltySettings(storedLoyaltySettings);
  const customer = allUsers.find((item) => item.id === getCustomerId(user)) || initialUsers[0];
  const [saved, setSaved] = useState(false);
  const saveProfile = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const updated = { ...customer, name: form.get('name'), email: form.get('email'), phone: form.get('phone') };
    setUsers((items) => items.map((item) => item.id === customer.id ? updated : item));
    setUser(updated);
    setSaved(true);
  };
  return <div className="page-shell customer-page"><PageHeading eyebrow="PENGATURAN AKUN" title="Profil saya" description="Kelola informasi kontak dan preferensi akun." /><div className="detail-grid"><Panel title="Informasi pribadi"><form className="settings-form" onSubmit={saveProfile}><label>Nama lengkap<input name="name" defaultValue={customer.name} required /></label><label>Email<input name="email" type="email" defaultValue={customer.email} required /></label><label>Nomor telepon<input name="phone" defaultValue={customer.phone} /></label><button className="button-primary" type="submit"><FiUser /> Simpan perubahan</button>{saved && <p className="form-success">Perubahan profil berhasil disimpan.</p>}</form></Panel><Panel title="Aturan poin"><p className="muted-copy">Setiap transaksi selesai senilai {formatCurrency(loyaltySettings.amountPerPoint)} mendapatkan 1 poin. Poin tidak kedaluwarsa dan dapat ditukar mulai dari 5 poin melalui halaman Voucher. Voucher berlaku {loyaltySettings.voucherValidityMonths} bulan setelah diterbitkan.</p><Link className="button-secondary" to="/account/vouchers">Lihat poin & voucher</Link></Panel></div></div>;
}
