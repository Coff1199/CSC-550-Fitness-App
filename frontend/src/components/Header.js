import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EditUser from './EditUser';

const Header = () => {
  const { user, isAuthenticated, logout, checkAuth } = useAuth();
  const [showEditUser, setShowEditUser] = useState(false);

  function fetchUserData() {
    checkAuth();
  }

  return (
    <header style={{
      backgroundColor: '#1f2937',
      padding: '1rem 2rem',
      borderBottom: '1px solid #374151'
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>

        <div style={{ display: 'flex', gap: '2rem' }}>
          {isAuthenticated && (
            <>
              <Link to="/" style={{ color: '#fff' }}>Home</Link>
              <Link to="/view_goals" style={{ color: '#fff' }}>View Goals</Link>
            </>
          )}
        </div>

        {isAuthenticated && (
          <div style={{ display: 'flex', gap: '10px' }}>
            
            <button
              onClick={() => setShowEditUser(true)}
              style={{
                backgroundColor: 'transparent',
                color: '#e5e7eb',
                border: '1px solid #4b5563',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Edit Profile
            </button>

            <button
              onClick={logout}
              style={{
                backgroundColor: '#ef4444',
                color: '#fff',
                padding: '6px 14px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>

          </div>
        )}

      </nav>

      {showEditUser && isAuthenticated && (
        <EditUser
          userId={user.id}
          firstname={user.firstname}
          lastname={user.lastname}
          email={user.email}
          onClose={() => setShowEditUser(false)}
          onUserUpdated={() => {
            fetchUserData();
            setShowEditUser(false);
          }}
        />
      )}

    </header>
  );
};

export default Header;