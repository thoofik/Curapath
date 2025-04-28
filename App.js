import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TreatmentPlanSummary from './components/TreatmentPlanSummary';
import ProgressGraph from './components/ProgressGraph';
import FollowUpTracker from './components/FollowUpTracker';
import './App.css';

function App() {
  // This would typically come from authentication or URL params
  const [patientId, setPatientId] = useState('1');
  const [language, setLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' }
  ];

  const changeLanguage = (e) => {
    setLanguage(e.target.value);
  };

  // Demo patient ID selection
  const handlePatientChange = (e) => {
    setPatientId(e.target.value);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Curapath</h1>
          <p>Your personalized treatment tracking solution</p>
          
          <div className="language-selector">
            <label htmlFor="language-select">Language: </label>
            <select id="language-select" value={language} onChange={changeLanguage}>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Demo patient selector */}
          <div className="patient-selector">
            <label htmlFor="patient-select">Demo Patient: </label>
            <select id="patient-select" value={patientId} onChange={handlePatientChange}>
              <option value="1">Patient 1</option>
              <option value="2">Patient 2</option>
              <option value="3">Patient 3</option>
            </select>
          </div>
        </header>
        
        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/">Treatment Plan</Link>
            </li>
            <li>
              <Link to="/progress">Progress</Link>
            </li>
            <li>
              <Link to="/follow-up">Follow-up Tasks</Link>
            </li>
          </ul>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={<TreatmentPlanSummary patientId={patientId} language={language} />} 
            />
            <Route 
              path="/progress" 
              element={<ProgressGraph patientId={patientId} />} 
            />
            <Route 
              path="/follow-up" 
              element={<FollowUpTracker patientId={patientId} />} 
            />
          </Routes>
        </main>
        
        <footer className="App-footer">
          <p>&copy; 2025 Curapath. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App; 