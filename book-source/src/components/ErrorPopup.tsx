import React, { useEffect } from 'react';
import './ErrorPopup.css';

interface ErrorPopupProps {
  error: string | null;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function ErrorPopup({ 
  error, 
  onClose, 
  autoClose = false,
  autoCloseDelay = 5000 
}: ErrorPopupProps) {
  useEffect(() => {
    if (error && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [error, autoClose, autoCloseDelay, onClose]);

  if (!error) return null;

  return (
    <div className="error-popup-overlay" onClick={onClose}>
      <div 
        className="error-popup-container" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="error-popup-header">
          <div className="error-popup-icon">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="error-popup-title">Error</h3>
        </div>
        <div className="error-popup-content">
          <p className="error-popup-message">{error}</p>
        </div>
        <div className="error-popup-actions">
          <button 
            className="error-popup-close-btn"
            onClick={onClose}
            aria-label="Close error"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

