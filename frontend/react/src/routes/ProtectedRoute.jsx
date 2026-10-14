import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Checking authentication status..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--danger-bg)', borderRadius: '50%', color: 'var(--danger)', marginBottom: '1.5rem' }}>
            <ShieldAlert size={40} />
          </div>
          <h2 className="mb-2">Access Restricted</h2>
          <p className="text-muted mb-6">
            You do not have administrative privileges to view this section.
          </p>
          <Link to="/events" className="btn btn-primary">
            Return to Events
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
