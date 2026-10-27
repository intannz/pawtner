import { useLocalStorage } from './useLocalStorage';
import { users } from '../data/users';

export const useAuth = () => {
  // Menyimpan data user yang sedang login di localStorage dengan key 'pawtner_session'
  const [user, setUser] = useLocalStorage('pawtner_session', null);

  const login = (email) => {
    // Karena ini MVP, kita simulasi login hanya dengan mengecek kecocokan email di dummy data
    const foundUser = users.find((u) => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      return { success: true, role: foundUser.role };
    }
    
    return { success: false, message: 'Email tidak ditemukan. Silakan periksa kembali.' };
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer'
  };
};