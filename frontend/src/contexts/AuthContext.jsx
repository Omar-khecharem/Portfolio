import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.me()
        .then((data) => setUser(data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      if (data.requiresVerification) {
        setPendingVerification({ email: data.email });
        return { verification: true, email: data.email };
      }
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Welcome back, Omar');
      return { success: true };
    } catch (e) {
      toast.error(e.response?.data?.message || 'Login failed');
      return { error: e.response?.data?.message || 'Login failed' };
    }
  }, []);

  const verifyCode = useCallback(async (email, code) => {
    try {
      const data = await authApi.verifyCode(email, code);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setPendingVerification(null);
      toast.success('Welcome back, Omar');
      return { success: true };
    } catch (e) {
      toast.error(e.response?.data?.message || 'Verification failed');
      return { error: e.response?.data?.message || 'Verification failed' };
    }
  }, []);

  const cancelVerification = useCallback(() => {
    setPendingVerification(null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Signed out');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, verifyCode, cancelVerification, pendingVerification, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
