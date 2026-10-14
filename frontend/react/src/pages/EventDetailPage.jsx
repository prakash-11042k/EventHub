import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, formatTime } from '../utils/formatters';
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Share2,
} from 'lucide-react';

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { showNotification } = useNotification();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadEvent = useCallback(async () => {
    setLoading(true);
    try {
      const data = await eventService.getEventById(id);
      setEvent(data);
    } catch (err) {
      showNotification('Event not found or failed to load.', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showNotification]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      showNotification('Please log in to register for events.', 'info');
      navigate('/login', { state: { from: location } });
      return;
    }

    setSubmitting(true);
    try {
      await registrationService.registerForEvent(id);
      showNotification('Registration successful! Your ticket is confirmed.', 'success');
      navigate('/my-registrations');
    } catch (err) {
      showNotification(err.message || 'Failed to complete registration.', 'error');
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showNotification('Link copied to clipboard!', 'info');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <LoadingSpinner text="Loading event details..." />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
          <AlertTriangle size={48} className="text-warning mb-4" style={{ margin: '0 auto' }} />
          <h2 className="mb-2">Event Not Found</h2>
          <p className="text-muted mb-6">
            The event you are looking for does not exist or has been removed.
          </p>
          <Link to="/events" className="btn btn-primary">
            Back to Events Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isSoldOut = event.availableSeats <= 0;
  const fallbackImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <div className="mb-6 flex justify-between items-center">
        <Link to="/events" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
          <ArrowLeft size={16} />
          Back to Events
        </Link>
        <button onClick={handleShare} className="btn btn-secondary btn-sm">
          <Share2 size={16} />
          Share Event
        </button>
      </div>

      <div className="card overflow-hidden mb-8">
        {/* Banner Image */}
        <div style={{ position: 'relative', width: '100%', height: '360px', background: '#e2e8f0' }}>
          <img
            src={event.imageUrl || fallbackImage}
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />
          {event.categoryName && (
            <span
              className="badge badge-success"
              style={{
                position: 'absolute',
                top: '1.5rem',
                left: '1.5rem',
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {event.categoryName}
            </span>
          )}
        </div>

        <div style={{ padding: '2.5rem' }}>
          <div className="grid grid-cols-3 gap-8">
            {/* Left 2 Cols: Main Info */}
            <div style={{ gridColumn: 'span 2' }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                {event.title}
              </h1>

              <div
                className="grid grid-cols-2 gap-4 mb-6"
                style={{
                  background: 'var(--bg-subtle)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      padding: '0.65rem',
                      background: 'white',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--primary)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="text-muted text-sm">Date</div>
                    <div className="font-semibold">{formatDate(event.eventDate)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    style={{
                      padding: '0.65rem',
                      background: 'white',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--primary)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-muted text-sm">Time</div>
                    <div className="font-semibold">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    style={{
                      padding: '0.65rem',
                      background: 'white',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--primary)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-muted text-sm">Location</div>
                    <div className="font-semibold">{event.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    style={{
                      padding: '0.65rem',
                      background: 'white',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--primary)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <Building size={20} />
                  </div>
                  <div>
                    <div className="text-muted text-sm">Venue</div>
                    <div className="font-semibold">{event.venue || 'Main Auditorium'}</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-3" style={{ fontSize: '1.4rem' }}>About This Event</h3>
                <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)', lineHeight: '1.8' }}>
                  {event.description || 'No additional description provided.'}
                </p>
              </div>

              {event.organizer && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <h4 className="text-muted text-sm mb-1">Organized By</h4>
                  <p className="font-semibold">{event.organizer}</p>
                </div>
              )}
            </div>

            {/* Right Col: Registration Card */}
            <div>
              <div
                className="card"
                style={{
                  position: 'sticky',
                  top: '6rem',
                  padding: '2rem 1.75rem',
                  background: 'var(--bg-subtle)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted text-sm font-semibold">Seat Availability</span>
                  <span className={`badge ${isSoldOut ? 'badge-danger' : 'badge-success'}`}>
                    {isSoldOut ? 'Sold Out' : `${event.availableSeats} of ${event.capacity} left`}
                  </span>
                </div>

                <div
                  style={{
                    background: 'white',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div className="text-muted text-sm mb-1">Registration Fee</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                    Free
                  </div>
                </div>

                <button
                  onClick={handleRegister}
                  disabled={isSoldOut || submitting}
                  className="btn btn-primary btn-block btn-lg"
                >
                  {submitting ? (
                    'Confirming...'
                  ) : isSoldOut ? (
                    'Event Sold Out'
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Register Now
                    </>
                  )}
                </button>

                <p className="text-muted text-sm text-center mt-4">
                  Instant registration confirmation. Manage or cancel tickets anytime from your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
