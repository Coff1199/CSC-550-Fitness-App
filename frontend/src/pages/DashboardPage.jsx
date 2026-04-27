import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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
  const goalProgress = data.goalProgress || [];
  // Top goal is already first — sorted by workout count DESC from the API
  const mostActiveGoal = goalProgress.length > 0 ? goalProgress[0] : null;

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

      {/* ── Goal Progress Rings (always visible when goals exist) ── */}
      {goalProgress.length > 0 ? (
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Goal Progress</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem'
          }}>
            {goalProgress.map(goal => (
              <div key={goal.id} style={{ textAlign: 'center' }}>
                <div style={{ width: '140px', margin: '0 auto 1rem' }}>
                  <CircularProgressbar
                    value={goal.progressPct}
                    text={`${Math.round(goal.progressPct)}%`}
                    styles={buildStyles({
                      pathColor: goal.progressPct >= 100 ? '#22c55e' : '#3b82f6',
                      textColor: '#ffffff',
                      trailColor: '#374151',
                      textSize: '18px',
                      pathTransitionDuration: 0.8,
                    })}
                  />
                </div>
                <div style={{ color: '#ffffff', fontWeight: '600', marginBottom: '4px', fontSize: '0.95rem' }}>
                  {goal.goalName}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.82rem' }}>
                  {goal.workoutCount} of {goal.estimatedWorkouts} workouts
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: '#1f2937', padding: '2.5rem', borderRadius: '8px', textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: '#9ca3af', fontSize: '1rem', margin: 0 }}>
            No goals yet.{' '}
            <Link to="/view_goals" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
              Add a goal
            </Link>{' '}
            to start tracking progress!
          </p>
        </div>
      )}

      {/* ── Recent Workouts Table (only when workouts exist) ── */}
      {hasWorkouts && (
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
                <tr
                  key={workout.id}
                  style={{
                    borderBottom: '1px solid #374151',
                    backgroundColor: idx % 2 === 0 ? '#1f2937' : '#111827'
                  }}
                >
                  <td style={{ padding: '0.75rem', color: '#fff' }}>{workout.date}</td>
                  <td style={{ padding: '0.75rem', color: '#fff' }}>{workout.goalName || 'No goal'}</td>
                  <td style={{ padding: '0.75rem', color: '#9ca3af' }}>{workout.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;