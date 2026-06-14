import React from 'react';

export default function ConfirmationDialog({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Confirm",
  confirmColor = "var(--danger)",
  data
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-modal">
        <h3 className="modal-title">{title}</h3>
        {data && (
          <div className="modal-user-info">
            <p><strong>Name:</strong> {data.fullName}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Designation:</strong> {data.designation}</p>
          </div>
        )}
        <p className="modal-text">{message}</p>
        <div className="modal-actions">
          <button 
            className="btn btn-outline" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="btn" 
            style={{ background: confirmColor, color: 'white' }}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
