import { Link } from 'react-router-dom';
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { FiCalendar, FiClock, FiHeart, FiUsers } from 'react-icons/fi';
import { bookingRecords, monthlyPerformance, servicePerformance } from '../../data/viewModels';
import { dashboardStats } from '../../data/dashboardStats';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';
import { DemoNotice, PageHeading, Panel, StatTile, StatusPill } from '../../components/common/PageUI';

const DashboardPage = () => {
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
        <StatTile icon={<FiCalendar />} label="Booking hari ini" value={dashboardStats.todayBookings.total} helper={`${dashboardStats.todayBookings.confirmed} terkonfirmasi`} />
        <StatTile icon={<FiUsers />} label="Total pelanggan" value={dashboardStats.totalCustomers} helper="Dari data demo" tone="sand" />
        <StatTile icon={<FiHeart />} label="Pelanggan kembali" value={dashboardStats.returningCustomersRate} helper="Dihitung dari booking demo" tone="sage" />
        <StatTile icon={<FiClock />} label="Follow-up terbuka" value={dashboardStats.openFollowUps} helper={`${dashboardStats.upcomingReminders} pengingat terjadwal`} tone="sand" />
      </div>
      <div className="dashboard-grid">
        <Panel title="Tren booking" description="Performa enam bulan dihitung dari booking demo." className="dashboard-chart-panel">
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
          <p className="chart-footnote">Perkiraan omzet pada dataset grafik: {formatCurrency(revenue)}</p>
        </Panel>
        <Panel title="Layanan populer" description="Jumlah booking per layanan dari data demo.">
          <div className="service-rank-list">
            {servicePerformance.slice(0, 4).map((service, index) => (
              <div className="service-rank" key={service.name}>
                <span className="rank-number">0{index + 1}</span>
                <span>{service.name}</span>
                <strong>{service.bookings}</strong>
              </div>
            ))}
          </div>
          <Link className="inline-link" to="/admin/services">Kelola layanan <span>→</span></Link>
        </Panel>
      </div>
      <div className="dashboard-grid">
        <Panel title="Jadwal hari ini" description="Contoh booking pada tanggal demo." action={<Link className="inline-link" to="/admin/bookings">Semua booking →</Link>}>
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
        <Panel title="Aktivitas terbaru" description="Data ini hanya untuk pratinjau.">
          <div className="simple-list">
            <div className="simple-list-row"><span className="activity-marker">DP</span><span><strong>Booking baru dibuat</strong><small>Dina Pratama · Full Grooming</small></span><small>09.00</small></div>
            <div className="simple-list-row"><span className="activity-marker">RS</span><span><strong>Profil hewan diperbarui</strong><small>Raka Saputra · Luna</small></span><small>Kemarin</small></div>
            <div className="simple-list-row"><span className="activity-marker">SM</span><span><strong>Layanan ditandai selesai</strong><small>Sinta Maharani · Mochi</small></span><small>26 Okt</small></div>
          </div>
          <Link className="inline-link" to="/admin/crm/activity">Lihat aktivitas <span>→</span></Link>
        </Panel>
      </div>
    </div>
  );
};

export default DashboardPage;