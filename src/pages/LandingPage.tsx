import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStream, FaCheckCircle, FaClock, FaUsers, FaArrowRight } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Hero Section */}
      <div style={{
        /* Clean corporate card: solid white, subtle border, gentle shadow */
        background: '#ffffff',
        border: '1px solid rgba(2,6,23,0.04)',
        borderRadius: '16px',
        padding: '40px 32px',
        boxShadow: '0 8px 24px rgba(2,6,23,0.04)',
        maxWidth: '900px',
        textAlign: 'center'
      }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'linear-gradient(90deg, #6d28d9 0%, #2563eb 100%)',
            padding: '12px 24px',
            borderRadius: '50px',
            color: 'white',
            fontWeight: '600',
            fontSize: '1rem',
            marginBottom: '30px'
          }}>
            <FaStream size={20} />
            <span>Workflow Management System</span>
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(90deg, #6d28d9 0%, #2563eb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Manage Workflows Efficiently
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: '#6b7280',
            marginBottom: '40px',
            maxWidth: '700px',
            margin: '0 auto 40px'
          }}>
            An integrated system for managing work requests and approvals with comprehensive tracking of statuses and users.
          </p>

          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '16px 40px',
                background: 'linear-gradient(90deg, #6d28d9 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span>Sign In</span>
              <FaArrowRight />
            </button>

            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '16px 40px',
                background: 'white',
                color: '#2563eb',
                border: '2px solid #2563eb',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f0f4ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
              }}
            >
              Create Account
            </button>
        </div>


    </div>
    </div>
  );
};

export default LandingPage;
