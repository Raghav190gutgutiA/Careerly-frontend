import { createContext, useCallback, useEffect, useState } from 'react';
import { registerUser, loginUser, guestLogin, fetchMe } from '../services/authService.js';
import { AUTH_TOKEN_KEY } from '../utils/constants.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    fetchMe()
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem(AUTH_TOKEN_KEY))
      .finally(() => setIsLoading(false));
  }, []);

  const persistSession = ({ user: sessionUser, token }) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setUser(sessionUser);
  };

  const register = useCallback(async (payload) => {
    const res = await registerUser(payload);
    persistSession(res.data);
    return res.data.user;
  }, []);

  const login = useCallback(async (payload) => {
    const res = await loginUser(payload);
    persistSession(res.data);
    return res.data.user;
  }, []);

  const continueAsGuest = useCallback(async (name) => {
    const res = await guestLogin({ name });
    persistSession(res.data);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        isAuthenticated: !!user,
        token: localStorage.getItem(AUTH_TOKEN_KEY),
        register,
        login,
        continueAsGuest,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
