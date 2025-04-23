import React from 'react';
import { Navigate } from 'react-router-dom';
import { getFromLocalStorage } from '../utils/services';

const ProtectedRoute = ({ children, allowedRole }) => {
  const userData = getFromLocalStorage('projectFS');

  if (!userData || !userData.user) {
    return <Navigate to="/" />;
  }

  if (allowedRole && userData.user.role !== allowedRole) {
    return <Navigate to={`/${userData.user.role.toLowerCase()}`} />;
  }

  return children;
};

export default ProtectedRoute;
