import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand"><Link to="/"><img src="/logo-footer.svg" alt="Pawtner" /></Link><p>Care for pets. Build lasting bonds. Solusi manajemen pet care untuk bisnis dan pemilik hewan kesayangan.</p></div>
        <div><h2>Layanan</h2><ul><li><Link to="/services">Pet grooming</Link></li><li><Link to="/services">Penitipan & daycare</Link></li><li><Link to="/services">Klinik hewan</Link></li><li><Link to="/services">Vaksinasi</Link></li></ul></div>
        <div><h2>Perusahaan</h2><ul><li><Link to="/about">Tentang Pawtner</Link></li><li><Link to="/faq">FAQ</Link></li><li><Link to="/contact">Kontak</Link></li><li><Link to="/admin/login">Login bisnis</Link></li></ul></div>
      </div>
      <div className="footer-bottom"><p>© {new Date().getFullYear()} Pawtner. Semua hak dilindungi.</p><span>Data contoh ditampilkan untuk keperluan demonstrasi.</span></div>
    </div>
  </footer>
);

export default Footer;
