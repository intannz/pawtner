import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLock, FiMail, FiShield } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const submit = (event) => {
    event.preventDefault();
    const result = login(email);
    if (!result.success || result.role !== 'admin') {
      setError(result.success ? 'Akun ini tidak memiliki akses admin.' : result.message);
      return;
    }
    navigate('/admin/dashboard', { replace: true });
  };
  return <div className="auth-page"><span className="auth-role-icon"><FiShield /></span><p className="eyebrow">PAWTNER ADMIN</p><h1>Masuk ke panel bisnis</h1><p className="auth-description">Gunakan akun admin atau staf yang telah dibuat oleh pemilik bisnis.</p><form className="auth-form" onSubmit={submit}><label>Email<div className="auth-input"><FiMail /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@pawtner.com" /></div></label><label>Password<div className="auth-input"><FiLock /><input type="password" required placeholder="Masukkan password" /></div></label>{error && <p className="form-error">{error}</p>}<button className="button-primary auth-submit" type="submit">Masuk ke dashboard <FiArrowRight /></button></form><div className="auth-demo-info"><strong>Akun admin demo</strong><span>admin@pawtner.com</span><span>Password hanya simulasi untuk demo.</span></div><p className="auth-admin-link"><Link to="/login">Kembali ke login pelanggan</Link></p></div>;
};

export default AdminLoginPage;
