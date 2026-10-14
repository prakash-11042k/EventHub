import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

import { formatDate, formatTime } from '../utils/formatters';

export { formatDate, formatTime };

export const EventCard = ({ event }) => {
  const isSoldOut = event.availableSeats <= 0;
  const fallbackImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="card card-hover event-card">
      <div className="event-image-wrapper">
        <img
          src={event.imageUrl || fallbackImage}
          alt={event.title}
          className="event-card-img"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage;
          }}
        />
        {event.categoryName && (
          <span className="event-category-badge">{event.categoryName}</span>
        )}
      </div>

      <div className="event-card-body">
        <div className="flex justify-between items-center mb-2">
          <span className={`badge ${isSoldOut ? 'badge-danger' : 'badge-success'}`}>
            <Users size={12} />
            {isSoldOut ? 'Sold Out' : `${event.availableSeats} spots left`}
          </span>
          <span className="text-muted text-sm font-semibold">
            Cap: {event.capacity}
          </span>
        </div>

        <h3 className="mb-2" style={{ fontSize: '1.25rem', lineHeight: '1.3' }}>
          {event.title}
        </h3>

        <div className="event-card-meta">
          <div className="event-card-meta-item">
            <Calendar size={15} className="text-primary" />
            <span>{formatDate(event.eventDate)}</span>
          </div>
          <div className="event-card-meta-item">
            <Clock size={15} className="text-primary" />
            <span>{formatTime(event.startTime)}</span>
          </div>
          <div className="event-card-meta-item">
            <MapPin size={15} className="text-primary" />
            <span>{event.location} {event.venue ? `• ${event.venue}` : ''}</span>
          </div>
        </div>

        <div className="event-card-footer">
          <Link to={`/events/${event.id}`} className="btn btn-primary btn-block">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
