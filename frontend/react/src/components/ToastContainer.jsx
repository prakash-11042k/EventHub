import React from 'react';
import { useNotification } from '../hooks/useNotification';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {notifications.map(({ id, message, type }) => (
        <div key={id} className={`toast toast-${type}`}>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
            {type === 'success' && <CheckCircle2 size={18} />}
            {type === 'error' && <AlertCircle size={18} />}
            {type === 'info' && <Info size={18} />}
          </div>
          <div style={{ flex: 1 }}>{message}</div>
          <button
            onClick={() => removeNotification(id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              opacity: 0.8,
            }}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
