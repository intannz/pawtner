import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const isAdminRoute = location.pathname.startsWith('/admin/');
    return <Navigate to={isAdminRoute ? '/admin/login' : '/login'} replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return user?.role === 'admin' 
      ? <Navigate to="/admin/dashboard" replace /> 
      : <Navigate to="/account" replace />;
  }

  // Jika aman, render child routes (Outlet)
  return <Outlet />;
};