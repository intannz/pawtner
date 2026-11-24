import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FiActivity, FiCalendar, FiCheckCircle, FiChevronLeft, FiChevronRight, FiClock, FiDownload,
  FiHeart, FiMail, FiMapPin, FiPlus, FiSearch,
  FiSettings, FiShoppingBag, FiTrendingUp, FiUsers
} from 'react-icons/fi';
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from 'recharts';
import { customers, getMonthlyPerformance, getServicePerformance, vouchers } from '../../data/viewModels';
import { reminders } from '../../data/reminders';
import { users } from '../../data/users';
import { bookings as initialBookings } from '../../data/bookings';
import { pets as initialPets } from '../../data/pets';
import { transactions as initialTransactions } from '../../data/transactions';
import { dashboardStats } from '../../data/dashboardStats';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAuth } from '../../hooks/useAuth';
import {
  createNotification,
  customerHistoryDays,
  getActivePointLots,
  getActivePoints,
  getBookingPriceSummary,
  getBookingRecords,
  getCustomerSegments,
  getNextId,
  isWithinCustomerHistoryWindow,
  initialServices,
  initialStaff,
  initialLoyaltySettings,
  initialNotifications,
  normalizeLoyaltySettings,
  storageKeys,
} from '../../data/appData';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import { Avatar, DemoNotice, PageHeading, Panel, StatTile, StatusPill } from '../../components/common/PageUI';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';

const searchText = (record, query) => Object.values(record).some((value) => String(value ?? '').toLowerCase().includes(query.toLowerCase()));

function SearchAndFilter({ search, setSearch, placeholder = 'Cari data...' }) {
  return (
    <div className="table-toolbar">
      <label className="page-search">
        <FiSearch aria-hidden="true" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={placeholder} />
      </label>
    </div>
  );
}

function PersonCell({ name, detail }) {
  return <div className="table-person"><Avatar name={name} /><span><strong>{name || 'Pelanggan'}</strong><small>{detail}</small></span></div>;
}

function matchesBookingPeriod(value, period) {
  if (period === 'Semua') return true;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (period === 'Hari ini') return dateDay.getTime() === todayDay.getTime();
  if (period === 'Bulan ini') return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
  const weekStart = new Date(todayDay);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const nextWeekStart = new Date(weekStart);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  return dateDay >= weekStart && dateDay < nextWeekStart;
}

function downloadReportCsv(bookingData) {
  const rows = [
    ['ID Booking', 'Pelanggan', 'Hewan', 'Layanan', 'Jadwal', 'Status'],
    ...bookingData.map((booking) => [
      booking.id,
      booking.customer?.name || '',
      booking.pet?.name || '',
      booking.service?.name || '',
      formatDateTime(booking.date),
      booking.status,
    ]),
  ];
  const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
  const file = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pawtner-laporan-booking-demo.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export function BookingsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Semua status');
  const [view, setView] = useState('Semua');
  const [allBookings, setBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const [allUsers, setUsers] = useLocalStorage(storageKeys.users, users);
  const [allPets] = useLocalStorage(storageKeys.pets, initialPets);
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const [, setNotifications] = useLocalStorage(storageKeys.notifications, initialNotifications);
  const [storedLoyaltySettings] = useLocalStorage(storageKeys.loyalty, initialLoyaltySettings);
  const loyaltySettings = normalizeLoyaltySettings(storedLoyaltySettings);
  const rows = getBookingRecords(allBookings, allPets, allUsers, allServices).filter((row) => {
    const matchesSearch = searchText({ id: row.id, customer: row.customer?.name, pet: row.pet?.name, service: row.service?.name }, search);
    const matchesStatus = status === 'Semua status' || row.status === status;
    const matchesDate = matchesBookingPeriod(row.date, view);
    return matchesSearch && matchesStatus && matchesDate;
  });
  const columns = [
    { header: 'ID Booking', accessor: 'id', render: (row) => <Link className="table-link" to={`/admin/bookings/${row.id}`}>{row.id}</Link> },
    { header: 'Pelanggan', render: (row) => <PersonCell name={row.customer?.name} detail={row.customer?.phone} /> },
    { header: 'Hewan', render: (row) => <span><strong>{row.pet?.name}</strong><small className="table-subline">{row.pet?.type} · {row.pet?.breed}</small></span> },
    { header: 'Layanan', render: (row) => row.service?.name },
    { header: 'Jadwal', render: (row) => formatDateTime(row.date) },
    { header: 'Status', render: (row) => <StatusPill value={row.status} /> },
    { header: 'Aksi', render: (row) => ['Menunggu', 'Terkonfirmasi'].includes(row.status) ? <button className="table-action" type="button" onClick={() => updateAdminBooking(row, row.status === 'Menunggu' ? 'Terkonfirmasi' : 'Selesai')}>{row.status === 'Menunggu' ? 'Konfirmasi' : 'Tandai selesai'}</button> : '—' },
  ];
  const updateAdminBooking = (booking, nextStatus) => {
    setBookings((items) => items.map((item) => item.id === booking.id ? { ...item, status: nextStatus, ...(nextStatus === 'Selesai' ? { pointsAwarded: true } : {}) } : item));
    const message = nextStatus === 'Terkonfirmasi'
      ? `Booking ${booking.id} telah disetujui admin.`
      : nextStatus === 'Dibatalkan'
        ? `Booking ${booking.id} dibatalkan admin.`
        : `Booking ${booking.id} telah selesai.`;
    setNotifications((items) => [createNotification(booking.customerId, `Status booking ${nextStatus.toLowerCase()}`, message), ...items]);
    if (nextStatus === 'Selesai' && !booking.pointsAwarded) {
      const transactionAmount = getBookingPriceSummary(booking).totalAmount;
      const earned = Math.floor(transactionAmount / loyaltySettings.amountPerPoint);
      if (earned > 0) setUsers((items) => items.map((person) => {
        if (person.id !== booking.customerId) return person;
        const pointLots = getActivePointLots(person);
        const newLot = { points: earned, earnedAt: new Date().toISOString() };
        return { ...person, pointLots: [...pointLots, newLot], points: getActivePoints(person) + earned };
      }));
    }
  };
  return <div className="page-shell">
    <PageHeading eyebrow="OPERASIONAL" title="Booking & Kalender" description="Pantau jadwal layanan dan status kunjungan pelanggan." />
    <div className="summary-row"><StatTile icon={<FiCalendar />} label="Booking ditampilkan" value={rows.length} /><StatTile icon={<FiCheckCircle />} label="Terkonfirmasi" value={getBookingRecords(allBookings, allPets, allUsers, allServices).filter((item) => item.status === 'Terkonfirmasi').length} tone="sage" /><StatTile icon={<FiClock />} label="Menunggu" value={getBookingRecords(allBookings, allPets, allUsers, allServices).filter((item) => item.status === 'Menunggu').length} tone="sand" /></div>
    <Panel title="Jadwal booking" description="Gunakan periode untuk memeriksa agenda dan status kunjungan.">
      <div className="filter-tabs admin-view-tabs">{['Semua', 'Hari ini', 'Minggu ini', 'Bulan ini'].map((item) => <button type="button" className={view === item ? 'selected' : ''} key={item} onClick={() => setView(item)}>{item}</button>)}</div>
      <div className="table-toolbar">
        <label className="page-search"><FiSearch /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama, hewan, atau ID booking..." /></label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter status"><option>Semua status</option>{['Menunggu', 'Terkonfirmasi', 'Selesai', 'Dibatalkan'].map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      <DataTable columns={columns} data={rows} pageSize={10} />
    </Panel>
  </div>;
}

export function BookingDetailPage() {
  const { id } = useParams();
  const [allBookings, setBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const [allUsers, setUsers] = useLocalStorage(storageKeys.users, users);
  const [allPets] = useLocalStorage(storageKeys.pets, initialPets);
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const [, setNotifications] = useLocalStorage(storageKeys.notifications, initialNotifications);
  const [storedLoyaltySettings] = useLocalStorage(storageKeys.loyalty, initialLoyaltySettings);
  const loyaltySettings = normalizeLoyaltySettings(storedLoyaltySettings);
  const booking = getBookingRecords(allBookings, allPets, allUsers, allServices).find((item) => item.id === id);
  if (!booking) return <div className="page-shell"><PageHeading title="Booking tidak ditemukan" /><Link to="/admin/bookings" className="inline-link">Kembali ke booking</Link></div>;
  const price = getBookingPriceSummary(booking);
  const updateStatus = (nextStatus) => {
    setBookings((items) => items.map((item) => item.id === booking.id ? { ...item, status: nextStatus, ...(nextStatus === 'Selesai' ? { pointsAwarded: true } : {}) } : item));
    const statusMessage = nextStatus === 'Terkonfirmasi'
      ? `Booking ${booking.id} telah disetujui admin.`
      : nextStatus === 'Dibatalkan'
        ? `Booking ${booking.id} dibatalkan admin.`
        : `Booking ${booking.id} telah selesai.`;
    setNotifications((items) => [createNotification(booking.customerId, `Status booking ${nextStatus.toLowerCase()}`, statusMessage), ...items]);
    if (nextStatus === 'Selesai' && !booking.pointsAwarded) {
      const transactionAmount = getBookingPriceSummary(booking).totalAmount;
      const earned = Math.floor(transactionAmount / loyaltySettings.amountPerPoint);
      if (earned > 0) setUsers((items) => items.map((person) => {
        if (person.id !== booking.customerId) return person;
        const pointLots = getActivePointLots(person);
        return {
          ...person,
          pointLots: [...pointLots, { points: earned, earnedAt: new Date().toISOString() }],
          points: getActivePoints(person) + earned,
        };
      }));
    }
  };
  return <div className="page-shell">
    <PageHeading eyebrow="DETAIL BOOKING" title={booking.id} description={`Dibuat dari data demonstrasi · ${formatDateTime(booking.date)}`} action={<StatusPill value={booking.status} />} />
    <Link to="/admin/bookings" className="inline-link">Semua booking</Link>
    <div className="detail-grid">
      <Panel title="Informasi layanan"><dl className="detail-list"><div><dt>Layanan</dt><dd>{booking.service?.name}</dd></div><div><dt>Durasi</dt><dd>{booking.service?.duration} menit</dd></div><div><dt>Harga awal</dt><dd>{formatCurrency(price.originalPrice)}</dd></div>{booking.voucherCode && <div><dt>Voucher</dt><dd>{booking.voucherCode}</dd></div>}<div><dt>Potongan</dt><dd>-{formatCurrency(price.discount)}</dd></div><div><dt>Total pembayaran</dt><dd><strong>{formatCurrency(price.totalAmount)}</strong></dd></div><div><dt>Jadwal</dt><dd>{formatDateTime(booking.date)}</dd></div><div><dt>Catatan</dt><dd>{booking.notes || 'Tidak ada catatan khusus.'}</dd></div></dl></Panel>
      <Panel title="Pelanggan & hewan"><div className="detail-person"><Avatar name={booking.customer?.name} /><div><strong>{booking.customer?.name}</strong><span>{booking.customer?.email}</span><span>{booking.customer?.phone}</span></div></div><div className="detail-person"><span className="pet-avatar">{booking.pet?.name?.slice(0, 1)}</span><div><strong>{booking.pet?.name}</strong><span>{booking.pet?.type} · {booking.pet?.breed}</span><span>{booking.pet?.notes || 'Tidak ada catatan khusus'}</span></div></div><Link className="button-secondary" to={`/admin/customers/${booking.customerId}`}>Buka profil pelanggan</Link></Panel>
    </div>
    <Panel title="Perbarui status"><div className="booking-status-actions">{booking.status === 'Menunggu' && <button className="button-primary" type="button" onClick={() => updateStatus('Terkonfirmasi')}>Setujui booking</button>}{booking.status === 'Terkonfirmasi' && <button className="button-primary" type="button" onClick={() => updateStatus('Selesai')}>Tandai selesai</button>}{['Menunggu', 'Terkonfirmasi'].includes(booking.status) && <button className="button-secondary" type="button" onClick={() => updateStatus('Dibatalkan')}>Batalkan booking</button>}</div></Panel>
  </div>;
}

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('Semua pelanggan');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [allUsers] = useLocalStorage(storageKeys.users, users);
  const [allPets] = useLocalStorage(storageKeys.pets, initialPets);
  const [allBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const liveSegments = getCustomerSegments(allUsers, allBookings);
  const customerUsers = allUsers.filter((person) => person.role === 'user' || person.role === 'customer');
  const rows = customerUsers.filter((person) => searchText(person, search)).map((person) => ({
    ...person,
    visits: allBookings.filter((item) => item.customerId === person.id).length,
    petCount: allPets.filter((item) => item.ownerId === person.id).length,
  })).filter((person) => segmentFilter === 'Semua pelanggan'
    || liveSegments.find((segment) => segment.name === segmentFilter)?.customerIds.includes(person.id));
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const columns = [
    { header: 'Pelanggan', render: (row) => <PersonCell name={row.name} detail={row.email} /> },
    { header: 'No. telepon', accessor: 'phone' },
    { header: 'Hewan', render: (row) => `${row.petCount} hewan` },
    { header: 'Kunjungan', render: (row) => `${row.visits} booking` },
    { header: 'Bergabung', render: (row) => formatDate(row.joinedDate) },
    { header: '', render: () => <span className="table-link">Lihat detail</span> },
  ];
  return <div className="page-shell"><PageHeading eyebrow="PELANGGAN" title="Data pelanggan" description="Kelola data dan akses pelanggan." /><Panel title="Semua pelanggan" description={`${rows.length} profil pelanggan.`}><div className="table-toolbar"><label className="page-search"><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Cari nama, email, atau telepon..." /></label><select value={segmentFilter} onChange={(event) => { setSegmentFilter(event.target.value); setPage(1); }} aria-label="Filter segmen pelanggan"><option>Semua pelanggan</option>{liveSegments.map((segment) => <option key={segment.id}>{segment.name}</option>)}</select></div><DataTable columns={columns} data={pageRows} onRowClick={(row) => navigate(`/admin/customers/${row.id}`)} />{rows.length > pageSize && <nav className="table-pagination" aria-label="Halaman daftar pelanggan"><span>Menampilkan {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, rows.length)} dari {rows.length} pelanggan</span><div><button type="button" aria-label="Halaman sebelumnya" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><FiChevronLeft /></button><span>Halaman {currentPage} dari {pageCount}</span><button type="button" aria-label="Halaman berikutnya" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}><FiChevronRight /></button></div></nav>}</Panel></div>;
}

export function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allUsers, setUsers] = useLocalStorage(storageKeys.users, users);
  const [allPets] = useLocalStorage(storageKeys.pets, initialPets);
  const [allBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const [allTransactions] = useLocalStorage(storageKeys.transactions, initialTransactions);
  const customer = allUsers.find((item) => item.id === id && (item.role === 'user' || item.role === 'customer'));
  if (!customer) return <div className="page-shell"><PageHeading title="Pelanggan tidak ditemukan" /><Link to="/admin/customers" className="inline-link">Kembali ke pelanggan</Link></div>;
  const pets = allPets.filter((item) => item.ownerId === customer.id);
  const history = getBookingRecords(allBookings, allPets, allUsers, allServices).filter((item) => item.customerId === customer.id);
  const recentHistory = history.filter((item) => isWithinCustomerHistoryWindow(item.date));
  const deleteCustomer = () => {
    if (!window.confirm(`Hapus akun pelanggan ${customer.name}? Data booking dan hewan terkait akan tetap tersimpan.`)) return;
    setUsers((items) => items.filter((item) => item.id !== customer.id));
    navigate('/admin/customers', { replace: true });
  };
  return <div className="page-shell"><PageHeading eyebrow="PROFIL PELANGGAN" title={customer.name} description={`${customer.id} · Pelanggan sejak ${formatDate(customer.joinedDate)}`} action={<div className="customer-detail-actions"><StatusPill value={history.length >= 4 ? 'Loyal' : 'Aktif'} /><button type="button" className="button-danger" onClick={deleteCustomer}>Hapus pelanggan</button></div>} /><div className="summary-row"><StatTile icon={<FiCalendar />} label={`Booking (${customerHistoryDays} hari)`} value={recentHistory.length} /><StatTile icon={<FiShoppingBag />} label="Transaksi tercatat" value={allTransactions.filter((item) => item.customerId === customer.id).length} tone="sand" /><StatTile icon={<FiHeart />} label="Poin Pawtner" value={getActivePoints(customer)} tone="sage" /></div><div className="detail-grid"><Panel title="Informasi kontak"><dl className="detail-list"><div><dt>Email</dt><dd>{customer.email}</dd></div><div><dt>Telepon</dt><dd>{customer.phone || '—'}</dd></div><div><dt>Status segmen</dt><dd>{history.length >= 4 ? 'Pelanggan loyal' : 'Pelanggan aktif'}</dd></div></dl></Panel><Panel title="Hewan peliharaan"><div className="simple-list">{pets.length ? pets.map((pet) => <Link className="simple-list-row" key={pet.id} to="/admin/pets"><span className="pet-avatar">{pet.name.slice(0, 1)}</span><span><strong>{pet.name}</strong><small>{pet.type} · {pet.breed}</small></span><span className="row-end">Lihat detail</span></Link>) : <p className="muted-copy">Belum ada profil hewan.</p>}</div></Panel></div><Panel title="Riwayat pelanggan" description={`Menampilkan booking ${customerHistoryDays} hari terakhir. Data yang lebih lama tetap tersimpan.`}><div className="customer-booking-list">{recentHistory.length ? recentHistory.map((booking) => { const price = getBookingPriceSummary(booking); return <article className="customer-booking-card" key={booking.id}><div className="customer-booking-main"><div><small>{booking.id} · {formatDateTime(booking.date)} · {booking.pet?.name}</small><h2>{booking.service?.name}</h2><p>{booking.voucherCode ? `Voucher ${booking.voucherCode} · potongan ${formatCurrency(price.discount)}` : 'Tanpa voucher'}</p></div><span><strong>{formatCurrency(price.totalAmount)}</strong>{price.discount > 0 && <small className="table-subline">Harga awal {formatCurrency(price.originalPrice)}</small>}</span></div><StatusPill value={booking.status} /></article>; }) : <p className="muted-copy">Tidak ada booking dalam {customerHistoryDays} hari terakhir.</p>}</div></Panel></div>;
}

export function PetsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua jenis');
  const [allPets] = useLocalStorage(storageKeys.pets, initialPets);
  const [allUsers] = useLocalStorage(storageKeys.users, users);
  const petTypes = [...new Set(allPets.map((pet) => pet.type).filter(Boolean))].sort();
  const rows = allPets.map((pet) => ({
    ...pet,
    owner: allUsers.find((person) => person.id === pet.ownerId),
  })).filter((pet) => (typeFilter === 'Semua jenis' || pet.type === typeFilter)
    && searchText({ name: pet.name, breed: pet.breed, owner: pet.owner?.name, type: pet.type }, search));
  const columns = [
    { header: 'Hewan', render: (row) => <div className="table-person"><span className="pet-avatar">{row.name.slice(0, 1)}</span><span><strong>{row.name}</strong><small>{row.type} · {row.breed}</small></span></div> },
    { header: 'Pemilik', render: (row) => row.owner?.name || '—' },
    { header: 'Jenis kelamin', accessor: 'gender' },
    { header: 'Tanggal lahir', render: (row) => formatDate(row.birthDate) },
    { header: 'Catatan', accessor: 'notes' },
  ];
  return <div className="page-shell"><PageHeading eyebrow="DATA HEWAN" title="Hewan peliharaan" description="Profil hewan terhubung dengan pemilik dan riwayat booking." /><DemoNotice /><Panel title="Semua hewan"><div className="table-toolbar"><label className="page-search"><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama hewan, ras, atau pemilik..." /></label><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} aria-label="Filter jenis hewan"><option>Semua jenis</option>{petTypes.map((type) => <option key={type}>{type}</option>)}</select></div><DataTable columns={columns} data={rows} pageSize={10} /></Panel></div>;
}

export function ServicesPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [allServices, setServices] = useLocalStorage(storageKeys.services, initialServices);
  const rows = allServices.filter((service) => searchText(service, search));
  const columns = [
    { header: 'Nama layanan', render: (row) => <span><strong>{row.name}</strong><small className="table-subline">{row.id}</small></span> },
    { header: 'Kategori', accessor: 'category' },
    { header: 'Harga', render: (row) => formatCurrency(row.price) },
    { header: 'Durasi', render: (row) => `${row.duration} menit` },
    { header: 'Jenis hewan', render: (row) => row.forType.join(', ') },
    { header: 'Ketersediaan', render: (row) => <StatusPill value={row.available === false ? 'Nonaktif' : 'Aktif'} /> },
  ];
  const addService = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const category = String(form.get('category') || '').trim();
    const price = Number(form.get('price'));
    const duration = Number(form.get('duration'));
    const forType = form.getAll('forType');
    if (!name || !category || !Number.isFinite(price) || price <= 0 || !Number.isInteger(duration) || duration <= 0 || !forType.length) {
      setFormError('Lengkapi semua data layanan dengan nilai yang valid.');
      return;
    }
    if (allServices.some((service) => service.name.toLowerCase() === name.toLowerCase())) {
      setFormError('Nama layanan sudah digunakan.');
      return;
    }
    setServices((items) => [...items, {
      id: getNextId(items, 'SRV', 3),
      name,
      category,
      price,
      duration,
      forType,
      description: String(form.get('description') || '').trim(),
      available: true,
    }]);
    event.currentTarget.reset();
    setFormError('');
    setShowForm(false);
  };
  return <div className="page-shell"><PageHeading eyebrow="KATALOG" title="Layanan" description="Kelola layanan yang langsung tersedia di katalog pelanggan." action={<button className="button-primary" type="button" onClick={() => { setShowForm((open) => !open); setFormError(''); }}><FiPlus /> Tambah layanan</button>} />{showForm && <Panel title="Tambah layanan"><form className="settings-form" onSubmit={addService}><label>Nama layanan<input name="name" required /></label><label>Kategori<input name="category" required placeholder="Contoh: Grooming" /></label><label>Harga (Rp)<input name="price" type="number" min="1" required /></label><label>Durasi (menit)<input name="duration" type="number" min="1" required /></label><fieldset className="service-type-options"><legend>Jenis hewan yang dilayani</legend>{['Anjing', 'Kucing', 'Kelinci'].map((type) => <label key={type}><input type="checkbox" name="forType" value={type} />{type}</label>)}</fieldset><label>Deskripsi<textarea name="description" rows="3" /></label>{formError && <p className="form-error">{formError}</p>}<button className="button-primary" type="submit">Simpan layanan</button></form></Panel>}<Panel title="Daftar layanan"><SearchAndFilter search={search} setSearch={setSearch} placeholder="Cari nama atau kategori layanan..." /><DataTable columns={columns} data={rows} pageSize={10} /></Panel></div>;
}

export function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua status');
  const [methodFilter, setMethodFilter] = useState('Semua metode');
  const [allTransactions] = useLocalStorage(storageKeys.transactions, initialTransactions);
  const [allUsers] = useLocalStorage(storageKeys.users, users);
  const [allBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const rows = allTransactions.map((transaction) => {
    const booking = allBookings.find((item) => item.id === transaction.bookingId);
    return {
      ...transaction,
      customer: allUsers.find((item) => item.id === transaction.customerId),
      booking,
      service: allServices.find((item) => item.id === booking?.serviceId),
    };
  }).filter((row) => (
    (statusFilter === 'Semua status' || row.status === statusFilter)
    && (methodFilter === 'Semua metode' || row.method === methodFilter)
    && searchText({
      id: row.id,
      customer: row.customer?.name,
      email: row.customer?.email,
      method: row.method,
      status: row.status,
      booking: row.bookingId,
      service: row.service?.name,
    }, search)
  ));
  const methods = [...new Set(allTransactions.map((transaction) => transaction.method).filter(Boolean))].sort();
  const statuses = [...new Set(allTransactions.map((transaction) => transaction.status).filter(Boolean))].sort();
  const columns = [
    { header: 'No. transaksi', accessor: 'id' },
    { header: 'Pelanggan', render: (row) => row.customer?.name || '—' },
    { header: 'Booking', render: (row) => <span><strong>{row.bookingId}</strong><small className="table-subline">{row.service?.name || 'Layanan tidak ditemukan'}</small></span> },
    { header: 'Tanggal', render: (row) => formatDate(row.date) },
    { header: 'Metode', accessor: 'method' },
    { header: 'Total', render: (row) => formatCurrency(row.totalAmount) },
    { header: 'Status', render: (row) => <StatusPill value={row.status} /> },
  ];
  return <div className="page-shell"><PageHeading eyebrow="KEUANGAN" title="Transaksi" description="Pencatatan demo transaksi yang terhubung ke pelanggan, booking, dan layanan." /><DemoNotice /><div className="summary-row"><StatTile icon={<FiShoppingBag />} label="Transaksi ditampilkan" value={rows.length} /><StatTile icon={<FiTrendingUp />} label="Nilai tersaring" value={formatCurrency(rows.reduce((total, row) => total + Number(row.totalAmount || 0), 0))} tone="sage" /><StatTile icon={<FiClock />} label="Belum dibayar" value={rows.filter((row) => row.status === 'Belum Dibayar').length} tone="sand" /></div><Panel title="Riwayat transaksi"><div className="table-toolbar"><label className="page-search"><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari transaksi, pelanggan, booking, atau layanan..." /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter status transaksi"><option>Semua status</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select><select value={methodFilter} onChange={(event) => setMethodFilter(event.target.value)} aria-label="Filter metode pembayaran"><option>Semua metode</option>{methods.map((method) => <option key={method}>{method}</option>)}</select></div><DataTable columns={columns} data={rows} pageSize={10} /></Panel><p className="muted-copy">Pencatatan ini tidak terhubung ke payment gateway atau bank.</p></div>;
}

export function ReportsPage() {
  const [allBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const [allUsers] = useLocalStorage(storageKeys.users, users);
  const [allPets] = useLocalStorage(storageKeys.pets, initialPets);
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const [allTransactions] = useLocalStorage(storageKeys.transactions, initialTransactions);
  const bookingRecords = getBookingRecords(allBookings, allPets, allUsers, allServices);
  const monthlyPerformance = getMonthlyPerformance(allBookings, allTransactions);
  const categories = getServicePerformance(allBookings, allServices);
  const paidRevenue = allTransactions.filter((transaction) => transaction.status === 'Lunas')
    .reduce((sum, transaction) => sum + Number(transaction.totalAmount || 0), 0);
  const customerCount = allUsers.filter((customer) => customer.role === 'user' || customer.role === 'customer').length;
  return <div className="page-shell"><PageHeading eyebrow="ANALITIK" title="Laporan" description="Ringkasan performa dari booking, pelanggan, layanan, dan transaksi tersimpan." action={<button className="button-secondary" type="button" onClick={() => downloadReportCsv(bookingRecords)}><FiDownload /> Ekspor CSV</button>} /><DemoNotice /><div className="summary-row"><StatTile icon={<FiCalendar />} label="Booking tersimpan" value={bookingRecords.length} /><StatTile icon={<FiTrendingUp />} label="Nilai transaksi lunas" value={formatCurrency(paidRevenue)} tone="sage" /><StatTile icon={<FiUsers />} label="Pelanggan tersimpan" value={customerCount} tone="sand" /></div><div className="chart-grid"><Panel title="Tren booking bulanan" description="Jumlah booking per bulan dari data tersimpan."><div className="admin-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthlyPerformance}><CartesianGrid vertical={false} stroke="#eee5d9" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="bookings" fill="#9B7A48" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel><Panel title="Layanan populer" description="Jumlah booking dihitung dari layanan yang tersimpan."><div className="admin-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={categories} layout="vertical" margin={{ left: 8 }}><CartesianGrid horizontal={false} stroke="#eee5d9" /><XAxis type="number" axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" width={120} axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="bookings" fill="#321B16" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></div></Panel></div></div>;
}

export function StaffPage() {
  const [staffRows, setStaffRows] = useLocalStorage(storageKeys.staff, initialStaff);
  const staffRowsWithPhone = staffRows.map((row) => ({
    ...row,
    phone: row.phone || initialStaff.find((person) => person.id === row.id)?.phone,
  }));
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const columns = [
    { header: 'Staf', render: (row) => <PersonCell name={row.name} detail={row.phone || 'Nomor HP belum diisi'} /> },
    { header: 'Jabatan', accessor: 'role' },
    { header: 'Layanan', accessor: 'services' },
    { header: 'Status akun', render: (row) => <StatusPill value={row.status} /> },
    { header: 'Aksi', render: (row) => <div className="staff-row-actions"><button type="button" className="table-action" onClick={() => setStaffRows((items) => items.map((item) => item.id === row.id ? { ...item, status: item.status === 'Aktif' ? 'Nonaktif' : 'Aktif' } : item))}>{row.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}</button><button type="button" className="table-action" onClick={() => { if (window.confirm(`Hapus akun staf ${row.name}?`)) setStaffRows((items) => items.filter((item) => item.id !== row.id)); }}>Hapus</button></div> },
  ];
  const addStaff = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const phone = String(form.get('phone') || '').trim();
    const normalizedPhone = phone.replace(/\D/g, '').replace(/^62/, '0');
    const password = String(form.get('password') || '');
    if (password.length < 8) {
      setFormError('Password harus terdiri dari minimal 8 karakter.');
      return;
    }
    if (normalizedPhone.length < 10) {
      setFormError('Masukkan nomor HP yang valid.');
      return;
    }
    if (staffRowsWithPhone.some((person) => person.phone?.replace(/\D/g, '').replace(/^62/, '0') === normalizedPhone)) {
      setFormError('Nomor HP sudah terdaftar pada akun staf.');
      return;
    }
    const newStaff = {
      id: getNextId(staffRowsWithPhone, 'STF', 3),
      name: String(form.get('name') || '').trim(),
      phone,
      role: String(form.get('role') || '').trim(),
      services: String(form.get('services') || '').trim(),
      status: 'Aktif',
    };
    setStaffRows((items) => [...items, newStaff]);
    event.currentTarget.reset();
    setFormError('');
    setShowForm(false);
  };
  return <div className="page-shell"><PageHeading eyebrow="TIM BISNIS" title="Staf & akses" description="Tambah, nonaktifkan, dan hapus akun staf demo." action={<button className="button-primary" type="button" onClick={() => { setShowForm((open) => !open); setFormError(''); }}><FiPlus /> Tambah staf</button>} />{showForm && <Panel title="Buat akun staf"><form className="settings-form" onSubmit={addStaff}><label>Nama lengkap<input name="name" required /></label><label>Nomor HP<input name="phone" type="tel" autoComplete="tel" required /></label><label>Password<input name="password" type="password" minLength="8" required autoComplete="new-password" /></label><label>Jabatan<input name="role" required placeholder="Contoh: Groomer" /></label><label>Layanan<input name="services" required placeholder="Contoh: Grooming" /></label>{formError && <p className="form-error">{formError}</p>}<button className="button-primary" type="submit">Simpan akun staf</button><p className="form-note">Password hanya divalidasi saat pembuatan dan tidak disimpan di browser demo.</p></form></Panel>}<Panel title="Daftar staf"><DataTable columns={columns} data={staffRowsWithPhone} /></Panel></div>;
}

export function SettingsPage() {
  const [saved, setSaved] = useState(false);
  return <div className="page-shell"><PageHeading eyebrow="KONFIGURASI" title="Pengaturan bisnis" description="Informasi profil, jam operasional, dan preferensi." /><DemoNotice /><div className="detail-grid"><Panel title="Profil bisnis"><form className="settings-form" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}><label>Nama bisnis<input defaultValue="Pawtner Pet Care" /></label><label>Email bisnis<input type="email" defaultValue="halo@pawtner.example" /></label><label>Nomor telepon<input defaultValue="0812-0000-0000" /></label><label>Alamat<input defaultValue="Jl. Sahabat Hewan No. 10, Jakarta" /></label><label>Jam operasional<input defaultValue="Senin–Sabtu, 09.00–18.00 WIB" /></label><Button type="submit"><FiSettings /> Simpan perubahan demo</Button>{saved && <p className="form-success">Perubahan pratinjau tersimpan pada tampilan ini saja.</p>}</form></Panel><Panel title="Aturan layanan"><div className="simple-list"><div className="simple-list-row"><span className="service-icon"><FiCalendar /></span><span><strong>Pembatalan booking</strong><small>Contoh kebijakan: konfirmasi perubahan jadwal melalui admin.</small></span></div><div className="simple-list-row"><span className="service-icon"><FiMail /></span><span><strong>Notifikasi</strong><small>Notifikasi email dan WhatsApp belum terintegrasi.</small></span></div><div className="simple-list-row"><span className="service-icon"><FiMapPin /></span><span><strong>Lokasi layanan</strong><small>Satu lokasi bisnis untuk MVP.</small></span></div></div></Panel></div></div>;
}

export function CRMOverviewPage() {
  const [allUsers] = useLocalStorage(storageKeys.users, users);
  const [allBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const liveSegments = getCustomerSegments(allUsers, allBookings);
  const activeCustomers = liveSegments.find((segment) => segment.id === 'SEG-002')?.customerIds.length || 0;
  return <div className="page-shell"><PageHeading eyebrow="CUSTOMER RELATIONSHIP MANAGEMENT" title="CRM & retensi" description="Ubah riwayat pelanggan menjadi pengingat dan tindak lanjut yang berguna." /><div className="summary-row"><StatTile icon={<FiUsers />} label="Pelanggan aktif" value={activeCustomers} helper="Aktif dalam 60 hari terakhir" /><StatTile icon={<FiTrendingUp />} label="Pelanggan kembali" value={dashboardStats.returningCustomersRate} tone="sage" /><StatTile icon={<FiClock />} label="Follow-up terbuka" value={dashboardStats.openFollowUps} tone="sand" /><StatTile icon={<FiCalendar />} label="Pengingat mendatang" value={dashboardStats.upcomingReminders} /></div><div className="detail-grid"><Panel title="Perlu ditindaklanjuti"><div className="simple-list">{reminders.map((reminder) => { const person = allUsers.find((customer) => customer.id === reminder.customerId); return <div className="simple-list-row" key={reminder.id}><Avatar name={person?.name} /><span><strong>{person?.name || 'Pelanggan'}</strong><small>{reminder.reason} · {formatDate(reminder.date)}</small></span><StatusPill value={reminder.status} /></div>; })}</div><Link className="inline-link" to="/admin/crm/follow-ups">Buka follow-up</Link></Panel><Panel title="Segmen pelanggan" description="Anggota segmen diperbarui dari data akun dan booking tersimpan."><div className="simple-list">{liveSegments.map((segment) => <Link className="simple-list-row" key={segment.id} to="/admin/crm/segments"><span className="service-icon"><FiUsers /></span><span><strong>{segment.name}</strong><small>{segment.description}</small></span><span className="row-end">{segment.customerIds.length} profil</span></Link>)}</div></Panel></div></div>;
}

export function SegmentsPage() {
  const [selected, setSelected] = useState('SEG-001');
  const [allUsers] = useLocalStorage(storageKeys.users, users);
  const [allBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const liveSegments = getCustomerSegments(allUsers, allBookings);
  const segment = liveSegments.find((item) => item.id === selected) || liveSegments[0];
  const people = allUsers.filter((customer) => segment?.customerIds.includes(customer.id));
  return <div className="page-shell"><PageHeading eyebrow="CRM & RETENSI" title="Segmen pelanggan" description="Kelompok pelanggan dihitung ulang dari akun dan booking tersimpan." /><div className="segment-layout"><Panel title="Daftar segmen"><div className="simple-list">{liveSegments.map((item) => <button type="button" aria-pressed={segment?.id === item.id} className={`segment-choice ${segment?.id === item.id ? 'selected' : ''}`} key={item.id} onClick={() => setSelected(item.id)}><span><strong>{item.name}</strong><small>{item.description}</small></span><span className="row-end">{item.customerIds.length}</span></button>)}</div></Panel><Panel title={segment?.name || 'Pilih segmen'} description={segment?.description}><div className="simple-list">{people.map((person) => <Link className="simple-list-row" key={person.id} to={`/admin/customers/${person.id}`}><Avatar name={person.name} /><span><strong>{person.name}</strong><small>{person.email}</small></span><span className="row-end">Profil</span></Link>)}</div>{people.length === 0 && <p className="muted-copy">Belum ada profil pada segmen ini.</p>}</Panel></div></div>;
}

export function FollowUpsPage() {
  const [done, setDone] = useState([]);
  const rows = reminders.map((reminder) => ({ ...reminder, person: customers.find((customer) => customer.id === reminder.customerId) }));
  return <div className="page-shell"><PageHeading eyebrow="CRM & RETENSI" title="Pengingat & follow-up" description="Catat tindakan lanjutan pelanggan secara manual." /><DemoNotice>Belum ada integrasi pesan otomatis. Status hanya berubah pada pratinjau halaman.</DemoNotice><Panel title="Daftar tindak lanjut"><DataTable columns={[{ header: 'Pelanggan', render: (row) => <PersonCell name={row.person?.name} detail={row.person?.phone} /> }, { header: 'Alasan', accessor: 'reason' }, { header: 'Tanggal', render: (row) => formatDate(row.date) }, { header: 'Status', render: (row) => <StatusPill value={done.includes(row.id) ? 'Selesai' : row.status} /> }, { header: 'Aksi', render: (row) => <button type="button" className="table-action" onClick={() => setDone((items) => items.includes(row.id) ? items.filter((id) => id !== row.id) : [...items, row.id])}>{done.includes(row.id) ? 'Batalkan selesai' : 'Tandai selesai'}</button> }]} data={rows} pageSize={10} /></Panel><Panel title="Catatan tindak lanjut"><p className="muted-copy">Gunakan halaman ini untuk mencatat alasan, tanggal, dan status. Pengiriman email atau WhatsApp belum diaktifkan pada versi demo.</p></Panel></div>;
}

export function AdminNotificationsPage() {
  const [notifications, setNotifications] = useLocalStorage(storageKeys.adminNotifications, []);
  const unreadCount = notifications.filter((item) => !item.read).length;
  const markAllRead = () => setNotifications((items) => items.map((item) => ({ ...item, read: true })));
  const markRead = (id) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item));

  return (
    <div className="page-shell">
      <PageHeading eyebrow="PEMBARUAN BISNIS" title="Notifikasi" description={`${unreadCount} notifikasi belum dibaca.`} action={unreadCount > 0 && <button className="button-secondary" type="button" onClick={markAllRead}>Tandai semua dibaca</button>} />
      <Panel title="Aktivitas terbaru">
        {notifications.length ? <div className="admin-notification-list">{notifications.map((item) => <Link className={`admin-notification-item ${item.read ? '' : 'unread'}`} key={item.id} to={item.path || '/admin/notifications'} onClick={() => markRead(item.id)}><span className="admin-notification-dot" /><span><strong>{item.title}</strong><small>{item.message}</small><time>{formatDateTime(item.date)}</time></span></Link>)}</div> : <p className="muted-copy">Belum ada notifikasi. Booking baru dari pelanggan dan pendaftaran akun akan muncul di sini.</p>}
      </Panel>
    </div>
  );
}

export function AdminProfilePage() {
  const { user } = useAuth();
  return (
    <div className="page-shell">
      <PageHeading eyebrow="AKUN BISNIS" title="Profil admin" description="Informasi akun yang sedang digunakan untuk mengelola Pawtner." />
      <Panel title="Informasi akun">
        <dl className="detail-list">
          <div><dt>Nama</dt><dd>{user?.name || 'Admin'}</dd></div>
          <div><dt>Email</dt><dd>{user?.email || '—'}</dd></div>
          <div><dt>Peran</dt><dd>Admin</dd></div>
        </dl>
      </Panel>
    </div>
  );
}

export function LoyaltyPage() {
  const columns = [{ header: 'Kode voucher', render: (row) => <strong>{row.code}</strong> }, { header: 'Manfaat', accessor: 'benefit' }, { header: 'Berlaku hingga', accessor: 'validity' }, { header: 'Penukaran demo', accessor: 'redemptions' }, { header: 'Status', render: (row) => <StatusPill value={row.status} /> }];
  const [storedSettings, setSettings] = useLocalStorage(storageKeys.loyalty, initialLoyaltySettings);
  const settings = normalizeLoyaltySettings(storedSettings);
  const [allUsers] = useLocalStorage(storageKeys.users, users);
  const [storedVouchers] = useLocalStorage(storageKeys.vouchers, []);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const customerUsers = allUsers.filter((item) => item.role === 'user' || item.role === 'customer');
  const voucherRows = [
    ...vouchers.map((item) => ({ ...item, validity: item.validity, redemptions: item.redemptions })),
    ...storedVouchers.map((item) => ({
      code: item.code,
      benefit: `Diskon ${formatCurrency(item.discount)}`,
      validity: formatDate(item.expiresAt),
      redemptions: item.used ? '1 kali' : '0 kali',
      status: item.used ? 'Digunakan' : new Date(item.expiresAt) <= new Date() ? 'Kedaluwarsa' : 'Aktif',
    })),
  ];
  const saveSettings = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amountPerPoint = Number(form.get('amountPerPoint'));
    const rewards = settings.rewards.map((reward, index) => ({
      points: Number(form.get(`points-${index}`)),
      discount: Number(form.get(`discount-${index}`)),
    }));
    if (!Number.isFinite(amountPerPoint) || amountPerPoint <= 0) {
      setSaveError('Nilai transaksi per poin harus lebih besar dari Rp0.');
      return;
    }
    if (!rewards.length || rewards.some((reward) => !Number.isInteger(reward.points) || reward.points < 5 || !Number.isFinite(reward.discount) || reward.discount <= 0)) {
      setSaveError('Pastikan setiap reward memiliki minimal 5 poin dan diskon yang valid.');
      return;
    }
    setSettings({
      amountPerPoint,
      voucherValidityMonths: settings.voucherValidityMonths,
      rewards: rewards.sort((left, right) => left.points - right.points),
    });
    setSaveError('');
    setSaved(true);
  };
  return <div className="page-shell"><PageHeading eyebrow="CRM & RETENSI" title="Loyalty & voucher" description="Atur perolehan poin dan reward voucher yang dapat ditukarkan pelanggan." /><div className="summary-row"><StatTile icon={<FiHeart />} label="Poin per transaksi" value={`1 poin / ${formatCurrency(settings.amountPerPoint)}`} helper={`Poin tidak kedaluwarsa · voucher ${settings.voucherValidityMonths} bulan`} tone="sand" /><StatTile icon={<FiUsers />} label="Pelanggan berpoin" value={customerUsers.filter((person) => getActivePoints(person) > 0).length} /><StatTile icon={<FiShoppingBag />} label="Voucher aktif" value={voucherRows.filter((item) => item.status === 'Aktif').length} tone="sage" /></div><Panel title="Aturan poin & reward" description={`Setiap transaksi selesai senilai kelipatan nilai per poin mendapat poin. Poin tidak kedaluwarsa; voucher berlaku ${settings.voucherValidityMonths} bulan setelah diterbitkan, hanya sekali pakai, dan tidak dapat digabung dengan promo tertentu. Transaksi yang dibatalkan tidak mendapat poin.`}><form className="settings-form loyalty-settings-form" onSubmit={saveSettings}><label>Nilai transaksi per poin (Rp)<input name="amountPerPoint" type="number" min="1" defaultValue={settings.amountPerPoint} required /></label><p className="form-note">Nilai awal 1 poin per Rp100.000. Perubahan berlaku untuk transaksi yang akan datang.</p><div className="loyalty-reward-fields"><strong>Reward penukaran (minimal 5 poin)</strong>{settings.rewards.map((reward, index) => <div className="loyalty-reward-row" key={`reward-${index}`}><label>Poin<input name={`points-${index}`} type="number" min="5" defaultValue={reward.points} required /></label><label>Diskon (Rp)<input name={`discount-${index}`} type="number" min="1" defaultValue={reward.discount} required /></label></div>)}</div>{saveError && <p className="form-error">{saveError}</p>}<button type="submit" className="button-primary">Simpan aturan</button>{saved && <p className="form-success">Aturan loyalty berhasil disimpan.</p>}</form></Panel><Panel title="Voucher pelanggan"><DataTable columns={columns} data={voucherRows} pageSize={10} /></Panel><Panel title="Saldo poin pelanggan"><DataTable columns={[{ header: 'Pelanggan', render: (row) => <PersonCell name={row.name} detail={row.id} /> }, { header: 'Saldo poin', render: (row) => `${getActivePoints(row)} poin` }, { header: 'Status', render: (row) => <StatusPill value={getActivePoints(row) >= 5 ? 'Aktif' : 'Belum ada poin'} /> }]} data={customerUsers} pageSize={10} /></Panel></div>;
}

export function CRMActivityPage() {
  const [page, setPage] = useState(1);
  const [allBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const [allUsers] = useLocalStorage(storageKeys.users, users);
  const [allPets] = useLocalStorage(storageKeys.pets, initialPets);
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const recentActivities = [
    ...getBookingRecords(allBookings, allPets, allUsers, allServices).map((booking) => ({ title: `Booking ${booking.id} ${booking.status.toLowerCase()}`, detail: `${booking.customer?.name} · ${booking.service?.name}`, time: formatDateTime(booking.date) })),
    ...allUsers.filter((person) => person.role === 'user').map((person) => ({ title: 'Profil pelanggan tersedia', detail: `${person.name} · ${person.email}`, time: `Bergabung ${formatDate(person.joinedDate)}` })),
  ];
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(recentActivities.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleActivities = recentActivities.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <div className="page-shell"><PageHeading eyebrow="CRM & RETENSI" title="Aktivitas CRM" description="Lihat pembaruan booking dan profil pelanggan." /><Panel title="Aktivitas terbaru"><div className="activity-list">{visibleActivities.map((activity, index) => <div className="activity-row" key={`${activity.title}-${(currentPage - 1) * pageSize + index}`}><span className="activity-dot"><FiActivity /></span><div><strong>{activity.title}</strong><p>{activity.detail}</p></div><time>{activity.time}</time></div>)}</div>{recentActivities.length > pageSize && <nav className="table-pagination" aria-label="Halaman aktivitas CRM"><span>Menampilkan {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, recentActivities.length)} dari {recentActivities.length} aktivitas</span><div><button type="button" aria-label="Aktivitas sebelumnya" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><FiChevronLeft /></button><span>Halaman {currentPage} dari {pageCount}</span><button type="button" aria-label="Aktivitas berikutnya" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}><FiChevronRight /></button></div></nav>}</Panel></div>;
}
