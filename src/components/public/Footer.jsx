import { Link } from 'react-router-dom';

export const FooterBottom = () => (
  <footer className="site-footer footer-bottom-only">
    <div className="container">
      <div className="footer-bottom"><p>Developed by : Intan Maharani, Maya Chintya Olivierra, Refa Maulidina | © {new Date().getFullYear()} Pawtner. All rights reserved.</p></div>
    </div>
  </footer>
);

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand"><Link to="/"><img src="/logo-footer.svg" alt="Pawtner" /></Link><p>Care for pets. Build lasting bonds. Solusi manajemen pet care untuk bisnis dan pemilik hewan kesayangan.</p></div>
        <div><h2>Layanan</h2><ul><li><Link to="/services">Pet grooming</Link></li><li><Link to="/services">Penitipan & daycare</Link></li><li><Link to="/services">Klinik hewan</Link></li><li><Link to="/services">Vaksinasi</Link></li></ul></div>
        <div><h2>Perusahaan</h2><ul><li><Link to="/about">Tentang Pawtner</Link></li><li><Link to="/faq">FAQ</Link></li><li><Link to="/contact">Kontak</Link></li><li><Link to="/admin/login">Login bisnis</Link></li></ul></div>
      </div>
      <div className="footer-bottom"><p>Developed by : Intan Maharani, Maya Chintya Olivierra, Refa Maulidina | © {new Date().getFullYear()} Pawtner. All rights reserved.</p></div>
    </div>
  </footer>
);

export default Footer;
