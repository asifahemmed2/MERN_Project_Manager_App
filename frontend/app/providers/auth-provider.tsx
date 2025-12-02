import { createContext, useEffect, useState } from 'react';
import type { User } from '../types';
import { useLocation, useNavigate } from 'react-router';
import { publicRoutes } from '../lib';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const isPublicRoute = publicRoutes.includes(pathname);
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          if (!isPublicRoute) {
            navigate('/sign-in');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        if (!isPublicRoute) {
          navigate('/sign-in');
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleSignOut = () => {
      signOut();
      navigate('/auth/sign-in');
    };
    window.addEventListener('forceLogout', handleSignOut);
    return () => {
      window.removeEventListener('forceLogout', handleSignOut);
    };
  }, []);
  const signIn = async (data: any) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
    setIsLoading(false);
  };
  const signOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
