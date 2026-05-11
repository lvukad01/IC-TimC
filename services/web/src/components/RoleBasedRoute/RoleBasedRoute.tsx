import useAuth from '@hooks/useAuth';
import type { UserRole } from '@lumii/types';
import { AppPaths } from 'common/routes/paths';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles, children }) => {
  const { authenticated, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!authenticated) return <Navigate to={AppPaths.LOGIN} replace />;
  if (!allowedRoles.includes(role)) return <Navigate to={AppPaths.UNAUTHORIZED} replace />;

  return children;
};

export default RoleBasedRoute;
