import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FiActivity, FiArrowLeft, FiCalendar, FiCheckCircle, FiClock, FiDownload,
  FiFilter, FiHeart, FiMail, FiMapPin, FiPlus, FiSearch,
  FiSettings, FiShield, FiShoppingBag, FiTrendingUp, FiUsers
} from 'react-icons/fi';
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from 'recharts';
import { bookingRecords, customers, monthlyPerformance, petRecords, servicePerformance, staff, transactionRecords, vouchers } from '../../data/viewModels';
import { reminders } from '../../data/reminders';
import { services } from '../../data/services';
import { segments } from '../../data/segments';
import { users } from '../../data/users';
import { dashboardStats } from '../../data/dashboardStats';
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
      <button className="button-secondary" type="button"><FiFilter /> Filter</button>
    </div>
  );
}

function PersonCell({ name, detail }) {
  return <div className="table-person"><Avatar name={name} /><span><strong>{name || 'Pelanggan'}</strong><small>{detail}</small></span></div>;
}

function downloadReportCsv() {
  const rows = [
    ['ID Booking', 'Pelanggan', 'Hewan', 'Layanan', 'Jadwal', 'Status'],
    ...bookingRecords.map((booking) => [
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
  const [showAddNotice, setShowAddNotice] = useState(false);
  const rows = bookingRecords.filter((row) => {
    const matchesSearch = searchText({ id: row.id, customer: row.customer?.name, pet: row.pet?.name, service: row.service?.name }, search);
    const matchesStatus = status === 'Semua status' || row.status === status;
    const date = row.date.slice(0, 10);
    const matchesDate = view === 'Hari ini'
      ? date === '2026-10-28'
      : view === 'Minggu ini'
        ? date >= '2026-10-26' && date <= '2026-11-01'
        : view === 'Bulan ini'
          ? date.startsWith('2026-10')
          : true;
    return matchesSearch && matchesStatus && matchesDate;
  });
  const columns = [
    { header: 'ID Booking', accessor: 'id', render: (row) => <Link className="table-link" to={`/admin/bookings/${row.id}`}>{row.id}</Link> },
    { header: 'Pelanggan', render: (row) => <PersonCell name={row.customer?.name} detail={row.customer?.phone} /> },
    { header: 'Hewan', render: (row) => <span><strong>{row.pet?.name}</strong><small className="table-subline">{row.pet?.type} · {row.pet?.breed}</small></span> },
    { header: 'Layanan', render: (row) => row.service?.name },
    { header: 'Jadwal', render: (row) => formatDateTime(row.date) },
    { header: 'Status', render: (row) => <StatusPill value={row.status} /> },
  ];
  return <div className="page-shell">
    <PageHeading eyebrow="OPERASIONAL" title="Booking & Kalender" description="Pantau jadwal layanan dan status kunjungan pelanggan." action={<button className="button-primary" type="button" onClick={() => setShowAddNotice((visible) => !visible)}><FiPlus /> Tambah booking</button>} />
    <DemoNotice />
    {showAddNotice && <p className="form-note">Formulir booking manual belum tersimpan pada demo. Gunakan halaman pelanggan untuk melihat alur permintaan booking.</p>}
    <div className="summary-row"><StatTile icon={<FiCalendar />} label="Booking ditampilkan" value={rows.length} helper="Data demo" /><StatTile icon={<FiCheckCircle />} label="Terkonfirmasi" value={bookingRecords.filter((item) => item.status === 'Terkonfirmasi').length} tone="sage" /><StatTile icon={<FiClock />} label="Menunggu" value={bookingRecords.filter((item) => item.status === 'Menunggu').length} tone="sand" /></div>
    <Panel title="Jadwal booking" description="Gunakan periode untuk memeriksa agenda dan status kunjungan.">
      <div className="filter-tabs admin-view-tabs">{['Semua', 'Hari ini', 'Minggu ini', 'Bulan ini'].map((item) => <button type="button" className={view === item ? 'selected' : ''} key={item} onClick={() => setView(item)}>{item}</button>)}</div>
      <div className="table-toolbar">
        <label className="page-search"><FiSearch /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama, hewan, atau ID booking..." /></label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter status"><option>Semua status</option>{['Menunggu', 'Terkonfirmasi', 'Selesai'].map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      <DataTable columns={columns} data={rows} />
    </Panel>
  </div>;
}

export function BookingDetailPage() {
  const { id } = useParams();
  const booking = bookingRecords.find((item) => item.id === id);
  if (!booking) return <div className="page-shell"><PageHeading title="Booking tidak ditemukan" /><Link to="/admin/bookings" className="inline-link"><FiArrowLeft /> Kembali ke booking</Link></div>;
  return <div className="page-shell">
    <PageHeading eyebrow="DETAIL BOOKING" title={booking.id} description={`Dibuat dari data demonstrasi · ${formatDateTime(booking.date)}`} action={<StatusPill value={booking.status} />} />
    <Link to="/admin/bookings" className="inline-link"><FiArrowLeft /> Semua booking</Link>
    <div className="detail-grid">
      <Panel title="Informasi layanan"><dl className="detail-list"><div><dt>Layanan</dt><dd>{booking.service?.name}</dd></div><div><dt>Durasi</dt><dd>{booking.service?.duration} menit</dd></div><div><dt>Harga</dt><dd>{formatCurrency(booking.service?.price)}</dd></div><div><dt>Jadwal</dt><dd>{formatDateTime(booking.date)}</dd></div><div><dt>Catatan</dt><dd>Mohon perhatikan kebutuhan khusus hewan sebelum layanan dimulai.</dd></div></dl></Panel>
      <Panel title="Pelanggan & hewan"><div className="detail-person"><Avatar name={booking.customer?.name} /><div><strong>{booking.customer?.name}</strong><span>{booking.customer?.email}</span><span>{booking.customer?.phone}</span></div></div><div className="detail-person"><span className="pet-avatar">{booking.pet?.name?.slice(0, 1)}</span><div><strong>{booking.pet?.name}</strong><span>{booking.pet?.type} · {booking.pet?.breed}</span><span>{booking.pet?.notes || 'Tidak ada catatan khusus'}</span></div></div><Link className="button-secondary" to={`/admin/customers/${booking.customerId}`}>Buka profil pelanggan</Link></Panel>
    </div>
    <DemoNotice />
  </div>;
}

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const rows = customers.filter((person) => searchText(person, search)).map((person) => ({
    ...person,
    visits: bookingRecords.filter((item) => item.customerId === person.id).length,
    petCount: petRecords.filter((item) => item.ownerId === person.id).length,
  }));
  const columns = [
    { header: 'Pelanggan', render: (row) => <PersonCell name={row.name} detail={row.email} /> },
    { header: 'No. telepon', accessor: 'phone' },
    { header: 'Hewan', render: (row) => `${row.petCount} hewan` },
    { header: 'Kunjungan', render: (row) => `${row.visits} booking demo` },
    { header: 'Bergabung', render: (row) => formatDate(row.joinedDate) },
    { header: '', render: () => <span className="table-link">Lihat detail →</span> },
  ];
  return <div className="page-shell"><PageHeading eyebrow="PELANGGAN" title="Data pelanggan" description="Kelola kontak, hewan, dan riwayat kunjungan pelanggan." /><DemoNotice /><Panel title="Semua pelanggan" description={`${rows.length} profil pelanggan pada data demo.`}><SearchAndFilter search={search} setSearch={setSearch} placeholder="Cari nama, email, atau telepon..." /><DataTable columns={columns} data={rows} onRowClick={(row) => navigate(`/admin/customers/${row.id}`)} /></Panel></div>;
}

export function CustomerDetailPage() {
  const { id } = useParams();
  const customer = customers.find((item) => item.id === id);
  if (!customer) return <div className="page-shell"><PageHeading title="Pelanggan tidak ditemukan" /><Link to="/admin/customers" className="inline-link"><FiArrowLeft /> Kembali ke pelanggan</Link></div>;
  const pets = petRecords.filter((item) => item.ownerId === customer.id);
  const history = bookingRecords.filter((item) => item.customerId === customer.id);
  return <div className="page-shell"><PageHeading eyebrow="PROFIL PELANGGAN" title={customer.name} description={`${customer.id} · Pelanggan sejak ${formatDate(customer.joinedDate)}`} action={<StatusPill value={history.length >= 4 ? 'Loyal' : 'Aktif'} />} /><DemoNotice /><div className="summary-row"><StatTile icon={<FiCalendar />} label="Kunjungan demo" value={history.length} /><StatTile icon={<FiShoppingBag />} label="Transaksi tercatat" value={transactionRecords.filter((item) => item.customerId === customer.id).length} tone="sand" /><StatTile icon={<FiHeart />} label="Poin Pawtner" value={customer.points || 0} tone="sage" /></div><div className="detail-grid"><Panel title="Informasi kontak"><dl className="detail-list"><div><dt>Email</dt><dd>{customer.email}</dd></div><div><dt>Telepon</dt><dd>{customer.phone}</dd></div><div><dt>Status segmen</dt><dd>{history.length >= 4 ? 'Pelanggan loyal (contoh)' : 'Pelanggan aktif (contoh)'}</dd></div><div><dt>Catatan</dt><dd>Preferensi dan catatan komunikasi belum tersedia pada data demo.</dd></div></dl></Panel><Panel title="Hewan peliharaan"><div className="simple-list">{pets.length ? pets.map((pet) => <Link className="simple-list-row" key={pet.id} to={`/admin/pets`}><span className="pet-avatar">{pet.name.slice(0, 1)}</span><span><strong>{pet.name}</strong><small>{pet.type} · {pet.breed}</small></span><span className="row-end">Lihat →</span></Link>) : <p className="muted-copy">Belum ada profil hewan.</p>}</div></Panel></div><Panel title="Riwayat booking"><DataTable columns={[{ header: 'ID', accessor: 'id' }, { header: 'Hewan', render: (row) => row.pet?.name }, { header: 'Layanan', render: (row) => row.service?.name }, { header: 'Tanggal', render: (row) => formatDateTime(row.date) }, { header: 'Status', render: (row) => <StatusPill value={row.status} /> }]} data={history} /></Panel></div>;
}

export function PetsPage() {
  const [search, setSearch] = useState('');
  const rows = petRecords.filter((pet) => searchText({ name: pet.name, breed: pet.breed, owner: pet.owner?.name, type: pet.type }, search));
  const columns = [
    { header: 'Hewan', render: (row) => <div className="table-person"><span className="pet-avatar">{row.name.slice(0, 1)}</span><span><strong>{row.name}</strong><small>{row.type} · {row.breed}</small></span></div> },
    { header: 'Pemilik', render: (row) => row.owner?.name || '—' },
    { header: 'Jenis kelamin', accessor: 'gender' },
    { header: 'Tanggal lahir', render: (row) => formatDate(row.birthDate) },
    { header: 'Catatan', accessor: 'notes' },
  ];
  return <div className="page-shell"><PageHeading eyebrow="DATA HEWAN" title="Hewan peliharaan" description="Profil hewan terhubung dengan pemilik dan riwayat booking." /><DemoNotice /><Panel title="Semua hewan"><SearchAndFilter search={search} setSearch={setSearch} placeholder="Cari nama hewan, ras, atau pemilik..." /><DataTable columns={columns} data={rows} /></Panel></div>;
}

export function ServicesPage() {
  const [search, setSearch] = useState('');
  const rows = services.filter((service) => searchText(service, search));
  const columns = [
    { header: 'Nama layanan', render: (row) => <span><strong>{row.name}</strong><small className="table-subline">{row.id}</small></span> },
    { header: 'Kategori', accessor: 'category' },
    { header: 'Harga demo', render: (row) => formatCurrency(row.price) },
    { header: 'Durasi', render: (row) => `${row.duration} menit` },
    { header: 'Jenis hewan', render: (row) => row.forType.join(', ') },
    { header: 'Ketersediaan', render: () => <StatusPill value="Aktif" /> },
  ];
  return <div className="page-shell"><PageHeading eyebrow="KATALOG" title="Layanan" description="Katalog demo untuk layanan yang ditampilkan kepada pelanggan." action={<button className="button-primary" type="button"><FiPlus /> Tambah layanan</button>} /><DemoNotice /><Panel title="Daftar layanan"><SearchAndFilter search={search} setSearch={setSearch} placeholder="Cari nama atau kategori layanan..." /><DataTable columns={columns} data={rows} /></Panel><p className="muted-copy">Tombol tambah merupakan pratinjau UI. Data layanan belum tersimpan ke server.</p></div>;
}

export function TransactionsPage() {
  const [search, setSearch] = useState('');
  const rows = transactionRecords.filter((row) => searchText({ id: row.id, customer: row.customer?.name, method: row.method, status: row.status }, search));
  const columns = [
    { header: 'No. transaksi', accessor: 'id' },
    { header: 'Pelanggan', render: (row) => row.customer?.name || '—' },
    { header: 'Booking', accessor: 'bookingId' },
    { header: 'Tanggal', render: (row) => formatDate(row.date) },
    { header: 'Metode', accessor: 'method' },
    { header: 'Total', render: (row) => formatCurrency(row.totalAmount) },
    { header: 'Status', render: (row) => <StatusPill value={row.status} /> },
  ];
  return <div className="page-shell"><PageHeading eyebrow="KEUANGAN" title="Transaksi" description="Pencatatan demo transaksi yang terhubung dengan booking." /><DemoNotice /><div className="summary-row"><StatTile icon={<FiShoppingBag />} label="Transaksi demo" value={rows.length} /><StatTile icon={<FiTrendingUp />} label="Nilai tercatat" value={formatCurrency(rows.reduce((total, row) => total + row.totalAmount, 0))} tone="sage" /><StatTile icon={<FiClock />} label="Belum dibayar" value={rows.filter((row) => row.status === 'Belum Dibayar').length} tone="sand" /></div><Panel title="Riwayat transaksi"><SearchAndFilter search={search} setSearch={setSearch} placeholder="Cari transaksi atau pelanggan..." /><DataTable columns={columns} data={rows} /></Panel><p className="muted-copy">Pencatatan ini tidak terhubung ke payment gateway atau bank.</p></div>;
}

export function ReportsPage() {
  const categories = useMemo(() => servicePerformance, []);
  return <div className="page-shell"><PageHeading eyebrow="ANALITIK" title="Laporan" description="Ringkasan performa dari data booking dan transaksi demo." action={<button className="button-secondary" type="button" onClick={downloadReportCsv}><FiDownload /> Ekspor CSV</button>} /><DemoNotice /><div className="summary-row"><StatTile icon={<FiCalendar />} label="Booking pada data demo" value={bookingRecords.length} /><StatTile icon={<FiTrendingUp />} label="Nilai transaksi lunas" value={formatCurrency(transactionRecords.filter((item) => item.status === 'Lunas').reduce((sum, item) => sum + item.totalAmount, 0))} tone="sage" /><StatTile icon={<FiUsers />} label="Pelanggan pada data demo" value={customers.length} tone="sand" /></div><div className="chart-grid"><Panel title="Tren booking bulanan" description="Jumlah booking dihitung dari dataset demo."><div className="admin-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthlyPerformance}><CartesianGrid vertical={false} stroke="#eee5d9" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="bookings" fill="#9B7A48" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel><Panel title="Layanan populer" description="Jumlah booking terhubung per layanan."><div className="admin-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={categories} layout="vertical" margin={{ left: 8 }}><CartesianGrid horizontal={false} stroke="#eee5d9" /><XAxis type="number" axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" width={120} axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="bookings" fill="#321B16" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></div></Panel></div></div>;
}

export function StaffPage() {
  const columns = [{ header: 'Staf', render: (row) => <PersonCell name={row.name} detail={row.id} /> }, { header: 'Jabatan', accessor: 'role' }, { header: 'Layanan', accessor: 'services' }, { header: 'Status akun', render: (row) => <StatusPill value={row.status} /> }, { header: 'Akses', render: () => 'Demo · Owner/Admin' }];
  return <div className="page-shell"><PageHeading eyebrow="TIM BISNIS" title="Staf & akses" description="Kelola tim dan peran operasional bisnis." action={<button className="button-primary" type="button"><FiPlus /> Tambah staf</button>} /><DemoNotice /><Panel title="Daftar staf" description="Akun dan hak akses bersifat pratinjau."><DataTable columns={columns} data={staff} /></Panel><div className="summary-row"><StatTile icon={<FiShield />} label="Role tersedia" value="Owner · Admin · Staf" /><StatTile icon={<FiActivity />} label="Dokter hewan" value="1 akun demo" tone="sage" /></div></div>;
}

export function SettingsPage() {
  const [saved, setSaved] = useState(false);
  return <div className="page-shell"><PageHeading eyebrow="KONFIGURASI" title="Pengaturan bisnis" description="Informasi profil, jam operasional, dan preferensi." /><DemoNotice /><div className="detail-grid"><Panel title="Profil bisnis"><form className="settings-form" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}><label>Nama bisnis<input defaultValue="Pawtner Pet Care" /></label><label>Email bisnis<input type="email" defaultValue="halo@pawtner.example" /></label><label>Nomor telepon<input defaultValue="0812-0000-0000" /></label><label>Alamat<input defaultValue="Jl. Sahabat Hewan No. 10, Jakarta" /></label><label>Jam operasional<input defaultValue="Senin–Sabtu, 09.00–18.00 WIB" /></label><Button type="submit"><FiSettings /> Simpan perubahan demo</Button>{saved && <p className="form-success">Perubahan pratinjau tersimpan pada tampilan ini saja.</p>}</form></Panel><Panel title="Aturan layanan"><div className="simple-list"><div className="simple-list-row"><span className="service-icon"><FiCalendar /></span><span><strong>Pembatalan booking</strong><small>Contoh kebijakan: konfirmasi perubahan jadwal melalui admin.</small></span></div><div className="simple-list-row"><span className="service-icon"><FiMail /></span><span><strong>Notifikasi</strong><small>Notifikasi email dan WhatsApp belum terintegrasi.</small></span></div><div className="simple-list-row"><span className="service-icon"><FiMapPin /></span><span><strong>Lokasi layanan</strong><small>Satu lokasi bisnis untuk MVP.</small></span></div></div></Panel></div></div>;
}

export function CRMOverviewPage() {
  const activeCustomers = segments.find((segment) => segment.id === 'SEG-002')?.customerIds.length || 0;
  return <div className="page-shell"><PageHeading eyebrow="CUSTOMER RELATIONSHIP MANAGEMENT" title="CRM & retensi" description="Ubah riwayat pelanggan menjadi pengingat dan tindak lanjut yang berguna." /><DemoNotice /><div className="summary-row"><StatTile icon={<FiUsers />} label="Pelanggan aktif demo" value={activeCustomers} helper="Aktif dalam 60 hari terakhir" /><StatTile icon={<FiTrendingUp />} label="Pelanggan kembali" value={dashboardStats.returningCustomersRate} tone="sage" /><StatTile icon={<FiClock />} label="Follow-up terbuka" value={dashboardStats.openFollowUps} tone="sand" /><StatTile icon={<FiCalendar />} label="Pengingat mendatang" value={dashboardStats.upcomingReminders} /></div><div className="detail-grid"><Panel title="Perlu ditindaklanjuti" description="Daftar dummy untuk membantu menguji alur CRM."><div className="simple-list">{reminders.map((reminder) => { const person = customers.find((customer) => customer.id === reminder.customerId); return <div className="simple-list-row" key={reminder.id}><Avatar name={person?.name} /><span><strong>{person?.name || 'Pelanggan'}</strong><small>{reminder.reason} · {formatDate(reminder.date)}</small></span><StatusPill value={reminder.status} /></div>; })}</div><Link className="inline-link" to="/admin/crm/follow-ups">Buka follow-up <span>→</span></Link></Panel><Panel title="Segmen pelanggan" description="Segmen dihitung dari riwayat booking demo."><div className="simple-list">{segments.map((segment) => <Link className="simple-list-row" key={segment.id} to="/admin/crm/segments"><span className="service-icon"><FiUsers /></span><span><strong>{segment.name}</strong><small>{segment.description}</small></span><span className="row-end">{segment.customerIds.length} profil</span></Link>)}</div></Panel></div></div>;
}

export function SegmentsPage() {
  const [selected, setSelected] = useState(segments[0]?.id);
  const segment = segments.find((item) => item.id === selected) || segments[0];
  const people = customers.filter((customer) => segment?.customerIds.includes(customer.id));
  return <div className="page-shell"><PageHeading eyebrow="CRM & RETENSI" title="Segmen pelanggan" description="Kelompok demo berdasarkan aturan kunjungan yang tercatat." /><DemoNotice>Segmentasi ini memakai data dummy yang tersedia dan bukan hasil analitik produksi.</DemoNotice><div className="segment-layout"><Panel title="Daftar segmen"><div className="simple-list">{segments.map((item) => <button className={`segment-choice ${selected === item.id ? 'selected' : ''}`} key={item.id} onClick={() => setSelected(item.id)}><span><strong>{item.name}</strong><small>{item.description}</small></span><span className="row-end">{item.customerIds.length}</span></button>)}</div></Panel><Panel title={segment?.name || 'Pilih segmen'} description={segment?.description}><div className="simple-list">{people.map((person) => <Link className="simple-list-row" key={person.id} to={`/admin/customers/${person.id}`}><Avatar name={person.name} /><span><strong>{person.name}</strong><small>{person.email}</small></span><span className="row-end">Profil →</span></Link>)}</div>{people.length === 0 && <p className="muted-copy">Belum ada profil pada segmen ini.</p>}</Panel></div></div>;
}

export function FollowUpsPage() {
  const [done, setDone] = useState([]);
  const rows = reminders.map((reminder) => ({ ...reminder, person: customers.find((customer) => customer.id === reminder.customerId) }));
  return <div className="page-shell"><PageHeading eyebrow="CRM & RETENSI" title="Pengingat & follow-up" description="Catat tindakan lanjutan pelanggan secara manual." /><DemoNotice>Belum ada integrasi pesan otomatis. Status hanya berubah pada pratinjau halaman.</DemoNotice><Panel title="Daftar tindak lanjut"><DataTable columns={[{ header: 'Pelanggan', render: (row) => <PersonCell name={row.person?.name} detail={row.person?.phone} /> }, { header: 'Alasan', accessor: 'reason' }, { header: 'Tanggal', render: (row) => formatDate(row.date) }, { header: 'Status', render: (row) => <StatusPill value={done.includes(row.id) ? 'Selesai' : row.status} /> }, { header: 'Aksi', render: (row) => <button type="button" className="table-action" onClick={() => setDone((items) => items.includes(row.id) ? items.filter((id) => id !== row.id) : [...items, row.id])}>{done.includes(row.id) ? 'Batalkan selesai' : 'Tandai selesai'}</button> }]} data={rows} /></Panel><Panel title="Catatan tindak lanjut"><p className="muted-copy">Gunakan halaman ini untuk mencatat alasan, tanggal, dan status. Pengiriman email atau WhatsApp belum diaktifkan pada versi demo.</p></Panel></div>;
}

export function LoyaltyPage() {
  const columns = [{ header: 'Kode voucher', render: (row) => <strong>{row.code}</strong> }, { header: 'Manfaat', accessor: 'benefit' }, { header: 'Berlaku hingga', accessor: 'validity' }, { header: 'Penukaran demo', accessor: 'redemptions' }, { header: 'Status', render: (row) => <StatusPill value={row.status} /> }];
  return <div className="page-shell"><PageHeading eyebrow="CRM & RETENSI" title="Loyalty & voucher" description="Pantau contoh voucher dan aturan poin loyalitas." action={<button className="button-primary" type="button"><FiPlus /> Buat voucher</button>} /><DemoNotice /><div className="summary-row"><StatTile icon={<FiHeart />} label="Poin per transaksi" value="10 poin / Rp10.000" helper="Aturan ilustrasi" tone="sand" /><StatTile icon={<FiUsers />} label="Pelanggan berpoin" value={customers.filter((person) => person.points > 0).length} /><StatTile icon={<FiShoppingBag />} label="Voucher aktif" value={vouchers.filter((item) => item.status === 'Aktif').length} tone="sage" /></div><Panel title="Voucher demo"><DataTable columns={columns} data={vouchers} /></Panel><Panel title="Saldo poin pelanggan"><DataTable columns={[{ header: 'Pelanggan', render: (row) => <PersonCell name={row.name} detail={row.id} /> }, { header: 'Saldo poin', render: (row) => `${row.points || 0} poin` }, { header: 'Status', render: (row) => <StatusPill value={row.points ? 'Aktif' : 'Belum ada poin'} /> }]} data={customers} /></Panel><p className="muted-copy">Pembuatan dan penukaran voucher belum tersimpan ke server.</p></div>;
}

export function CRMActivityPage() {
  return <div className="page-shell"><PageHeading eyebrow="CRM & RETENSI" title="Riwayat aktivitas" description="Jejak aktivitas operasional yang disiapkan untuk demonstrasi." /><DemoNotice /><Panel title="Aktivitas terbaru"><div className="activity-list">{[
    ...bookingRecords.map((booking) => ({ title: `Booking ${booking.id} ${booking.status.toLowerCase()}`, detail: `${booking.customer?.name} · ${booking.service?.name}`, time: formatDateTime(booking.date) })),
    ...users.filter((user) => user.role === 'customer').map((user) => ({ title: 'Profil pelanggan tersedia', detail: `${user.name} · ${user.email}`, time: `Bergabung ${formatDate(user.joinedDate)}` })),
  ].map((activity, index) => <div className="activity-row" key={`${activity.title}-${index}`}><span className="activity-dot"><FiActivity /></span><div><strong>{activity.title}</strong><p>{activity.detail}</p></div><time>{activity.time}</time></div>)}</div></Panel><p className="muted-copy">Aktivitas di atas dirangkai dari data demo, bukan audit log produksi.</p></div>;
}
