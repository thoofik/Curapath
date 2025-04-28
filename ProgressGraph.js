import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { supabase } from '../services/supabaseClient';

// Register the chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProgressGraph = ({ patientId }) => {
  const [progressData, setProgressData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProgressData();
  }, [patientId]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      
      // Fetch treatment steps data from Supabase
      const { data, error } = await supabase
        .from('treatment_steps')
        .select('*')
        .eq('patient_id', patientId)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      
      // Process data for chart
      if (data && data.length > 0) {
        const labels = data.map(item => new Date(item.due_date).toLocaleDateString());
        
        // Calculate cumulative completion percentage over time
        const cumulativeCompletionData = data.reduce((acc, item, index) => {
          const prevCompleted = index > 0 ? acc[index - 1] : 0;
          const currentCompleted = item.completed ? 1 : 0;
          acc.push(prevCompleted + currentCompleted);
          return acc;
        }, []);
        
        const completionPercentages = cumulativeCompletionData.map(
          (completed, index) => ((completed / (index + 1)) * 100).toFixed(2)
        );
        
        setProgressData({
          labels,
          datasets: [
            {
              label: 'Recovery Progress (%)',
              data: completionPercentages,
              fill: false,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              tension: 0.1
            }
          ]
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setError('Failed to fetch progress data. Please try again later.');
      setLoading(false);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Recovery Progress Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Completion Percentage'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  if (loading) return <div>Loading progress data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!progressData.labels.length) return <div>No progress data available.</div>;

  return (
    <div className="progress-graph">
      <h2>Recovery Progress</h2>
      <div className="chart-container">
        <Line data={progressData} options={options} />
      </div>
    </div>
  );
};

export default ProgressGraph; 