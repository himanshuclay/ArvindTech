import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import axios from 'axios';

type User = {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  EmpId: string;
  role: string;
  EmpName: string;
  token: string;
};

const AuthContext = createContext<any>({});

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

const authSessionKey = '_VELONIC_AUTH';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>(
    localStorage.getItem(authSessionKey)
      ? JSON.parse(localStorage.getItem(authSessionKey) || '{}')
      : undefined
  );

  const saveSession = useCallback((user: User) => {
    localStorage.setItem(authSessionKey, JSON.stringify(user));
    setUser(user);
  }, []);

  const removeSession = useCallback(() => {
    localStorage.removeItem(authSessionKey);
    setUser(undefined);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/login', { email, password });
      const userData = response.data;
      
      if (userData) {
        saveSession(userData);  // Save user session
        return { status: 200 };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { status: error.response?.status || 500, message: 'Login failed. Please try again.' };
    }
  };

  const logout = useCallback(() => {
    removeSession();
  }, [removeSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
        saveSession,
        removeSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
