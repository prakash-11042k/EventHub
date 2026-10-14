import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { categoryService } from '../../services/categoryService';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { formatDate, formatTime } from '../../utils/formatters';
import { Plus, Edit2, Trash2, Calendar, MapPin, Users, ArrowLeft, AlertCircle } from 'lucide-react';

export const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const [form, setForm] = useState({
    id: null,
    title: '',
    categoryId: '',
    capacity: 100,
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    venue: '',
    description: '',
    imageUrl: '',
    organizer: 'EventHub Admin',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [eventsData, categoriesData] = await Promise.all([
        eventService.getAllEvents(),
        categoryService.getAllCategories(),
      ]);
      setEvents(eventsData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      showNotification('Failed to load events or categories.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateModal = () => {
    setForm({
      id: null,
      title: '',
      categoryId: categories[0]?.id || '',
      capacity: 100,
      eventDate: '',
      startTime: '10:00',
      endTime: '12:00',
      location: '',
      venue: '',
      description: '',
      imageUrl: '',
      organizer: 'EventHub Admin',
    });
    setModalOpen(true);
  };

  const openEditModal = (event) => {
    setForm({
      id: event.id,
      title: event.title || '',
      categoryId: event.categoryId || '',
      capacity: event.capacity || 100,
      eventDate: event.eventDate || '',
      startTime: event.startTime ? event.startTime.substring(0, 5) : '',
      endTime: event.endTime ? event.endTime.substring(0, 5) : '',
      location: event.location || '',
      venue: event.venue || '',
      description: event.description || '',
      imageUrl: event.imageUrl || '',
      organizer: event.organizer || 'EventHub Admin',
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: form.title,
      categoryId: Number(form.categoryId),
      capacity: Number(form.capacity),
      eventDate: form.eventDate,
      startTime: form.startTime.length === 5 ? `${form.startTime}:00` : form.startTime,
      endTime: form.endTime.length === 5 ? `${form.endTime}:00` : form.endTime,
      location: form.location,
      venue: form.venue,
      description: form.description,
      imageUrl: form.imageUrl,
      organizer: form.organizer || 'EventHub Admin',
    };

    try {
      if (form.id) {
        await eventService.updateEvent(form.id, payload);
        showNotification('Event successfully updated.', 'success');
      } else {
        await eventService.createEvent(payload);
        showNotification('New event created successfully.', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      showNotification(err.message || 'Failed to save event.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const promptDelete = (id) => {
    setSelectedEventId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEventId) return;

    try {
      await eventService.deleteEvent(selectedEventId);
      showNotification('Event deleted successfully.', 'success');
      setDeleteModalOpen(false);
      setSelectedEventId(null);
      loadData();
    } catch (err) {
      showNotification(
        'Cannot delete event. It may have registered attendees or active bookings.',
        'error'
      );
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/admin/dashboard" className="text-muted text-sm flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>
          <h1 style={{ fontSize: '2.25rem', marginTop: '0.25rem' }}>Manage Events</h1>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} />
          Create New Event
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading events catalog..." />
      ) : (
        <div className="card table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date & Time</th>
                <th>Category</th>
                <th>Capacity</th>
                <th>Available</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted" style={{ padding: '3rem' }}>
                    No events created yet. Click "Create New Event" above to get started.
                  </td>
                </tr>
              ) : (
                events.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div className="font-semibold" style={{ fontSize: '1rem' }}>
                        {e.title}
                      </div>
                      <div className="text-muted text-sm">
                        📍 {e.location} {e.venue ? `(${e.venue})` : ''}
                      </div>
                    </td>
                    <td>
                      <div>{formatDate(e.eventDate)}</div>
                      <div className="text-muted text-sm">{formatTime(e.startTime)}</div>
                    </td>
                    <td>
                      <span className="badge badge-success">{e.categoryName}</span>
                    </td>
                    <td>{e.capacity}</td>
                    <td>
                      <span className={`badge ${e.availableSeats > 0 ? 'badge-info' : 'badge-danger'}`}>
                        {e.availableSeats}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(e)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Event"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => promptDelete(e.id)}
                          className="btn btn-danger btn-sm"
                          title="Delete Event"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form.id ? 'Edit Event' : 'Create New Event'}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input
              type="text"
              required
              className="form-control"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. NextGen Web Summit 2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="form-label">Category</label>
              <select
                required
                className="form-control"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Total Capacity</label>
              <input
                type="number"
                required
                min={1}
                className="form-control"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                required
                className="form-control"
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Start Time</label>
              <input
                type="time"
                required
                className="form-control"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">End Time</label>
              <input
                type="time"
                required
                className="form-control"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="form-label">Location (City)</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. San Francisco, CA"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Venue / Room</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Moscone Center, Hall B"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Provide a detailed overview of the schedule, speakers, and goals..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Banner Image URL (Optional)</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://example.com/banner.jpg"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Saving...' : form.id ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Event Deletion"
        footer={
          <>
            <button onClick={() => setDeleteModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={confirmDelete} className="btn btn-danger">
              Yes, Delete Event
            </button>
          </>
        }
      >
        <div className="flex items-center gap-3 text-warning mb-3">
          <AlertCircle size={24} />
          <span className="font-semibold">Are you sure you want to permanently delete this event?</span>
        </div>
        <p className="text-muted text-sm">
          This operation cannot be undone. If any attendees have registered for this event, the database integrity constraint will prevent deletion.
        </p>
      </Modal>
    </div>
  );
};

export default ManageEventsPage;
