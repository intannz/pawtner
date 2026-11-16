import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiClock, FiCopy, FiGift, FiSearch } from 'react-icons/fi';
import { PageHeading, Panel } from '../../components/common/PageUI';
import { addMonths, getActivePoints, getBookingDraftKey, normalizeLoyaltySettings, redeemPointLots, storageKeys, initialLoyaltySettings, initialServices, getNextId } from '../../data/appData';
import { users } from '../../data/users';
import { useAuth } from '../../hooks/useAuth';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { formatCurrency } from '../../utils/formatCurrency';
import groomingImage from '../../assets/grooming-pet.png';
import clinicImage from '../../assets/clinic.png';
import careImage from '../../assets/pet-care.png';

const serviceSlug = (service) => service.id.toLowerCase();
const getServiceImage = (category) => category === 'Grooming' ? groomingImage : category === 'Klinik' ? clinicImage : careImage;

export function CustomerServicesPage() {
  const [query, setQuery] = useState('');
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const filteredServices = useMemo(() => allServices.filter((service) =>
    `${service.name} ${service.category} ${service.description}`.toLowerCase().includes(query.toLowerCase()),
  ), [allServices, query]);

  return (
    <div className="page-shell customer-page">
      <PageHeading eyebrow="PAWTNER CARE" title="Katalog layanan" description="Pilih perawatan yang paling sesuai untuk sahabat berbulu." />
      <label className="customer-catalog-search"><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari layanan atau kategori..." /></label>
      <div className="service-grid">
        {filteredServices.map((service) => (
          <article className="service-card" key={service.id}>
            <div className="service-card-image"><img src={getServiceImage(service.category)} alt={service.name} /><span>{service.category}</span></div>
            <div className="service-card-content">
              <span className="service-category-tag">{service.category}</span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-card-meta"><span><FiClock /> {service.duration} menit</span><strong>{formatCurrency(service.price)}</strong></div>
              <Link to={`/account/services/${serviceSlug(service)}`} className="button-secondary">Lihat detail</Link>
            </div>
          </article>
        ))}
        {!filteredServices.length && <div className="empty-catalog"><h2>Layanan tidak ditemukan</h2><p>Coba kata kunci lainnya.</p></div>}
      </div>
    </div>
  );
}

export function CustomerServiceDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [allServices] = useLocalStorage(storageKeys.services, initialServices);
  const [, setBookingDraft] = useLocalStorage(getBookingDraftKey(user?.id), {});
  const service = allServices.find((item) => serviceSlug(item) === slug?.toLowerCase());
  if (!service) return <div className="page-shell"><PageHeading title="Layanan tidak ditemukan" /><Link to="/account/services" className="inline-link">Kembali ke katalog</Link></div>;

  return (
    <div className="page-shell customer-page">
      <Link to="/account/services" className="inline-link">Semua layanan</Link>
      <PageHeading eyebrow={service.category} title={service.name} description={service.description} action={<strong className="customer-service-price">{formatCurrency(service.price)}</strong>} />
      <div className="detail-grid">
        <Panel title="Detail layanan">
          <dl className="detail-list">
            <div><dt>Untuk hewan</dt><dd>{service.forType.join(', ')}</dd></div>
            <div><dt>Estimasi durasi</dt><dd>{service.duration} menit</dd></div>
            <div><dt>Harga</dt><dd>{formatCurrency(service.price)}</dd></div>
          </dl>
        </Panel>
        <Panel title="Siap membuat jadwal?">
          <p className="muted-copy">Pilih hewan dan waktu kunjungan. Permintaan akan muncul di daftar booking dan menunggu konfirmasi admin.</p>
          <Link to={`/account/booking/new?service=${service.id}`} className="button-primary" onClick={() => setBookingDraft((draft) => ({ ...draft, serviceId: service.id }))}><FiCalendar /> Pesan layanan</Link>
        </Panel>
      </div>
    </div>
  );
}

export function CustomerVouchersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [storedUsers, setStoredUsers] = useLocalStorage(storageKeys.users, users);
  const [vouchers, setVouchers] = useLocalStorage(storageKeys.vouchers, []);
  const [, setBookingDraft] = useLocalStorage(getBookingDraftKey(user?.id), {});
  const [storedSettings] = useLocalStorage(storageKeys.loyalty, initialLoyaltySettings);
  const settings = normalizeLoyaltySettings(storedSettings);
  const [message, setMessage] = useState('');
  const person = storedUsers.find((item) => item.id === user?.id) || user;
  const pointBalance = getActivePoints(person);
  const customerVouchers = vouchers.filter((voucher) => voucher.customerId === user?.id);

  const redeemReward = (reward) => {
    setMessage('');
    if (pointBalance < reward.points) {
      setMessage(`Poin belum cukup. Kamu membutuhkan ${reward.points} poin.`);
      return;
    }
    const voucherId = getNextId(vouchers, 'VCR', 4);
    const newVoucher = {
      id: voucherId,
      code: `PAW-${voucherId}`,
      customerId: user.id,
      pointsUsed: reward.points,
      discount: reward.discount,
      createdAt: new Date().toISOString(),
      expiresAt: addMonths(new Date(), settings.voucherValidityMonths).toISOString(),
      status: 'Aktif',
      used: false,
      combinable: false,
    };
    setStoredUsers((items) => items.map((item) => item.id === user.id ? { ...item, ...redeemPointLots(item, reward.points) } : item));
    setVouchers((items) => [newVoucher, ...items]);
    setMessage(`Voucher ${newVoucher.code} berhasil diaktifkan.`);
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setBookingDraft((draft) => ({ ...draft, voucherCode: code }));
      setMessage(`Kode ${code} disalin dan siap dipakai pada booking.`);
    } catch (error) {
      console.error('Gagal menyalin kode voucher', error);
      setMessage('Kode tidak dapat disalin otomatis. Silakan salin kode secara manual.');
    }
  };
  const applyVoucher = (voucher) => {
    setBookingDraft((draft) => ({ ...draft, voucherCode: voucher.code }));
    navigate('/account/booking/new');
  };
  return (
    <div className="page-shell customer-page">
      <PageHeading eyebrow="PAWTNER REWARDS" title="Poin & voucher" description="Tukarkan poin dengan potongan harga untuk kunjungan berikutnya." />
      <section className="points-summary">
        <span className="points-summary-icon"><FiGift /></span>
        <div><small>POIN TERSEDIA</small><strong>{pointBalance} poin</strong><p>Setiap transaksi Rp{Number(settings.amountPerPoint).toLocaleString('id-ID')} mendapat 1 poin. Poin tidak kedaluwarsa.</p></div>
      </section>
      {message && <p className="form-success" role="status">{message}</p>}
      <Panel title="Tukar poin" description={`Minimal 5 poin. Voucher berlaku ${settings.voucherValidityMonths} bulan setelah diterbitkan, hanya dapat digunakan satu kali, dan tidak dapat digabung dengan promo tertentu. Poin diberikan setelah transaksi selesai; transaksi yang dibatalkan tidak mendapat poin.`}>
        <div className="reward-grid">
          {settings.rewards.map((reward) => (
            <article className="reward-card" key={reward.points}>
              <span>{reward.points} poin</span><strong>Diskon {formatCurrency(reward.discount)}</strong>
              <button type="button" className="button-primary" disabled={pointBalance < reward.points} onClick={() => redeemReward(reward)}>Aktifkan voucher</button>
            </article>
          ))}
        </div>
      </Panel>
      <Panel title="Voucher saya">
        {customerVouchers.length ? <div className="customer-voucher-list">{customerVouchers.map((voucher) => (
          <article className="customer-voucher-card" key={voucher.id}>
            <div><span className="voucher-label">KODE VOUCHER</span><strong className="voucher-code">{voucher.code}</strong><p>Diskon {formatCurrency(voucher.discount)} · berlaku sampai {new Date(voucher.expiresAt).toLocaleDateString('id-ID')}</p><small>{voucher.used ? 'Sudah digunakan' : new Date(voucher.expiresAt) <= new Date() ? 'Voucher kedaluwarsa' : 'Satu kali penggunaan · tidak dapat digabung promo tertentu'}</small></div>
            <div className="voucher-actions"><button type="button" className="button-secondary" disabled={voucher.used || new Date(voucher.expiresAt) <= new Date()} onClick={() => copyCode(voucher.code)}><FiCopy /> Salin kode</button>{!voucher.used && new Date(voucher.expiresAt) > new Date() && <button type="button" className="table-action" onClick={() => applyVoucher(voucher)}>Pakai untuk booking <FiArrowRight /></button>}</div>
          </article>
        ))}</div> : <p className="muted-copy">Belum ada voucher. Tukarkan poin untuk mengaktifkan voucher demo.</p>}
      </Panel>
    </div>
  );
}

