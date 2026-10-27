import { users } from '../data/users';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (email) => {
    await delay(); // Simulasi loading jaringan
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('Email tidak terdaftar di sistem.');
    }
    return user;
  },
  
  register: async (userData) => {
    await delay();
    const newUser = {
      id: `CUS-000${users.length + 1}`,
      ...userData,
      role: 'customer',
      joinedDate: new Date().toISOString().split('T')[0],
      points: 0
    };
    // Catatan: Di sistem nyata ini akan memanggil POST request
    console.log('User baru terdaftar:', newUser);
    return newUser;
  }
};