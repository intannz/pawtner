import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <nav className="site-navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand" onClick={closeMenu}><img src="/logo-navbar.svg" alt="Pawtner" /></Link>
        <button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <FiX /> : <FiMenu />}</button>
        <div className={`navbar-links ${menuOpen ? 'is-open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>Beranda</NavLink>
          <NavLink to="/services" onClick={closeMenu}>Layanan</NavLink>
          <NavLink to="/about" onClick={closeMenu}>Tentang</NavLink>
          <NavLink to="/faq" onClick={closeMenu}>FAQ</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Kontak</NavLink>
          <div className="navbar-mobile-actions"><Link to="/login" onClick={closeMenu}>Masuk</Link><Link to="/register" className="button-primary" onClick={closeMenu}>Daftar</Link></div>
        </div>
        <div className="navbar-actions"><Link to="/login">Masuk</Link><Link to="/register" className="button-primary">Daftar</Link></div>
      </div>
    </nav>
  );
};

export default Navbar;
