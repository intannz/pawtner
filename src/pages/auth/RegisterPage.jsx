import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { users as initialUsers } from '../../data/users';
import { createAdminNotification, getNextId, storageKeys } from '../../data/appData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const RegisterPage = () => {
  const { users, setUsers, setUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [, setAdminNotifications] = useLocalStorage(storageKeys.adminNotifications, []);
  const submit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name')).trim();
    const password = String(form.get('password'));
    const email = String(form.get('email')).trim().toLowerCase();
    if (name.length < 2) {
      setError('Nama harus terdiri dari minimal 2 karakter.');
      return;
    }
    if (password.length < 8) {
      setError('Password harus terdiri dari minimal 8 karakter.');
      return;
    }
    if (users.some((person) => person.email.toLowerCase() === email)) {
      setError('Email sudah terdaftar. Silakan masuk dengan akun yang ada.');
      return;
    }
    const customerUsers = users.filter((person) => person.role === 'user' || person.role === 'customer');
    const newUser = {
      id: getNextId(customerUsers.length ? customerUsers : initialUsers.filter((person) => person.role === 'user'), 'CUS', 4),
      name,
      email,
      phone: '',
      role: 'user',
      joinedDate: new Date().toISOString().slice(0, 10),
      points: 0,
    };
    setUsers((items) => [...items, newUser]);
    setAdminNotifications((items) => [createAdminNotification('Pelanggan baru mendaftar', `${newUser.name} membuat akun Pawtner.`, '/admin/customers'), ...items]);
    setUser(newUser);
    navigate('/account', { replace: true });
  };

  return <div className="auth-page"><p className="eyebrow">AKUN PELANGGAN</p><h1>Buat akun Pawtner</h1><p className="auth-description">Simpan profil hewan dan kelola kunjungan dalam satu tempat.</p><form className="auth-form" onSubmit={submit}><label>Nama lengkap<div className="auth-input"><FiUser /><input name="name" required minLength="2" placeholder="Nama lengkap" /></div></label><label>Email<div className="auth-input"><FiMail /><input name="email" type="email" required placeholder="nama@email.com" /></div></label><label>Password<div className="auth-input"><FiLock /><input name="password" type="password" minLength="8" required placeholder="Minimal 8 karakter" /></div></label><label className="auth-checkbox"><input type="checkbox" required /> Saya menyetujui syarat penggunaan dan kebijakan privasi.</label>{error && <p className="form-error">{error}</p>}<button className="button-primary auth-submit" type="submit">Buat akun</button><p className="form-note">Pendaftaran demo tersimpan di browser ini. Akun admin dibuat terpisah.</p></form><p className="auth-switch">Sudah punya akun? <Link to="/login">Masuk</Link></p></div>;
};

export default RegisterPage;
