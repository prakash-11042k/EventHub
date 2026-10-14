import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No items found',
  message = 'There is currently no data to display.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrapper">
        <Icon size={32} />
      </div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-muted mb-6" style={{ maxWidth: '420px', margin: '0 auto 1.5rem' }}>
        {message}
      </p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionText}
        </Link>
      )}
      {actionText && onAction && !actionLink && (
        <button onClick={onAction} className="btn btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
