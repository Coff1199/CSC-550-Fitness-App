import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

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
              <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
              <Link to="/view_goals" style={{ color: '#fff', textDecoration: 'none' }}>View Goals</Link>
            </>
          )}
        </div>
        {isAuthenticated && (
          <button 
            onClick={logout}
            style={{
              backgroundColor: '#ef4444',
              color: '#fff',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
