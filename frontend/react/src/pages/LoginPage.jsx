import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/events';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      showNotification('Welcome back! Login successful.', 'success');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const msg = err.message || 'Invalid email or password.';
      setError(msg);
      showNotification(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '440px', padding: '3rem 1.5rem' }}>
      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <div className="text-center mb-6">
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary-active)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <LogIn size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem' }}>Welcome Back</h2>
          <p className="text-muted text-sm mt-1">Sign in to manage your tickets and events</p>
        </div>

        {error && (
          <div
            style={{
              background: 'var(--danger-bg)',
              color: '#991b1b',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                className="text-muted"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                required
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                className="text-muted"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="password"
                required
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-block btn-lg mt-4"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
            {!submitting && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-primary">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
