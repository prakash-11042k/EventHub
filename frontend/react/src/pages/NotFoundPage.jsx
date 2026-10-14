import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
      <div className="card" style={{ maxWidth: '520px', margin: '0 auto', padding: '3.5rem 2rem' }}>
        <div
          style={{
            fontSize: '5rem',
            fontWeight: 800,
            lineHeight: 1,
            color: 'var(--primary)',
            fontFamily: 'Outfit, sans-serif',
            marginBottom: '1rem',
          }}
        >
          404
        </div>
        <h2 className="mb-2">Page Not Found</h2>
        <p className="text-muted mb-6">
          The page you requested could not be found or may have moved.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/" className="btn btn-secondary">
            <Home size={16} />
            Back to Home
          </Link>
          <Link to="/events" className="btn btn-primary">
            <Compass size={16} />
            Explore Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
