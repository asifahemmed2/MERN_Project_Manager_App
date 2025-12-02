import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

const AuthLayout = () => {
  const { isAuthenticated,isLoading } = useAuth();
  if(isLoading) return <div>Loading...</div>;
  if (isAuthenticated) return <Navigate to="/dashboard" />;
  return <Outlet />;
};

export default AuthLayout;
