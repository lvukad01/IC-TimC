import useAuth from '@hooks/useAuth';
import { AppPaths } from 'common/routes/paths';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return authenticated ? children : <Navigate to={AppPaths.LOGIN} replace />;
};

export default ProtectedRoute;
