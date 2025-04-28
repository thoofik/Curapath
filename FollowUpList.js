import React from 'react';

const FollowUpList = ({ followUps, onComplete, onDelete }) => {
  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get type label based on type value
  const getTypeLabel = (type) => {
    const types = {
      call: 'Phone Call',
      appointment: 'Appointment',
      message: 'Message',
      other: 'Other'
    };
    
    return types[type] || 'Follow-up';
  };

  // If no follow-ups, show a message
  if (!followUps || followUps.length === 0) {
    return (
      <div className="follow-up-list empty-list">
        <p>No follow-up items scheduled.</p>
      </div>
    );
  }

  return (
    <div className="follow-up-list">
      <h3>Scheduled Follow-Ups</h3>
      <ul>
        {followUps.map((item) => (
          <li key={item.id} className={`follow-up-item ${item.completed ? 'completed' : ''}`}>
            <div className="follow-up-info">
              <div className="follow-up-header">
                <span className="follow-up-type">{getTypeLabel(item.followUpType)}</span>
                <span className="follow-up-date">{formatDate(item.followUpDate)}</span>
              </div>
              <p className="follow-up-description">{item.description}</p>
            </div>
            <div className="follow-up-actions">
              {!item.completed && (
                <button 
                  className="complete-button"
                  onClick={() => onComplete(item.id)}
                  aria-label="Mark as completed"
                >
                  ✓
                </button>
              )}
              <button 
                className="delete-button"
                onClick={() => onDelete(item.id)}
                aria-label="Delete follow-up"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowUpList; 