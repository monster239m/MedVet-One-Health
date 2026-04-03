'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS, initializeMockData } from '@/data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeMockData();
    const stored = localStorage.getItem('medvet_current_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch(e) { localStorage.removeItem('medvet_current_user'); }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const allUsers = [...MOCK_USERS.patients, ...MOCK_USERS.doctors, ...MOCK_USERS.admins];
    const found = allUsers.find(u => u.email === email && u.password === password);
    if (found) {
      const userData = { ...found };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('medvet_current_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medvet_current_user');
  };

  const getDashboardPath = (role) => {
    switch(role) {
      case 'patient': return '/dashboard/patient';
      case 'doctor': return '/dashboard/doctor';
      case 'admin': return '/dashboard/admin';
      default: return '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getDashboardPath }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
