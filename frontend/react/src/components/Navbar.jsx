import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Calendar, Ticket, User, ShieldCheck, LogOut, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-wrapper">
            <Calendar size={20} strokeWidth={2.5} />
          </div>
          <span>Event<span style={{ color: 'var(--primary)' }}>Hub</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-menu">
          <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Explore Events
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/my-registrations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Ticket size={16} />
                My Registrations
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <User size={16} />
                Profile
              </NavLink>
            </>
          )}

          {isAdmin && (
            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <ShieldCheck size={16} />
              Admin
              <span className="nav-badge-admin">Admin</span>
            </NavLink>
          )}
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="user-profile-chip" title="View Profile">
                <div className="user-avatar">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>{user?.fullName || 'User'}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-sm"
            style={{ display: 'none', padding: '0.4rem' }}
            id="mobile-nav-toggle"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'white',
            borderBottom: '1px solid var(--border)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <Link
            to="/events"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore Events
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/my-registrations"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Registrations
              </Link>
              <Link
                to="/profile"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile ({user?.fullName})
              </Link>
            </>
          )}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
