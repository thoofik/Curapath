import React, { useState } from 'react';

const FollowUpForm = ({ patientId, onAddFollowUp, onCancel }) => {
  const [description, setDescription] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpType, setFollowUpType] = useState('call');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!description.trim()) {
      setError('Please enter a follow-up description');
      return;
    }
    
    if (!followUpDate) {
      setError('Please select a follow-up date');
      return;
    }
    
    // Create follow-up data
    const followUpData = {
      patientId,
      description,
      followUpDate,
      followUpType
    };
    
    // Call parent handler
    onAddFollowUp(followUpData);
    
    // Reset form
    setDescription('');
    setFollowUpDate('');
    setFollowUpType('call');
    setError('');
  };

  return (
    <div className="follow-up-form">
      <h3>Add New Follow-Up</h3>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="follow-up-type">Follow-Up Type:</label>
          <select
            id="follow-up-type"
            value={followUpType}
            onChange={(e) => setFollowUpType(e.target.value)}
          >
            <option value="call">Phone Call</option>
            <option value="appointment">Appointment</option>
            <option value="message">Message</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="follow-up-description">Description:</label>
          <textarea
            id="follow-up-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter follow-up details..."
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="follow-up-date">Follow-Up Date:</label>
          <input
            id="follow-up-date"
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Add Follow-Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default FollowUpForm; 