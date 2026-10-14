import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="flex items-center gap-2">
          <div className="brand-icon-wrapper" style={{ width: '2rem', height: '2rem' }}>
            <Calendar size={16} />
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>EventHub</span>
          <span>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <Link to="/events" className="text-muted">Browse Events</Link>
          <Link to="/login" className="text-muted">Account</Link>
          <a href="#privacy" className="text-muted" onClick={(e) => e.preventDefault()}>Privacy</a>
          <a href="#terms" className="text-muted" onClick={(e) => e.preventDefault()}>Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
