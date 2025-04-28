import axios from 'axios';

// Base URL for serverless functions
const BASE_URL = '/.netlify/functions';

// Translation service
export const translateText = async (text, targetLanguage) => {
  try {
    const response = await axios.post(`${BASE_URL}/translate`, {
      text,
      targetLanguage
    });
    
    return response.data;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text. Please try again later.');
  }
};

// Patient reports service
export const fetchPatientReports = async (patientId) => {
  try {
    const response = await axios.get(`${BASE_URL}/fetchPatientReports`, {
      params: { patientId }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching patient reports:', error);
    throw new Error('Failed to fetch patient reports. Please try again later.');
  }
};

// Email notification service
export const sendNotification = async (patientId, notificationType, data = {}) => {
  try {
    const response = await axios.post(`${BASE_URL}/sendNotification`, {
      patientId,
      notificationType,
      ...data
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Failed to send notification. Please try again later.');
  }
};

// Schedule follow-up reminder
export const scheduleReminder = async (patientId, stepId, reminderDate) => {
  try {
    const response = await axios.post(`${BASE_URL}/scheduleReminder`, {
      patientId,
      stepId,
      reminderDate
    });
    
    return response.data;
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    throw new Error('Failed to schedule reminder. Please try again later.');
  }
};

// Follow-up management services
export const fetchFollowUps = async (patientId) => {
  try {
    const response = await axios.get(`${BASE_URL}/fetchFollowUps`, {
      params: { patientId }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching follow-ups:', error);
    throw new Error('Failed to fetch follow-up tasks. Please try again later.');
  }
};

export const createFollowUp = async (followUpData) => {
  try {
    const response = await axios.post(`${BASE_URL}/createFollowUp`, followUpData);
    
    return response.data;
  } catch (error) {
    console.error('Error creating follow-up:', error);
    throw new Error('Failed to create follow-up task. Please try again later.');
  }
};

export const updateFollowUpStatus = async (followUpId, completed) => {
  try {
    const response = await axios.put(`${BASE_URL}/updateFollowUp/${followUpId}`, {
      completed
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating follow-up status:', error);
    throw new Error('Failed to update follow-up status. Please try again later.');
  }
};

export const deleteFollowUp = async (followUpId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/deleteFollowUp/${followUpId}`);
    
    return response.data;
  } catch (error) {
    console.error('Error deleting follow-up:', error);
    throw new Error('Failed to delete follow-up task. Please try again later.');
  }
}; 