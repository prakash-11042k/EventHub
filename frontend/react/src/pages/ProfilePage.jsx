import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { User, Mail, Phone, Shield, Save } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { showNotification } = useNotification();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await updateProfile({ fullName, phone });
      showNotification('Profile updated successfully!', 'success');
    } catch (err) {
      showNotification(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '580px', padding: '2rem 1.5rem' }}>
      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <div className="flex items-center gap-4 mb-6" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-active) 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800,
            }}
          >
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>{user?.fullName || 'My Account'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge ${user?.role === 'ADMIN' ? 'badge-warning' : 'badge-info'}`}>
                <Shield size={12} />
                {user?.role || 'USER'}
              </span>
              <span className="text-muted text-sm">{user?.email}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address (Read Only)</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                className="text-muted"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                readOnly
                disabled
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                value={user?.email || ''}
              />
            </div>
            <small className="text-muted" style={{ display: 'block', marginTop: '0.25rem' }}>
              Account email cannot be modified.
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">System Role</label>
            <div style={{ position: 'relative' }}>
              <Shield
                size={18}
                className="text-muted"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                readOnly
                disabled
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                value={user?.role || 'USER'}
              />
            </div>
          </div>

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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
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
                placeholder="+1 555-0100"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-block btn-lg mt-4"
          >
            {submitting ? (
              'Saving changes...'
            ) : (
              <>
                <Save size={18} />
                Save Profile Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
