import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const storedUser = localStorage.getItem('currentUser');
  
  if (!storedUser) {
    // No user logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(storedUser);
  
  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User doesn't have required role, redirect to their dashboard
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return children;
};

export default ProtectedRoute;