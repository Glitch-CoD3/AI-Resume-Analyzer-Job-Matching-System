// src/routes/ProtectedRoute.jsx

import {
  Navigate,
  Outlet,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

export const ProtectedRoute = () => {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
};


export const GuestRoute = () => {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  return isAuthenticated
    ? <Navigate to="/home" replace />
    : <Outlet />;
};