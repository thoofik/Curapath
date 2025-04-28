import React, { useState, useEffect } from 'react';
import FollowUpForm from './FollowUpForm';
import FollowUpList from './FollowUpList';
import { fetchFollowUps, createFollowUp, updateFollowUpStatus, deleteFollowUp } from '../services/supabaseClient';
import './FollowUp.css';

const FollowUpManager = ({ patientId }) => {
  const [followUps, setFollowUps] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load follow-ups from database
  useEffect(() => {
    const loadFollowUps = async () => {
      try {
        setLoading(true);
        const data = await fetchFollowUps(patientId);
        
        // Transform data from database format to component format if needed
        const formattedData = data.map(item => ({
          id: item.id,
          patientId: item.patient_id,
          description: item.description,
          followUpDate: item.follow_up_date,
          followUpType: item.follow_up_type,
          completed: item.completed
        }));
        
        setFollowUps(formattedData);
        setError('');
      } catch (error) {
        console.error('Error loading follow-ups:', error);
        setError('Failed to load follow-up tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadFollowUps();
  }, [patientId]);

  // Add a new follow-up
  const handleAddFollowUp = async (followUpData) => {
    try {
      setLoading(true);
      
      // Save to database
      const newFollowUp = await createFollowUp(followUpData);
      
      // Format for component state
      const formattedFollowUp = {
        id: newFollowUp.id,
        patientId: newFollowUp.patient_id,
        description: newFollowUp.description,
        followUpDate: newFollowUp.follow_up_date,
        followUpType: newFollowUp.follow_up_type,
        completed: newFollowUp.completed
      };
      
      // Add to state
      setFollowUps([...followUps, formattedFollowUp]);
      setError('');
      
      // Hide the form after submission
      setShowForm(false);
    } catch (error) {
      console.error('Error adding follow-up:', error);
      setError('Failed to add follow-up task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle completion status
  const handleComplete = async (id) => {
    try {
      // Find current item to get its completion status
      const currentItem = followUps.find(item => item.id === id);
      if (!currentItem) return;
      
      // Update in database
      await updateFollowUpStatus(id, !currentItem.completed);
      
      // Update local state
      setFollowUps(followUps.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      ));
      
      setError('');
    } catch (error) {
      console.error('Error updating follow-up status:', error);
      setError('Failed to update follow-up status. Please try again.');
    }
  };

  // Delete a follow-up
  const handleDelete = async (id) => {
    try {
      // Delete from database
      await deleteFollowUp(id);
      
      // Update local state
      setFollowUps(followUps.filter(item => item.id !== id));
      
      setError('');
    } catch (error) {
      console.error('Error deleting follow-up:', error);
      setError('Failed to delete follow-up task. Please try again.');
    }
  };

  return (
    <div className="follow-up-manager">
      <div className="follow-up-header">
        <h2>Follow-Up Management</h2>
        {!showForm && (
          <button 
            className="add-follow-up-button"
            onClick={() => setShowForm(true)}
          >
            + Add Follow-Up
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <FollowUpForm 
          patientId={patientId}
          onAddFollowUp={handleAddFollowUp}
          onCancel={() => setShowForm(false)}
        />
      )}
      
      {loading && followUps.length === 0 ? (
        <div className="loading-indicator">Loading follow-ups...</div>
      ) : (
        <FollowUpList 
          followUps={followUps}
          onComplete={handleComplete}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default FollowUpManager; 