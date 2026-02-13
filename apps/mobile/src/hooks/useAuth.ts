import { useState, useEffect, useCallback } from 'react';
import { getToken, getStoredUser, login as authLogin, logout as authLogout } from '../services/auth';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await getToken();
      if (token) {
        const stored = await getStoredUser();
        if (stored) {
          setUser(stored);
          setIsAuthenticated(true);
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    const userData = await authLogin(email, password);
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return { user, isLoading, isAuthenticated, login, logout, refreshAuth: checkAuth };
}
