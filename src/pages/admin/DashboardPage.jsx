import { Link } from 'react-router-dom';
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { FiCalendar, FiClock, FiHeart, FiUsers } from 'react-icons/fi';
import { bookings as initialBookings } from '../../data/bookings';
import { pets as initialPets } from '../../data/pets';
import { reminders } from '../../data/reminders';
import { transactions as initialTransactions } from '../../data/transactions';
import { users as initialUsers } from '../../data/users';
import { getBookingRecords, initialServices, storageKeys } from '../../data/appData';
import { getMonthlyPerformance, getServicePerformance } from '../../data/viewModels';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';
import { DemoNotice, PageHeading, Panel, StatTile, StatusPill } from '../../components/common/PageUI';

const DashboardPage = () => {
  const [allBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const [allUsers] = useLocalStorage(storageKeys.users, initialUsers);
  const [allPets] = useLocalStorage(storageKeys.pets, initialPets);
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const [allTransactions] = useLocalStorage(storageKeys.transactions, initialTransactions);
  const bookingRecords = getBookingRecords(allBookings, allPets, allUsers, allServices);
  const monthlyPerformance = getMonthlyPerformance(allBookings, allTransactions);
  const servicePerformance = getServicePerformance(allBookings, allServices);
  const customers = allUsers.filter((user) => user.role === 'user' || user.role === 'customer');
  const completedBookings = allBookings.filter((booking) => booking.status === 'Selesai');
  const completedVisitsByCustomer = completedBookings.reduce((counts, booking) => {
    counts[booking.customerId] = (counts[booking.customerId] || 0) + 1;
    return counts;
  }, {});
  const returningCustomers = Object.values(completedVisitsByCustomer).filter((count) => count > 1).length;
  const returningCustomersRate = `${Math.round((returningCustomers / Math.max(customers.length, 1)) * 100)}%`;
  const todayBookings = bookingRecords.filter((booking) => booking.date.startsWith('2026-10-28'));
  const recentBookings = [...bookingRecords]
    .sort((left, right) => new Date(right.date) - new Date(left.date))
    .slice(0, 3);
  const openFollowUps = reminders.filter((reminder) => reminder.status !== 'Selesai').length;
  const upcomingReminders = reminders.filter((reminder) => reminder.status === 'Terjadwal').length;
  const revenue = monthlyPerformance.reduce((total, month) => total + month.revenue, 0);

  return (
    <div className="page-shell">
      <PageHeading
        eyebrow="PAWTNER ADMIN"
        title="Selamat pagi, Admin!"
        description="Berikut ringkasan operasional bisnis kamu."
        action={<span className="date-chip"><FiCalendar /> 28 Oktober 2026</span>}
      />
      <DemoNotice />
      <div className="summary-row">
        <StatTile icon={<FiCalendar />} label="Booking hari ini" value={todayBookings.length} helper={`${todayBookings.filter((booking) => booking.status === 'Terkonfirmasi').length} terkonfirmasi`} />
        <StatTile icon={<FiUsers />} label="Total pelanggan" value={customers.length} helper="Dari data pelanggan tersimpan" tone="sand" />
        <StatTile icon={<FiHeart />} label="Pelanggan kembali" value={returningCustomersRate} helper="Dihitung dari booking selesai" tone="sage" />
        <StatTile icon={<FiClock />} label="Follow-up terbuka" value={openFollowUps} helper={`${upcomingReminders} pengingat terjadwal`} tone="sand" />
      </div>
      <div className="dashboard-grid">
        <Panel title="Tren booking" description="Performa per bulan dihitung dari booking tersimpan." className="dashboard-chart-panel">
          <div className="admin-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPerformance} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#eee5d9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="bookings" name="Booking" fill="#9B7A48" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="chart-footnote">Nilai transaksi lunas pada data tersimpan: {formatCurrency(revenue)}</p>
        </Panel>
        <Panel title="Layanan populer" description="Jumlah booking per layanan tersimpan.">
          <div className="service-rank-list">
            {servicePerformance.slice(0, 4).map((service, index) => (
              <div className="service-rank" key={service.name}>
                <span className="rank-number">0{index + 1}</span>
                <span>{service.name}</span>
                <strong>{service.bookings}</strong>
              </div>
            ))}
          </div>
          <Link className="inline-link" to="/admin/services">Kelola layanan</Link>
        </Panel>
      </div>
      <div className="dashboard-grid">
        <Panel title="Jadwal hari ini" description="Booking pada tanggal demo 28 Oktober 2026." action={<Link className="inline-link" to="/admin/bookings">Semua booking</Link>}>
          <div className="schedule-list">
            {bookingRecords.filter((booking) => booking.date.startsWith('2026-10-28')).map((booking) => (
              <Link className="schedule-row" to={`/admin/bookings/${booking.id}`} key={booking.id}>
                <time>{formatDateTime(booking.date).split(', ').at(-1)}</time>
                <div className="schedule-row-main"><strong>{booking.pet?.name} — {booking.service?.name}</strong><small>{booking.customer?.name} · {booking.pet?.type}</small></div>
                <StatusPill value={booking.status} />
              </Link>
            ))}
          </div>
        </Panel>
        <Panel title="Aktivitas terbaru" description="Diurutkan dari booking terbaru pada data tersimpan.">
          <div className="simple-list">
            {recentBookings.map((booking) => (
              <div className="simple-list-row" key={booking.id}>
                <span className="activity-marker">{booking.customer?.name?.slice(0, 2).toUpperCase() || 'BK'}</span>
                <span><strong>Booking {booking.status.toLowerCase()}</strong><small>{booking.customer?.name || 'Pelanggan'} · {booking.pet?.name || 'Hewan'} · {booking.service?.name || 'Layanan'}</small></span>
                <small>{formatDateTime(booking.date)}</small>
              </div>
            ))}
          </div>
          <Link className="inline-link" to="/admin/crm/activity">Lihat aktivitas</Link>
        </Panel>
      </div>
    </div>
  );
};

export default DashboardPage;