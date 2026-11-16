import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    setError('');
    const result = login(email);
    if (!result.success) {
      setError(result.message);
      return;
    }
    if (result.role !== 'user') {
      setError('Akun ini adalah admin. Silakan gunakan halaman login admin.');
      return;
    }
    const returnTo = new URLSearchParams(location.search).get('returnTo');
    navigate(returnTo?.startsWith('/') ? returnTo : '/account', { replace: true });
  };

  return <div className="auth-page"><p className="eyebrow">CUSTOMER PORTAL</p><h1>Selamat datang kembali</h1><p className="auth-description">Masuk untuk mengelola profil hewan dan booking kamu.</p><form className="auth-form" onSubmit={submit}><label>Email<div className="auth-input"><FiMail /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" /></div></label><label>Password<div className="auth-input"><FiLock /><input type="password" required minLength="8" placeholder="Minimal 8 karakter" /></div></label><div className="auth-form-meta"><span>Password hanya simulasi untuk demo.</span><Link to="/forgot-password">Lupa password?</Link></div>  {error && <p className="form-error">{error}</p>}<button className="button-primary auth-submit" type="submit">Masuk</button></form><div className="auth-demo-info"><strong>Akun demo pelanggan</strong><span>dina@example.com</span><span>Gunakan password demo minimal 8 karakter.</span></div><p className="auth-switch">Belum punya akun? <Link to="/register">Daftar sekarang</Link></p><p className="auth-admin-link"><Link to="/admin/login">Masuk sebagai admin atau staf</Link></p></div>;
};

export default LoginPage;
