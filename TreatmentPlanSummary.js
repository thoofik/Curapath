import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import axios from 'axios';

const TreatmentPlanSummary = ({ patientId, language = 'en' }) => {
  const [treatmentSteps, setTreatmentSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translatedSteps, setTranslatedSteps] = useState([]);

  useEffect(() => {
    fetchPatientTreatmentSteps();
  }, [patientId]);

  useEffect(() => {
    if (treatmentSteps.length > 0 && language !== 'en') {
      translateTreatmentSteps();
    } else {
      setTranslatedSteps(treatmentSteps);
    }
  }, [treatmentSteps, language]);

  const fetchPatientTreatmentSteps = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('treatment_steps')
        .select('*')
        .eq('patient_id', patientId);
      
      if (error) throw error;
      
      setTreatmentSteps(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching treatment steps:', error);
      setError('Failed to fetch treatment plan. Please try again later.');
      setLoading(false);
    }
  };

  const translateTreatmentSteps = async () => {
    try {
      const translated = await Promise.all(
        treatmentSteps.map(async (step) => {
          const response = await axios.post('/.netlify/functions/translate', {
            text: step.description,
            targetLanguage: language
          });
          
          return {
            ...step,
            description: response.data.translatedText
          };
        })
      );
      
      setTranslatedSteps(translated);
    } catch (error) {
      console.error('Error translating treatment steps:', error);
      // Fallback to original steps if translation fails
      setTranslatedSteps(treatmentSteps);
    }
  };

  const toggleStepCompletion = async (stepId, completed) => {
    try {
      const { data, error } = await supabase
        .from('treatment_steps')
        .update({ completed: !completed })
        .eq('id', stepId)
        .select();
      
      if (error) throw error;
      
      // Update local state
      setTreatmentSteps(treatmentSteps.map(step => 
        step.id === stepId ? { ...step, completed: !completed } : step
      ));
      
      // Update translated steps too if necessary
      if (language !== 'en') {
        setTranslatedSteps(translatedSteps.map(step => 
          step.id === stepId ? { ...step, completed: !completed } : step
        ));
      }
    } catch (error) {
      console.error('Error updating step completion status:', error);
    }
  };

  if (loading) return <div>Loading treatment plan...</div>;
  if (error) return <div className="error">{error}</div>;
  if (translatedSteps.length === 0) return <div>No treatment steps found.</div>;

  return (
    <div className="treatment-plan-summary">
      <h2>Treatment Plan</h2>
      <ul className="treatment-steps">
        {translatedSteps.map((step) => (
          <li key={step.id} className={`treatment-step ${step.completed ? 'completed' : ''}`}>
            <div className="step-description">{step.description}</div>
            <div className="step-due-date">Due: {new Date(step.due_date).toLocaleDateString()}</div>
            <button 
              className="toggle-completion" 
              onClick={() => toggleStepCompletion(step.id, step.completed)}
            >
              {step.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TreatmentPlanSummary; 