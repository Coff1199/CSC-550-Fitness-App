import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard', {
          withCredentials: true
        });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard');
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        Error: {error}
      </div>
    );
  }

  const hasWorkouts = data.totalWorkouts > 0;
  const mostActiveGoal = data.workoutsByGoal.length > 0 
    ? data.workoutsByGoal.reduce((prev, curr) => prev.count > curr.count ? prev : curr)
    : null;

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#111827' }}>
      <h1 style={{ color: '#fff', marginBottom: '2rem' }}>Progress Dashboard</h1>

      <Link to="/log_workout" style={{
        display: 'inline-block',
        marginBottom: '1.5rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#3b82f6',
        color: '#fff',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold'
      }}>
        + Log Workout
      </Link>
      
      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa' }}>{data.totalWorkouts}</div>
          <div style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Total Workouts</div>
        </div>
        
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa' }}>{data.activeGoalsCount}</div>
          <div style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Active Goals</div>
        </div>
        
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa' }}>
            {mostActiveGoal ? mostActiveGoal.goalName : 'N/A'}
          </div>
          <div style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Most Active Goal</div>
        </div>
      </div>

      {!hasWorkouts ? (
        <div style={{ backgroundColor: '#1f2937', padding: '3rem', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ color: '#9ca3af', fontSize: '1.25rem' }}>
            No workouts logged yet. Start tracking your progress!
          </p>
        </div>
      ) : (
        <>
          {/* Bar Chart */}
          <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Workouts by Goal</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.workoutsByGoal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="goalName" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Workouts Table */}
          <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px' }}>
            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Recent Workouts</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #374151' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#9ca3af' }}>Date</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#9ca3af' }}>Goal</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#9ca3af' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {data.recentWorkouts.map((workout, idx) => (
                  <tr key={workout.id} style={{ borderBottom: '1px solid #374151', backgroundColor: idx % 2 === 0 ? '#1f2937' : '#111827' }}>
                    <td style={{ padding: '0.75rem', color: '#fff' }}>{workout.date}</td>
                    <td style={{ padding: '0.75rem', color: '#fff' }}>{workout.goalName || 'No goal'}</td>
                    <td style={{ padding: '0.75rem', color: '#9ca3af' }}>{workout.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;