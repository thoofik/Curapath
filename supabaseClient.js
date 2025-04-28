import { createClient } from '@supabase/supabase-js';

// Environment variables that should be set in a .env file in production
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common database operations
export const fetchPatientData = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    throw error;
  }
};

export const fetchTreatmentSteps = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from('treatment_steps')
      .select('*')
      .eq('patient_id', patientId)
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching treatment steps:', error);
    throw error;
  }
};

export const updateTreatmentStep = async (stepId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('treatment_steps')
      .update(updateData)
      .eq('id', stepId)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error updating treatment step:', error);
    throw error;
  }
};

export const addTreatmentStep = async (stepData) => {
  try {
    const { data, error } = await supabase
      .from('treatment_steps')
      .insert([stepData])
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error adding treatment step:', error);
    throw error;
  }
};

// Functions for managing follow-ups
export const fetchFollowUps = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from('follow_ups')
      .select('*')
      .eq('patient_id', patientId)
      .order('follow_up_date', { ascending: true });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching follow-ups:', error);
    throw error;
  }
};

export const createFollowUp = async (followUpData) => {
  try {
    // Convert the input data to match database column names
    const dataToInsert = {
      patient_id: followUpData.patientId,
      description: followUpData.description,
      follow_up_date: followUpData.followUpDate,
      follow_up_type: followUpData.followUpType,
      completed: false
    };
    
    const { data, error } = await supabase
      .from('follow_ups')
      .insert([dataToInsert])
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error creating follow-up:', error);
    throw error;
  }
};

export const updateFollowUpStatus = async (followUpId, completed) => {
  try {
    const { data, error } = await supabase
      .from('follow_ups')
      .update({ completed })
      .eq('id', followUpId)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error updating follow-up status:', error);
    throw error;
  }
};

export const deleteFollowUp = async (followUpId) => {
  try {
    const { error } = await supabase
      .from('follow_ups')
      .delete()
      .eq('id', followUpId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting follow-up:', error);
    throw error;
  }
}; 