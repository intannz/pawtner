import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { users } from '../data/users';
import { bookings as initialBookings, dinaDemoBookings } from '../data/bookings';
import { storageKeys } from '../data/appData';

const demoCustomerIds = new Set(users.filter((item) => item.role === 'user').map((item) => item.id));

export const useAuth = () => {
  // Menyimpan data user yang sedang login di localStorage dengan key 'pawtner_session'
  const [user, setUser] = useLocalStorage('pawtner_session', null);
  const [storedUsers, setStoredUsers] = useLocalStorage(storageKeys.users, users);
  const [storedBookings, setStoredBookings] = useLocalStorage(storageKeys.bookings, initialBookings);
  const [seedVersion, setSeedVersion] = useLocalStorage('pawtner_seed_version', 0);

  useEffect(() => {
    if (user?.role === 'customer') setUser({ ...user, role: 'user' });
    if (user && !storedUsers.some((item) => item.id === user.id)) setUser(null);
    if (storedUsers.some((item) => item.role === 'customer')) {
      setStoredUsers((items) => items.map((item) => item.role === 'customer' ? { ...item, role: 'user' } : item));
    }
  }, [setStoredUsers, setUser, storedUsers, user]);

  useEffect(() => {
    if (seedVersion < 1) {
      setStoredUsers((items) => {
        const newDemoCustomers = users.filter((item) => Number(item.id.match(/\d+$/)?.[0]) >= 31 && !items.some((stored) => stored.id === item.id));
        return [...items, ...newDemoCustomers];
      });
      setSeedVersion(1);
      return;
    }
    if (seedVersion < 2) {
      const completedBookings = [...storedBookings, ...dinaDemoBookings];
      const customersWithCompletedBookings = new Set(completedBookings
        .filter((booking) => booking.status === 'Selesai')
        .map((booking) => booking.customerId));
      setStoredBookings((items) => {
        const existingIds = new Set(items.map((booking) => booking.id));
        return [...items, ...dinaDemoBookings.filter((booking) => !existingIds.has(booking.id))];
      });
      setStoredUsers((items) => items.map((person) => {
        if (!demoCustomerIds.has(person.id) || person.id === 'CUS-0001' || customersWithCompletedBookings.has(person.id)) return person;
        if (!person.points && !person.pointLots?.some((lot) => lot.points > 0)) return person;
        return { ...person, points: 0, pointLots: [] };
      }));
      setSeedVersion(2);
    }
  }, [seedVersion, setStoredBookings, setSeedVersion, setStoredUsers, storedBookings]);

  const login = (email) => {
    // Karena ini MVP, kita simulasi login hanya dengan mengecek kecocokan email di dummy data
    const foundUser = storedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      return { success: true, role: foundUser.role === 'customer' ? 'user' : foundUser.role };
    }
    
    return { success: false, message: 'Email tidak ditemukan. Silakan periksa kembali.' };
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    setUser,
    users: storedUsers,
    setUsers: setStoredUsers,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'user' || user?.role === 'customer'
  };
};