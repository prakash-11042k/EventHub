import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { UserPlus, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      await register({ fullName, email, phone, password });
      showNotification('Account registered successfully! Welcome to EventHub.', 'success');
      navigate('/events', { replace: true });
    } catch (err) {
      const msg = err.message || 'Registration failed. Email may already be in use.';
      setError(msg);
      showNotification(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '480px', padding: '3rem 1.5rem' }}>
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
            <UserPlus size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem' }}>Create Account</h2>
          <p className="text-muted text-sm mt-1">Join thousands attending top events on EventHub</p>
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
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                className="text-muted"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                required
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

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
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number (Optional)</label>
            <div style={{ position: 'relative' }}>
              <Phone
                size={18}
                className="text-muted"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="tel"
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="+1 555-0192"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                minLength={6}
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Minimum 6 characters"
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
            {submitting ? 'Creating Account...' : 'Register'}
            {!submitting && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
