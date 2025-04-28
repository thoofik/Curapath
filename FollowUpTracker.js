import React, { useState, useEffect } from 'react';
import { fetchFollowUps, updateFollowUpStatus } from '../services/supabaseClient';
import FollowUpManager from './FollowUpManager';

const FollowUpTracker = ({ patientId }) => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showManager, setShowManager] = useState(false);

  useEffect(() => {
    loadFollowUps();
  }, [patientId]);

  const loadFollowUps = async () => {
    try {
      setLoading(true);
      
      const data = await fetchFollowUps(patientId);
      
      // Transform data format
      const formattedData = data.map(item => ({
        id: item.id,
        patientId: item.patient_id,
        description: item.description,
        followUpDate: item.follow_up_date,
        followUpType: item.follow_up_type,
        completed: item.completed
      }));
      
      setFollowUps(formattedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
      setError('Failed to fetch follow-up tasks. Please try again later.');
      setLoading(false);
    }
  };

  const toggleFollowUpCompletion = async (followUpId, currentStatus) => {
    try {
      await updateFollowUpStatus(followUpId, !currentStatus);
      
      // Update local state
      setFollowUps(followUps.map(item => 
        item.id === followUpId ? { ...item, completed: !currentStatus } : item
      ));
    } catch (error) {
      console.error('Error updating follow-up status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const calculateProgress = () => {
    if (!followUps.length) return 0;
    
    const completedItems = followUps.filter(item => item.completed).length;
    return Math.round((completedItems / followUps.length) * 100);
  };

  if (showManager) {
    return <FollowUpManager patientId={patientId} />;
  }

  if (loading) return <div>Loading follow-up tasks...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!followUps.length) {
    return (
      <div className="follow-up-tracker empty-state">
        <h2>Follow-Up Tracker</h2>
        <p>No follow-up tasks available.</p>
        <button 
          className="manage-btn"
          onClick={() => setShowManager(true)}
        >
          Manage Follow-Ups
        </button>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="follow-up-tracker">
      <div className="header-actions">
        <h2>Follow-Up Tracker</h2>
        <button 
          className="manage-btn"
          onClick={() => setShowManager(true)}
        >
          Manage Follow-Ups
        </button>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-label">{progress}% Complete</div>
      </div>
      
      <ul className="follow-up-list">
        {followUps.map(item => {
          const dueDate = new Date(item.followUpDate);
          const isOverdue = dueDate <= new Date() && !item.completed;
          
          return (
            <li 
              key={item.id} 
              className={`follow-up-item ${item.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
            >
              <div className="item-checkbox">
                <input 
                  type="checkbox" 
                  checked={item.completed} 
                  onChange={() => toggleFollowUpCompletion(item.id, item.completed)}
                  id={`item-${item.id}`}
                />
                <label htmlFor={`item-${item.id}`}></label>
              </div>
              
              <div className="item-details">
                <div className="item-description">{item.description}</div>
                <div className="item-meta">
                  <span className="item-type">{item.followUpType}</span>
                  <span className="item-due-date">
                    Due: {dueDate.toLocaleDateString()}
                    {isOverdue && <span className="overdue-badge">Overdue</span>}
                  </span>
                </div>
              </div>
              
              <button 
                className="toggle-btn"
                onClick={() => toggleFollowUpCompletion(item.id, item.completed)}
              >
                {item.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FollowUpTracker; 