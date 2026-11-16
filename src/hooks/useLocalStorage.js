import { useEffect, useRef, useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage', error);
      return initialValue;
    }
  });
  const valueRef = useRef(storedValue);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(valueRef.current) : value;
      valueRef.current = valueToStore;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new CustomEvent('pawtner:storage', { detail: { key } }));
      }
    } catch (error) {
      console.error('Error setting localStorage', error);
    }
  };

  useEffect(() => {
    const syncValue = () => {
      try {
        const item = window.localStorage.getItem(key);
        const nextValue = item ? JSON.parse(item) : initialValue;
        valueRef.current = nextValue;
        setStoredValue(nextValue);
      } catch (error) {
        console.error('Error syncing localStorage', error);
      }
    };
    const handleStorage = (event) => {
      if (event.key === key || event.detail?.key === key) syncValue();
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('pawtner:storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('pawtner:storage', handleStorage);
    };
  }, [initialValue, key]);

  return [storedValue, setValue];
};