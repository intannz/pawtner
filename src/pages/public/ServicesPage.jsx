import { useMemo, useState } from 'react';
import { FiSearch, FiSliders } from 'react-icons/fi';
import ServiceCard from '../../components/public/ServiceCard';
import { services } from '../../data/services';
import { PageHeading } from '../../components/common/PageUI';

const ServicesPage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua kategori');
  const categories = ['Semua kategori', ...new Set(services.map((service) => service.category))];
  const filteredServices = useMemo(() => services.filter((service) => {
    const matchesCategory = category === 'Semua kategori' || service.category === category;
    const matchesQuery = `${service.name} ${service.category} ${service.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [category, query]);

  return (
    <div className="public-page">
      <section className="public-page-intro"><div className="container"><PageHeading eyebrow="PAWTNER CARE" title="Layanan untuk sahabat berbulu" description="Temukan layanan perawatan yang tersedia. Harga dan jadwal pada halaman ini adalah data dummy untuk demonstrasi." /></div></section>
      <section className="public-section"><div className="container">
        <div className="catalog-toolbar"><label className="catalog-search"><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama atau kategori layanan..." /></label><label className="catalog-filter"><FiSliders /><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter kategori">{categories.map((item) => <option key={item}>{item}</option>)}</select></label></div>
        {filteredServices.length > 0 ? <div className="service-grid">{filteredServices.map((service) => <ServiceCard key={service.id} service={service} />)}</div> : <div className="empty-catalog"><h2>Layanan tidak ditemukan</h2><p>Coba kata kunci atau kategori lainnya.</p></div>}
      </div></section>
    </div>
  );
};

export default ServicesPage;
