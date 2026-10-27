import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMail } from 'react-icons/fi';

const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);
  return <div className="auth-page"><p className="eyebrow">BANTUAN AKUN</p><h1>Lupa password?</h1><p className="auth-description">Masukkan email akun untuk melihat konfirmasi pemulihan password.</p><form className="auth-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><label>Email<div className="auth-input"><FiMail /><input type="email" required placeholder="nama@email.com" /></div></label><button className="button-primary auth-submit" type="submit">Kirim instruksi <FiMail /></button></form>{submitted && <p className="form-success">Jika email terdaftar, instruksi pemulihan akan dikirim. Pengiriman email belum aktif di versi demo.</p>}<Link to="/login" className="auth-back"><FiArrowLeft /> Kembali ke login</Link></div>;
};

export default ForgotPasswordPage;
