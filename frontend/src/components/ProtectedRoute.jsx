import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-violet-50 to-rose-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 to-violet-500 flex items-center justify-center animate-bounce shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#a7f3d0" />
              <path d="M12 8v4m0 4h.01" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-xl font-semibold text-violet-700 animate-pulse">Loading, please wait...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;