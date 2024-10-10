import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';

// Define the User type
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
  error?: string; // Optional property for error messages
};

// Define the shape of the AuthContext
interface AuthContextType {
  user?: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ status: number; message?: string }>;
  logout: () => void;
  saveSession: (user: User) => void;
  removeSession: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for using AuthContext
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

const authSessionKey = '_VELONIC_AUTH';

// AuthProvider component
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

  const login = async (email: string, password: string): Promise<{ status: number; message?: string }> => {
    try {
      const response = await axios.post('/login', { email, password });
      const userData: User = response.data;

      if (userData) {
        saveSession(userData); // Save user session
        return { status: 200 };
      }
      return { status: 400, message: 'Login failed. Invalid user data.' };
    } catch (error: unknown) {
      const axiosError = error as AxiosError; // Cast error to AxiosError
      console.error('Login failed:', axiosError);

      return {
        status: axiosError.response?.status || 500,
        message: axiosError.response?.data?.message || 'Login failed. Please try again.',
      };
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
