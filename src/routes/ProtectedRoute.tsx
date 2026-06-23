import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-6 text-center text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  if (!user) {
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ from: location.pathname, message: "Please log in to submit your idea." }} 
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
