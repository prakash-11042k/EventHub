import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles, Calendar, Compass, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const events = await eventService.getAllEvents();
        const sanitized = (events || []).filter(
          (e) => !e.title || !e.title.toLowerCase().includes('java full stack developer meetup')
        );
        setFeaturedEvents(sanitized.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured events', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-pill">
            <Sparkles size={16} />
            <span>Discover Top Community & Tech Events</span>
          </div>

          <h1 className="hero-title">
            Connect, Learn, and Experience <br />
            <span className="hero-highlight">Events That Inspire You</span>
          </h1>

          <p className="hero-subtitle">
            EventHub is your curated platform for workshops, technology conferences,
            meetups, and entertainment. Reserve your spot with a single click.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link to="/events" className="btn btn-primary btn-lg">
              <Compass size={20} />
              Explore All Events
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Get Started Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured / Upcoming Events */}
      <section className="container mt-8 mb-8" style={{ paddingTop: '2rem' }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: '2rem' }}>Upcoming Featured Events</h2>
            <p className="text-muted text-sm mt-1">
              Hand-picked events happening soon. Reserve your seat before capacity is reached.
            </p>
          </div>
          <Link to="/events" className="btn btn-secondary btn-sm">
            View All Events
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching upcoming events..." />
        ) : featuredEvents.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <p className="text-muted">No events currently scheduled. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose EventHub */}
      <section className="container mt-8 mb-8">
        <div
          className="card"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            padding: '4rem 2rem',
            textAlign: 'center',
            borderColor: 'var(--border)',
          }}
        >
          <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>
            Why Choose EventHub?
          </h2>
          <p className="text-muted" style={{ maxWidth: '580px', margin: '0 auto 3rem' }}>
            Built for modern attendees and event organizers alike with reliability, speed, and real-time inventory management.
          </p>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="card" style={{ padding: '2rem 1.5rem', background: '#ffffff' }}>
              <div
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary-active)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <Compass size={28} />
              </div>
              <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Smart Discovery</h3>
              <p className="text-muted text-sm">
                Filter and search effortlessly across technology, business, workshops, and sports categories.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem 1.5rem', background: '#ffffff' }}>
              <div
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary-active)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <CheckCircle2 size={28} />
              </div>
              <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Instant Confirmation</h3>
              <p className="text-muted text-sm">
                Real-time seat reservation guarantees your registration without double bookings or waitlists.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem 1.5rem', background: '#ffffff' }}>
              <div
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary-active)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Stateless JWT Security</h3>
              <p className="text-muted text-sm">
                Enterprise-grade token-based authentication protects your private information and ticket history.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
