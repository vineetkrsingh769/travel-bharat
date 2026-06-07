import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuth, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="text-muted-foreground text-sm animate-pulse">Checking session…</div>
      </div>
    );
  }

  return isAuth ? children : <Navigate to="/admin/login" replace />;
}
