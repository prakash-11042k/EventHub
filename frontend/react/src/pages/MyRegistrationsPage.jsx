import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { registrationService } from '../services/registrationService';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { formatDate } from '../utils/formatters';
import { Ticket, Calendar, MapPin, Eye, Trash2, AlertCircle } from 'lucide-react';

export const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingEventId, setCancellingEventId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { showNotification } = useNotification();

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await registrationService.getMyRegistrations();
      setRegistrations(data);
    } catch (err) {
      showNotification('Failed to retrieve your registrations.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const confirmCancel = (eventId) => {
    setCancellingEventId(eventId);
    setModalOpen(true);
  };

  const handleCancelRegistration = async () => {
    if (!cancellingEventId) return;

    try {
      await registrationService.cancelRegistration(cancellingEventId);
      showNotification('Registration successfully cancelled.', 'success');
      setModalOpen(false);
      setCancellingEventId(null);
      loadRegistrations();
    } catch (err) {
      showNotification(err.message || 'Failed to cancel registration.', 'error');
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 style={{ fontSize: '2.25rem' }}>My Registered Events</h1>
          <p className="text-muted text-sm mt-1">
            Review your upcoming tickets, event schedules, and reservation statuses.
          </p>
        </div>
        <Link to="/events" className="btn btn-primary btn-sm">
          Browse More Events
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your registrations..." />
      ) : registrations.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No event registrations found"
          message="You haven't reserved tickets for any upcoming events yet. Explore our catalog and grab your seat!"
          actionText="Find Events"
          actionLink="/events"
        />
      ) : (
        <div className="card table-container">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Event Date</th>
                <th>Location</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id || reg.eventId}>
                  <td>
                    <div className="font-semibold" style={{ fontSize: '1rem' }}>
                      {reg.eventTitle}
                    </div>
                    <div className="text-muted text-sm">
                      Registered on {formatDate(reg.registrationDate)}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Calendar size={15} className="text-primary" />
                      <span>{formatDate(reg.eventDate)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-muted">
                      <MapPin size={15} />
                      <span>{reg.location}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        reg.status === 'CONFIRMED' ? 'badge-success' : 'badge-danger'
                      }`}
                    >
                      {reg.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/events/${reg.eventId}`}
                        className="btn btn-secondary btn-sm"
                        title="View event details"
                      >
                        <Eye size={14} />
                        View
                      </Link>
                      {reg.status === 'CONFIRMED' && (
                        <button
                          onClick={() => confirmCancel(reg.eventId)}
                          className="btn btn-danger btn-sm"
                          title="Cancel ticket"
                        >
                          <Trash2 size={14} />
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Cancellation"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Keep Ticket
            </button>
            <button onClick={handleCancelRegistration} className="btn btn-danger">
              Yes, Cancel Ticket
            </button>
          </>
        }
      >
        <div className="flex items-center gap-3 mb-4 text-warning">
          <AlertCircle size={24} />
          <span className="font-semibold">Are you sure you want to cancel this registration?</span>
        </div>
        <p className="text-muted">
          Your seat will be released immediately to other attendees. You can re-register later if seats remain available.
        </p>
      </Modal>
    </div>
  );
};

export default MyRegistrationsPage;
