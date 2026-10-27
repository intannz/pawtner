import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiLock, FiMail, FiUser } from 'react-icons/fi';

const RegisterPage = () => {
  const [submitted, setSubmitted] = useState(false);
  return <div className="auth-page"><p className="eyebrow">AKUN PELANGGAN</p><h1>Buat akun Pawtner</h1><p className="auth-description">Simpan profil hewan dan kelola kunjungan dalam satu tempat.</p>{submitted ? <div className="auth-success-panel"><h2>Pendaftaran demo berhasil</h2><p>Akun ini hanya contoh dan belum tersimpan ke database. Silakan masuk memakai akun demo.</p><Link to="/login" className="button-primary">Ke halaman masuk <FiArrowRight /></Link></div> : <form className="auth-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><label>Nama lengkap<div className="auth-input"><FiUser /><input required placeholder="Nama lengkap" /></div></label><label>Email<div className="auth-input"><FiMail /><input type="email" required placeholder="nama@email.com" /></div></label><label>Password<div className="auth-input"><FiLock /><input type="password" minLength="8" required placeholder="Minimal 8 karakter" /></div></label><label className="auth-checkbox"><input type="checkbox" required /> Saya menyetujui syarat penggunaan dan kebijakan privasi.</label><button className="button-primary auth-submit" type="submit">Buat akun <FiArrowRight /></button><p className="form-note">Pendaftaran publik hanya membuat akun pelanggan. Akun admin dibuat oleh pemilik bisnis.</p></form>}<p className="auth-switch">Sudah punya akun? <Link to="/login">Masuk</Link></p></div>;
};

export default RegisterPage;
