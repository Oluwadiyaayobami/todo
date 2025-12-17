import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage safely
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');

      if (storedUser && storedUser !== 'undefined') {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Invalid user data in localStorage. Clearing...');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

    setLoading(false);
  }, []);

  // ------------------- LOGIN ----------------------
 const login = async (email: string, password: string) => {
  setLoading(true);
  try {
    const response = await fetch('https://eatro-hlcb.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Login failed');

    const data = await response.json();

    // backend sends username, email, token
    const userObject = { username: data.username, email: data.email };

    setUser(userObject); // update your AuthContext
    localStorage.setItem('user', JSON.stringify(userObject));
    localStorage.setItem('token', data.token); // store JWT

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  // ------------------- REGISTER ----------------------
  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('https://eatro-hlcb.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) throw new Error('Registration failed');

      const data = await response.json();

      const userObject = { username: data.username, email: data.email };

      setUser(userObject);
      localStorage.setItem('user', JSON.stringify(userObject));
      localStorage.setItem('token', data.token);

    } finally {
      setLoading(false);
    }
  };

  // ------------------- LOGOUT ----------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
